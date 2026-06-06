import { User } from "@app/common";
import { Multer } from 'multer';

import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
import { CreateBarberServiceDto } from "../dto/create-barber-service.dto";
import { UpdateBarberServiceDto } from "../dto/update-barber.dto";


export interface IBarberRepository {

    findUserById(id: string): Promise<UserEntity | null>;

    getServiceBarber(barberId: string): Promise<BarberServiceEntity | null>;

    loadUserImage(id: string, file: Express.Multer.File): Promise<void>;

    createService(user: UserEntity | User, dto: CreateBarberServiceDto): Promise<BarberServiceEntity>;

    updateService(service: BarberServiceEntity, dto: UpdateBarberServiceDto): Promise<BarberServiceEntity>;

    findServiceByUserId(userId: string): Promise<BarberServiceEntity | null>;

    removeService(service: BarberServiceEntity): Promise<void>;

    getUserWithMedia(userId: string): Promise<UserEntity | null>;

    getAllServices(): Promise<BarberServiceEntity[]>;

    getOneService(serviceId: string): Promise<BarberServiceEntity | null>;

    findAllBarbers(): Promise<UserEntity[]>;

}