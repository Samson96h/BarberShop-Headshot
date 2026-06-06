import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";
import { SecretCode, UserEntity } from "@app/common/database/entities";
import { ChangeStatusDTO } from "../dto";


export interface IAuthRepository {

    findUserByPhone(phone: string): Promise<UserEntity | null>;

    createUser(data: Partial<UserEntity>): Promise<UserEntity>;

    saveUser(user: UserEntity): Promise<UserEntity>;

    findCode(phone: string, code: string): Promise<SecretCode | null>;

    createCode(user: UserEntity, code: string): Promise<SecretCode>;

    deleteCode(codeId: string): Promise<void>;

    deleteOldCodes(phone: string): Promise<void>;

    createSecurity(user: UserEntity): Promise<UserSecurityEntity>;

    saveSecurity(security: UserSecurityEntity): Promise<UserSecurityEntity>;

    changeStatusUser(userId: string, dto: ChangeStatusDTO): Promise<UserEntity | null>;

}