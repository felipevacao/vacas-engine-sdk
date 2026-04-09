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

  private async loadService(entityName: string, protoPath: string, adapterFile: string, includeDirs: string[]): Promise<void> {
    try {
      const packageDefinition = protoLoader.loadSync(protoPath, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs
      });

      const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as Record<string, GrpcPackage>;
      
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const adapterModule = require(adapterFile) as { default?: grpc.UntypedServiceImplementation; [key: string]: unknown };
      const serviceName = `${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Service`;

      const pkg = protoDescriptor[entityName];
      if (pkg && typeof pkg === 'object') {
        const serviceDef = pkg[serviceName] as GrpcServiceDefinition;
        if (serviceDef && serviceDef.service) {
          const implementation = adapterModule.default || (adapterModule as unknown as grpc.UntypedServiceImplementation);
          const securedImplementation = this.wrapServiceWithAuth(implementation);
          this.server.addService(serviceDef.service, securedImplementation);
          Logger.info(`[gRPC] Serviço carregado: ${serviceName}`);
        }
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      Logger.error(`[gRPC] Erro ao carregar serviço ${entityName}: ${msg}`);
    }
  }

  private async loadDynamicModules(): Promise<void> {
    const isDist = __dirname.includes('dist');
    
    const commonIncludeDirs = [
      isDist ? join(__dirname, 'proto') : join(__dirname, 'proto') // Ajustado para refletir a estrutura real
    ];

    // 1. Carrega módulos do Core (ex: users)
    const coreModulesDir = join(__dirname, 'modules');
    if (existsSync(coreModulesDir)) {
      const modules = readdirSync(coreModulesDir);
      for (const moduleName of modules) {
        const protoPath = join(coreModulesDir, moduleName, `${moduleName}.proto`);
        const adapterPath = join(coreModulesDir, moduleName, `grpc.adapter.${isDist ? 'js' : 'ts'}`);

        if (existsSync(protoPath) && existsSync(adapterPath)) {
          await this.loadService(moduleName, protoPath, adapterPath, commonIncludeDirs);
        }
      }
    }

    // 2. Carrega módulos dinâmicos específicos do projeto (Plug & Play)
    const dynamicModulesDir = join(__dirname, '..', 'dynamic-modules');
    if (existsSync(dynamicModulesDir)) {
      const items = readdirSync(dynamicModulesDir, { withFileTypes: true });
      for (const item of items) {
        if (item.isDirectory()) {
          const moduleName = item.name;
          const modulePath = join(dynamicModulesDir, moduleName);
          
          // Procura por [modulo].proto e grpc.adapter.ts dentro da pasta do módulo
          const protoPath = join(modulePath, `${moduleName}.proto`);
          const adapterPath = join(modulePath, `grpc.adapter.${isDist ? 'js' : 'ts'}`);

          if (existsSync(protoPath) && existsSync(adapterPath)) {
            await this.loadService(moduleName, protoPath, adapterPath, [modulePath, ...commonIncludeDirs]);
          }
        }
      }

      // Suporte legado: /dynamic-modules/protos/*.proto e /dynamic-modules/adapters/grpc/*.ts
      const legacyProtosDir = join(dynamicModulesDir, 'protos');
      const legacyAdaptersDir = join(dynamicModulesDir, 'adapters', 'grpc');
      if (existsSync(legacyProtosDir) && existsSync(legacyAdaptersDir)) {
        const files = readdirSync(legacyProtosDir).filter(f => f.endsWith('.proto'));
        for (const file of files) {
          const entityName = file.replace('.proto', '');
          const protoPath = join(legacyProtosDir, file);
          const adapterPath = join(legacyAdaptersDir, `${entityName}.${isDist ? 'js' : 'ts'}`);
          if (existsSync(adapterPath)) {
            await this.loadService(entityName, protoPath, adapterPath, commonIncludeDirs);
          }
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
