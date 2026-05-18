import { Admin, User } from "@app/common";
import { AdminEntity, UserEntity } from "@app/common/database/entities";

export interface IUserRepository {

    getAllBarbers(): Promise<UserEntity[] | User[]>;

    getAllClients(): Promise<UserEntity[] | User[]>;
    
    getOneUser(id: string): Promise<UserEntity | User>;
    
    deleteUser(userId: string): Promise<{message: string}>;
    
    unlockesUser(userId: string): Promise<UserEntity | User>;

    getAllAdmins(adminId: string) : Promise<AdminEntity[] | Admin[]>;

}