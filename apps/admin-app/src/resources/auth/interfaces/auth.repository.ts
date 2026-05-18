import { AdminEntity } from "@app/common/database/entities";
import { AdminLoginDTO, CreateAdminDTO } from "../dto";
import { Admin } from "@app/common/database";


export interface IAuthRepository {

    adminLogin(dto: AdminLoginDTO): Promise<{ message: string, token: string }>;
    
    createAdmin(id: string, dto: CreateAdminDTO): Promise<AdminEntity | Admin>;
    
}