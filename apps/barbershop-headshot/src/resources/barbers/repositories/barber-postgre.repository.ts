import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
import { CreateBarberServiceDto } from "../dto/create-barber-service.dto";
import { MediaPostgreService } from "../services/media-postgre.service";
import { IBarberRepository } from "../interfaces/barber.repository";
import { UpdateBarberServiceDto } from "../dto/update-barber.dto";
import { status } from "@app/common";


@Injectable()
export class BarberPostgreRepository implements IBarberRepository {
    constructor(
        @InjectRepository(BarberServiceEntity)
        private readonly barberRepo: Repository<BarberServiceEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,

        private readonly mediaService: MediaPostgreService,
    ) { }


    async createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
        const user = await this.userRepo.findOneBy({ id: +userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const existing = await this.barberRepo.findOne({ where: { user: { id: user.id } } });

        if (existing) {
            throw new BadRequestException('You already have service');
        }

        if (file) {
            await this.mediaService.uploadUserImage(user.id, file);
        }

        const service = this.barberRepo.create({
            user,
            ...dto,
        });

        await this.barberRepo.save(service);

        const userWithMedia = await this.userRepo.findOne({ where: { id: user.id }, relations: ['mediaFiles'] });

        return {
            service,
            portfolioPath: userWithMedia?.mediaFiles?.path || null
        };
    }


    async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
        const service = await this.barberRepo.findOne({ where: { user: { id: +userId } }, relations: ['user'] });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        if (file) {
            await this.mediaService.uploadUserImage(+userId, file);
        }

        Object.assign(service, dto);

        await this.barberRepo.save(service);

        const userWithMedia = await this.userRepo.findOne({ where: { id: +userId }, relations: ['mediaFiles'] });

        return {
            service,
            portfolioPath: userWithMedia?.mediaFiles?.path || null
        };
    }


    async findAllBarbers() {
        return this.userRepo.find({ where: { role: status.BARBER } });
    }


    async findOneBarber(userId: string) {
        const barber = await this.userRepo.findOne({ where: { id: +userId, role: status.BARBER } });

        if (!barber) {
            throw new NotFoundException('Barber not found');
        }

        return barber;
    }


    async removeService(userId: string) {
        const service = await this.barberRepo.findOne({ where: { user: { id: +userId } } });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        await this.barberRepo.remove(service);

        return { message: 'Service deleted' };
    }


    async getMyService(userId: string) {
        const service = await this.barberRepo.findOne({ where: { user: { id: +userId } }, relations: ['user'], });

        if (!service) return null;

        const userWithMedia = await this.userRepo.findOne({ where: { id: +userId }, relations: ['mediaFiles'] });

        return {
            ...service,
            portfolioImage: userWithMedia?.mediaFiles?.path || null
        };
    }


    async getAllServices() {
        return this.barberRepo.find({ relations: ['user'] });
    }


    async getOneService(serviceId: string) {
        const service = await this.barberRepo.findOne({ where: { id: +serviceId }, relations: ['user'] });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        const userWithMedia = await this.userRepo.findOne({ where: { id: service.user.id }, relations: ['mediaFiles'] });

        return {
            ...service,
            portfolioImage: userWithMedia?.mediaFiles?.path || null
        };
    }


}