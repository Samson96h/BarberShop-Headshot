import { AdminEntity } from "@app/common/database/entities";
import { AdminLoginDTO, CreateAdminDTO } from "../dto";
import { Admin } from "@app/common/database";


export interface IAuthRepository {


    findAdminByLogin(login: string): Promise<AdminEntity | null>;

    findAdminById(id: string): Promise<AdminEntity | null>;

    saveAdmin(admin: AdminEntity): Promise<AdminEntity>;

    createAdmin(data: Partial<AdminEntity>): AdminEntity;

}