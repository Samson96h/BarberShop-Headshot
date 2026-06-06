import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";
import { SecretCode, UserEntity } from "@app/common/database/entities";
import { IAuthRepository } from "../interfaces/auth.repository";
import { ChangeStatusDTO } from "../dto";


@Injectable()
export class AuthPostgreRepository implements IAuthRepository {

    constructor(

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(SecretCode)
        private readonly secretRepository: Repository<SecretCode>,

        @InjectRepository(UserSecurityEntity)
        private readonly securityRepository: Repository<UserSecurityEntity>

    ) { }


    async findUserByPhone(phone: string): Promise<UserEntity | null> {

        return this.userRepository.findOne({ where: { phone }, relations: ['security'] })
    }


    async createUser(data: Partial<UserEntity>): Promise<UserEntity> {

        const user = this.userRepository.create(data)

        return this.userRepository.save(user)
    }


    async saveUser(user: UserEntity): Promise<UserEntity> {

        return this.userRepository.save(user)
    }


    async findCode(phone: string, code: string): Promise<SecretCode | null> {

        return this.secretRepository.findOne({ where: { code, user: { phone } }, relations: ['user'] })
    }


    async createCode(user: UserEntity, code: string): Promise<SecretCode> {

        const secretCode = this.secretRepository.create({
            code,
            user
        })

        return this.secretRepository.save(secretCode)
    }


    async deleteCode(codeId: string): Promise<void> {

        await this.secretRepository.delete({ id: +codeId })
    }


    async deleteOldCodes(phone: string): Promise<void> {

        const user = await this.findUserByPhone(phone)

        if (!user) return

        await this.secretRepository.delete({ user: { id: user.id } })
    }


    async createSecurity(user: UserEntity): Promise<UserSecurityEntity> {

        const security = this.securityRepository.create({ user })

        return this.securityRepository.save(security)
    }


    async saveSecurity(security: UserSecurityEntity): Promise<UserSecurityEntity> {

        return this.securityRepository.save(security)
    }


    async changeStatusUser(userId: string, dto: ChangeStatusDTO): Promise<UserEntity | null> {

        const user = await this.userRepository.findOne({ where: { id: +userId } })

        if (!user) throw new NotFoundException('user not found')

        user.role = dto.role

        return this.userRepository.save(user)
    }

}