import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
import { CreateBarberServiceDto } from "../dto/create-barber-service.dto";
import { MediaPostgreService } from "../services/media-postgre.service";
import { IBarberRepository } from "../interfaces/barber.repository";
import { UpdateBarberServiceDto } from "../dto/update-barber.dto";
import { status, User } from "@app/common";


@Injectable()
export class BarberPostgreRepository implements IBarberRepository {
    constructor(
        @InjectRepository(BarberServiceEntity)
        private readonly barberRepository: Repository<BarberServiceEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        private readonly mediaService: MediaPostgreService,
    ) { }


    async findUserById(id: string): Promise<UserEntity | null> {

        return this.userRepository.findOne({ where: { id: +id } })

    }

    async getServiceBarber(barberId: string): Promise<BarberServiceEntity | null> {

        return this.barberRepository.findOne({ where: { user: { id: +barberId } } })

    }


    async loadUserImage(id: string, file: Express.Multer.File) {

        this.mediaService.uploadUserImage(+id, file)

    }

    async createService(user: UserEntity | User, dto: CreateBarberServiceDto) {
        const service = await this.barberRepository.create({
            user,
            ...dto
        })

        return this.barberRepository.save(service)
    }



    async findServiceByUserId(userId: string): Promise<BarberServiceEntity | null> {

        return this.barberRepository.findOne({ where: { user: { id: +userId } }, relations: ['user'] })
    }


    async updateService(service: BarberServiceEntity, dto: UpdateBarberServiceDto): Promise<BarberServiceEntity> {

        Object.assign(service, dto)

        return this.barberRepository.save(service)
    }


    async removeService(service: BarberServiceEntity): Promise<void> {

        await this.barberRepository.remove(service)
    }


    async getUserWithMedia(userId: string): Promise<UserEntity | null> {

        return this.userRepository.findOne({ where: { id: +userId }, relations: ['mediaFiles'] })
    }


    async getAllServices(): Promise<BarberServiceEntity[]> {

        return this.barberRepository.find({ relations: ['user'] })
    }


    async getOneService(serviceId: string): Promise<BarberServiceEntity | null> {

        return this.barberRepository.findOne({ where: { id: +serviceId }, relations: ['user'] })
    }


    async findAllBarbers(): Promise<UserEntity[]> {

        return this.userRepository.find({ where: { role: status.BARBER } })
    }

}