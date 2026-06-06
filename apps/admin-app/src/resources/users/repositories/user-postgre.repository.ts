import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";
import { AdminEntity, UserEntity } from "@app/common/database/entities";
import { IUserRepository } from "../interfaces/user.repositori";
import { status } from "@app/common";


@Injectable()
export class UserPostgreRepository implements IUserRepository {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(UserSecurityEntity)
        private readonly securityrepository: Repository<UserSecurityEntity>,

        @InjectRepository(AdminEntity)
        private readonly adminRepository: Repository<AdminEntity>

    ) { }


    async getOneAdmin(adminId: string): Promise<AdminEntity | null> {

        return this.adminRepository.findOne({ where: { id: +adminId } })
    }


    async getAllAdmins(): Promise<AdminEntity[]> {

        return this.adminRepository.find()
    }


    async getAllBarbers(): Promise<UserEntity[]> {

        return this.userRepository.find({ where: { role: status.BARBER } })
    }


    async getAllClients(): Promise<UserEntity[]> {

        return this.userRepository.find({ where: { role: status.CLIENT } })
    }


    async getUserById(id: string): Promise<UserEntity | null> {

        return this.userRepository.findOne({ where: { id: +id } })
    }


    async deleteUser(userId: string): Promise<void> {

        await this.userRepository.delete(+userId)
    }


    async findSecurityByUserId(userId: string): Promise<UserSecurityEntity | null> {

        return this.securityrepository.findOne({ where: { user: { id: +userId } } })

    }


    async saveUser(user: UserEntity): Promise<UserEntity> {

        return this.userRepository.save(user)

    }


    async saveSecurity(security: UserSecurityEntity): Promise<UserSecurityEntity> {
        return this.securityrepository.save(security)
    }

}