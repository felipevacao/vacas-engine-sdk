import { reportRegistry } from '@services';
import { UsersListsReportProvider } from './reports/userList';

// não incluir o arquivo de rotas
export * from './controller'
export * from './entity'
export * from './express.adapter'
export * from './grpc.adapter'
export * from './middleware'
export * from './model'
export * from './service'
export * from './roles.service'

reportRegistry.register('users-list', new UsersListsReportProvider());