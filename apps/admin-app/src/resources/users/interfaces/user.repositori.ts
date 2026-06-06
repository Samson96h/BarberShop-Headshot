import { UserEntity, AdminEntity } from "@app/common/database/entities";
import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";

export interface IUserRepository {

    getUserById(id: string): Promise<UserEntity | null>;

    getAllBarbers(): Promise<UserEntity[]>;

    getAllClients(): Promise<UserEntity[]>;

    deleteUser(userId: string): Promise<void>;

    getAllAdmins(): Promise<AdminEntity[]>;

    getOneAdmin(adminId: string): Promise<AdminEntity | null>;

    findSecurityByUserId(userId: string): Promise<UserSecurityEntity | null>;

    saveUser(user: UserEntity): Promise<UserEntity>;

    saveSecurity(security: UserSecurityEntity): Promise<UserSecurityEntity>;

}