import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { Logger } from '@utils/log';
import { readdirSync, existsSync } from 'fs';

import env from './libs/env';

/**
 * Interface para representar a estrutura do descriptor do gRPC carregado
 */
interface GrpcServiceDefinition {
  service: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}

interface GrpcPackage {
  [key: string]: GrpcServiceDefinition | unknown;
}

/**
 * Tipo para métodos gRPC unários
 */
type UnaryHandler = (
  call: grpc.ServerUnaryCall<unknown, unknown>,
  callback: grpc.sendUnaryData<unknown>
) => void;

export class GrpcServer {
  private server: grpc.Server;
  private port: number;

  constructor(port: number = 50051) {
    this.server = new grpc.Server({
      'grpc.initial_reconnect_backoff_ms': 1000,
      'grpc.max_reconnect_backoff_ms': 5000,
    });
    this.port = port;
  }

  /**
   * Envolve a implementação do serviço com uma camada de autenticação
   */
  private wrapServiceWithAuth(implementation: grpc.UntypedServiceImplementation): grpc.UntypedServiceImplementation {
    const wrapped: grpc.UntypedServiceImplementation = {};

    for (const methodName of Object.keys(implementation)) {
      const originalMethod = implementation[methodName];

      if (typeof originalMethod === 'function') {
        const handler: UnaryHandler = (call, callback) => {
          const metadata = call.metadata.get('x-internal-key');
          const internalKey = metadata[0];

          if (internalKey !== env.INTERNAL_API_KEY) {
            Logger.warn(`[gRPC] Tentativa de acesso não autorizado: ${methodName}`);
            callback({
              code: grpc.status.UNAUTHENTICATED,
              message: 'Invalid Internal API Key'
            }, null);
            return;
          }

          // Executa o método original com a tipagem correta
          (originalMethod as UnaryHandler)(call, callback);
        };

        wrapped[methodName] = handler as unknown as grpc.UntypedHandleCall;
      }
    }

    return wrapped;
  }

  private async loadDynamicModules(): Promise<void> {
    // Busca os protos na pasta src (que é copiada para o container)
    // Se estivermos em dist/grpc.js, voltamos um nível para achar src/
    const protosPath = __dirname.includes('dist') 
      ? join(__dirname, '..', 'src', 'dynamic-modules', 'protos')
      : join(__dirname, 'dynamic-modules', 'protos');

    const adaptersPath = join(__dirname, 'dynamic-modules', 'adapters', 'grpc');

    if (!existsSync(protosPath)) {
      Logger.warn(`[gRPC] Pasta de protos não encontrada: ${protosPath}`);
      return;
    }

    const files = readdirSync(protosPath).filter(f => f.endsWith('.proto'));

    for (const file of files) {
      const entityName = file.replace('.proto', '');
      const protoPath = join(protosPath, file);

      const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [
          __dirname.includes('dist') 
            ? join(__dirname, '..', 'src', 'proto')
            : join(__dirname, 'proto')
        ]
      });

      const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as Record<string, GrpcPackage>;

      const adapterFile = join(adaptersPath, `${entityName}.ts`);
      const adapterJsFile = join(__dirname, 'dynamic-modules', 'grpc-adapters', `${entityName}.js`);
      const targetFile = existsSync(adapterJsFile) ? adapterJsFile : (existsSync(adapterFile) ? adapterFile : null);

      if (targetFile) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const adapterModule = require(targetFile) as { default?: grpc.UntypedServiceImplementation;[key: string]: unknown };
          const serviceName = `${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Service`;

          const pkg = protoDescriptor[entityName];
          if (pkg && typeof pkg === 'object') {
            const serviceDef = pkg[serviceName] as GrpcServiceDefinition;
            if (serviceDef && serviceDef.service) {
              const implementation = adapterModule.default || (adapterModule as unknown as grpc.UntypedServiceImplementation);
              
              const securedImplementation = this.wrapServiceWithAuth(implementation);
              
              this.server.addService(serviceDef.service, securedImplementation);
              Logger.info(`[gRPC] Serviço carregado com segurança: ${serviceName}`);
            }
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : 'Unknown error';
          Logger.error(`[gRPC] Erro ao carregar serviço ${entityName}: ${msg}`);
        }
      }
    }
  }

  public async start(): Promise<void> {
    await this.loadDynamicModules();

    this.server.bindAsync(
      `0.0.0.0:${this.port}`,
      grpc.ServerCredentials.createInsecure(),
      (error: Error | null, port: number) => {
        if (error) {
          Logger.error(`[gRPC] Falha ao iniciar servidor na porta ${this.port}`, error);
          return;
        }
        Logger.info(`[gRPC] Servidor rodando na porta ${port}`);
      }
    );
  }
}
