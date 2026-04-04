import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = join(__dirname, '../src/dynamic-modules/protos/users.proto');
const INCLUDE_PATH = join(__dirname, '../src/proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [INCLUDE_PATH]
});

const usersProto = grpc.loadPackageDefinition(packageDefinition).users;

function main() {
  // @ts-ignore - UsersService existe dinamicamente
  const client = new usersProto.UsersService(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );

  console.log('--- Testando gRPC: List Users ---');
  client.List({ page: 1, limit: 5 }, (error, response) => {
    if (error) {
      console.error('Erro no gRPC:', error.message);
      return;
    }
    console.log('Status:', response.status);
    console.log('Total de usuários:', response.total);
    console.log('Dados:', JSON.stringify(response.data, null, 2));
  });
}

main();
