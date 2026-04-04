import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join } from 'path';
import { Logger } from '@utils/log';
import { readdirSync, existsSync } from 'fs';

/**
 * Interface para representar a estrutura do descriptor do gRPC carregado
 */
interface GrpcServiceDefinition {
  service: grpc.ServiceDefinition<grpc.UntypedServiceImplementation>;
}

interface GrpcPackage {
  [key: string]: GrpcServiceDefinition | unknown;
}

export class GrpcServer {
  private server: grpc.Server;
  private port: number;

  constructor(port: number = 50051) {
    this.server = new grpc.Server();
    this.port = port;
  }

  private async loadDynamicModules(): Promise<void> {
    const protosPath = join(__dirname, 'dynamic-modules', 'protos');
    const adaptersPath = join(__dirname, 'dynamic-modules', 'grpc-adapters');

    if (!existsSync(protosPath)) return;

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
        includeDirs: [join(__dirname, 'proto')]
      });

      const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as unknown as Record<string, GrpcPackage>;
      
      const adapterFile = join(adaptersPath, `${entityName}.ts`);
      const adapterJsFile = join(__dirname, 'dynamic-modules', 'grpc-adapters', `${entityName}.js`);
      const targetFile = existsSync(adapterJsFile) ? adapterJsFile : (existsSync(adapterFile) ? adapterFile : null);
      
      if (targetFile) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          const adapterModule = require(targetFile) as { default?: grpc.UntypedServiceImplementation; [key: string]: unknown };
          const serviceName = `${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Service`;
          
          const pkg = protoDescriptor[entityName];
          if (pkg && typeof pkg === 'object') {
            const serviceDef = pkg[serviceName] as GrpcServiceDefinition;
            if (serviceDef && serviceDef.service) {
              const implementation = adapterModule.default || (adapterModule as unknown as grpc.UntypedServiceImplementation);
              this.server.addService(serviceDef.service, implementation);
              Logger.info(`[gRPC] Serviço carregado: ${serviceName}`);
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
