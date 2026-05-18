import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";

import { IAppointmentRepository } from "../interfaces/appointment.repository";
import { AppointmentEntity, UserEntity } from "@app/common/database/entities";


@Injectable()
export class AppointmentPostgreRepositor implements IAppointmentRepository {

    constructor(
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }


    async findAppointmentById(id: string) {
        return this.appointmentRepository.findOne({ where: { id: +id }, relations: ['client'] })
    }


    async removeAppointment(id: string): Promise<void> {
        await this.appointmentRepository.delete(+id)
    }


    async findUserById(id: string) {
        return this.userRepository.findOne({ where: { id: +id } })
    }


    async getAppointmentsForBarber(barberId: string) {
        return this.appointmentRepository.find({ where: { barber: { id: +barberId } } })
    }


    async getAppointmentsForClient(clientId: string) {
        return this.appointmentRepository.find({ where: { client: { id: +clientId } } })
    }
}