import { InjectRepository } from "@nestjs/typeorm";
import { IJWTConfig } from "@app/common/models";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { IAuthRepository } from "../interfaces/auth.repository";
import { AdminEntity } from "@app/common/database/entities";


@Injectable()
export class AuthPostgreRepository implements IAuthRepository {

    constructor(
        @InjectRepository(AdminEntity)
        private readonly adminRepository: Repository<AdminEntity>

    ) { }

    async findAdminByLogin(login: string): Promise<AdminEntity | null> {

        return this.adminRepository.findOne({ where: { login } })
    }


    async findAdminById(id: string): Promise<AdminEntity | null> {

        return this.adminRepository.findOne({ where: { id: +id } })
    }


    createAdmin(data: Partial<AdminEntity>): AdminEntity {

        return this.adminRepository.create(data)
    }
    

    async saveAdmin(admin: AdminEntity): Promise<AdminEntity> {

        return this.adminRepository.save(admin)

    }
}