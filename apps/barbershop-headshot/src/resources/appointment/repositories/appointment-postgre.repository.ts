import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppointmentEntity, UserEntity } from "@app/common/database/entities";
import { SenderService } from "libs/common/email/sender.service";
import { IAppointmentRepository } from "../interfaces";
import { AppointmentStatusDTO } from "../dto";
import { Appointment } from "@app/common";


@Injectable()
export class AppointmentPostgreRepository implements IAppointmentRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
        private readonly senderService: SenderService
    ) { }


    async createAppointment(client: UserEntity, barber: UserEntity, service: string, date: Date): Promise<AppointmentEntity | null> {
        return this.appointmentRepository.create({
            client,
            barber,
            service,
            date
        })
    }


    saveAppointment(appointment: AppointmentEntity): Promise<AppointmentEntity | null> {
        return this.appointmentRepository.save(appointment)
    }




    async findUserById(userId: string): Promise<UserEntity | null> {
        return this.userRepository.findOne({ where: { id: +userId } })
    }

    async findAppointmentById(appointmentId: string): Promise<AppointmentEntity | Appointment | null> {
        return this.appointmentRepository.findOne({ where: { id: +appointmentId }, relations: ['barber', 'client'] })
    }





    async removeAppointment(appointment: AppointmentEntity) {

        return this.appointmentRepository.remove(appointment);
    }


    async acceptedOrRejected(barberId: string, appointmentId: string, dto: AppointmentStatusDTO): Promise<any> {
        const appointment = await this.appointmentRepository.findOne({ where: { id: +appointmentId }, relations: ['barber'] })
        if (!appointment) {
            throw new NotFoundException('APPOINTMENT NOT FOUND')
        }

        if (appointment.barber.id !== +barberId) throw new ForbiddenException('It is not your Appointment');

        appointment.status = dto.status

        return this.appointmentRepository.save(appointment)
    }

    async getAppointmentsForBarber(barberId: string):Promise<AppointmentEntity[] | []> {
        return this.appointmentRepository.find({ where: { barber: { id: +barberId } } })
    }


    async getAppointmentsForClient(clientId: string):Promise<AppointmentEntity[] | []> {
        return this.appointmentRepository.find({ where: { client: { id: +clientId } } })
    }

}
