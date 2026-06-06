import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { status } from "@app/common";

import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
import { IBarberRepository } from "../interfaces/barber.repository";


@Injectable()
export class BarberPostgreRepository implements IBarberRepository {

    constructor(
        @InjectRepository(BarberServiceEntity)
        private readonly barberRepository: Repository<BarberServiceEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async findBarberById(id: string): Promise<UserEntity | null> {

        return this.userRepository.findOne({ where: { id: +id, role: status.BARBER } })
    }


    async findAllBarbers(): Promise<UserEntity[]> {

        return this.userRepository.find({ where: { role: status.BARBER } })
    }


    async findServiceById(userId: string): Promise<BarberServiceEntity | null> {

        return this.barberRepository.findOne({ where: { user: { id: +userId } }, relations: ['user'] })
    }



    async getAllServices(): Promise<BarberServiceEntity[]> {

        return this.barberRepository.find({ relations: ['user'] })
    }


    async removeService(serviceId: string): Promise<void> {

        await this.barberRepository.delete(+serviceId)
    }

}