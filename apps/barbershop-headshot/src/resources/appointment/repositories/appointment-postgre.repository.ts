import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AppointmentStatusDTO, CreateAppointmentDto, EndOfServiceDTO } from "../dto";
import { AppointmentEntity, UserEntity } from "@app/common/database/entities";
import { SenderService } from "libs/common/email/sender.service";
import { IAppointmentRepository } from "../interfaces";
import { status } from "@app/common";


@Injectable()
export class AppointmentPostgreRepository implements IAppointmentRepository {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(AppointmentEntity)
        private readonly appointmentRepository: Repository<AppointmentEntity>,
        private readonly senderService: SenderService
    ) { }

    async findById(clientId: string) {
        const client = await this.userRepository.findOne({ where: { id: +clientId } })
        if (!client) throw new NotFoundException('client not found')
    }


    async createAppointment(clientId: string, dto: CreateAppointmentDto) {

        const { barberId, service, date } = dto

        const client = await this.userRepository.findOne({ where: { id: +clientId } })
        const barber = await this.userRepository.findOne({ where: { id: +barberId } })

        if (!client || !barber) throw new NotFoundException('user or barbes not found')

        const appointment = this.appointmentRepository.create({
            client,
            barber,
            service,
            date
        })

        return this.appointmentRepository.save(appointment)
    }


    async removeAppointment(clientId: string, appointmentId: string) {

        const appointment = await this.appointmentRepository.findOne({ where: { id: +appointmentId }, relations: ['client'] });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        if (appointment.client.id !== +clientId) {
            throw new ForbiddenException('It is not your Appointment');
        }

        await this.appointmentRepository.remove(appointment);
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


    async getAppointmentsForBarber(barberId: string) {
        return this.appointmentRepository.find({ where: { barber: { id: +barberId } } })
    }


    async getAppointmentsForClient(clientId: string): Promise<any> {
        return this.appointmentRepository.find({ where: { client: { id: +clientId } } })
    }


    async getAppointmentsForUser(userId: string): Promise<any> {
        const user = await this.userRepository.findOne({ where: { id: +userId } })

        if (user?.role === status.BARBER) {
            return this.getAppointmentsForBarber(userId)
        }

        return this.getAppointmentsForClient(userId)
    }
    

    async endOfOrder(barberId: string, dto: EndOfServiceDTO): Promise<any> {
        const appointment = await this.appointmentRepository.findOne({ where: { id: +dto.appointmentId } })

        if (!appointment) throw new NotFoundException('appointment not found')

        if (appointment.barber.id !== +barberId) throw new ForbiddenException('It is not your appointment')

        appointment.end_of_order = dto.result

        return this.appointmentRepository.save(appointment)
    }
}