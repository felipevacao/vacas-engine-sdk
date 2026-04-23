import { BaseEntity, BaseView, ReportProvider } from '@interfaces';
import { UsersEntity } from '../entity'; // Ajuste conforme a estrutura real do módulo
import UsersModel from '../model'; // Ajuste conforme a estrutura real do módulo
import { QueryFields, UserRolesType } from '@app-types';
import { BaseReportProvider } from '@controllers';

export interface UserReportFilters {
  role?: UserRolesType;
}

export interface UserReportRow {
  name: string;
  email: string;
}

export class UsersListsReportProvider<T extends BaseEntity | BaseView, R = UserReportRow> extends BaseReportProvider<T, R> implements ReportProvider<QueryFields<T>, R> {
  moduleId = 'users';
  reportId = 'users-list';
  reportFields = [
    { name: 'name', label: 'Nome do Usuário', type: 'string' },
    { name: 'email', label: 'E-mail', type: 'string' }
  ];

  async fetchData(options: QueryFields<T>): Promise<R[]> {

    const users = await UsersModel.findBy(options);
    if (!users) return [] as R[];

    return users.map((user: Partial<UsersEntity>) => ({
      name: user.name,
      email: user.email
    })) as R[];
  }
}
