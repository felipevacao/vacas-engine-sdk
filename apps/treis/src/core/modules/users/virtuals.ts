import { IVirtualFieldDefinition } from "@interfaces";
import { UsersEntity } from "./entity";

export const UserVirtuals: IVirtualFieldDefinition<UsersEntity> = {
    initials: (row: UsersEntity) => {
        if (!row.name) return '';
        return row.name
            .split(' ')
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join('')
            .toUpperCase();
    }
};
