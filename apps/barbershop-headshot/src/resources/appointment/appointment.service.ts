import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { status } from "@app/common";

import { CreateAppointmentDto, AppointmentStatusDTO, EndOfServiceDTO } from "./dto";
import { AppointmentEntity } from "@app/common/database/entities";
import type { IAppointmentRepository } from "./interfaces";


@Injectable()
export class AppointmentService {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private readonly appointmentRepository: IAppointmentRepository

  ) { }


  async createAppointment(clientId: string, dto: CreateAppointmentDto): Promise<AppointmentEntity> {

    const { barberId, service, date } = dto

    const client = await this.appointmentRepository.findUserById(clientId)
    const barber = await this.appointmentRepository.findUserById(barberId)

    if (!client || !barber) throw new NotFoundException('USER_NOT_FOUND')

    const appointment = await this.appointmentRepository.createAppointment(client, barber, service, date)

    if (!appointment) {
      throw new BadRequestException('APPOINTMENT_NOT_FOUND')
    }

    this.appointmentRepository.saveAppointment(appointment)

    return appointment
  }


  async removeAppointment(clientId: string, appointmentId: string): Promise<{ message: string }> {

    const appointment = await this.appointmentRepository.findAppointmentById(appointmentId)

    if (!appointment) {
      throw new NotFoundException('APPOINTMENT_NOT_FOUND')
    }

    const appointmentClientId = appointment.client.id.toString() || appointment.client._id.toString()

    if (appointmentClientId !== clientId) {
      throw new NotFoundException('THE_APPOINTMENT_DOES_NOT_BELONG_TO_YOU')
    }

    await this.appointmentRepository.removeAppointment(appointment)

    return {
      message: 'Appointment deleted successfully'
    }
  }


  async acceptedOrRejected(barberId: string, appointmentId: string, dto: AppointmentStatusDTO): Promise<any> {

    const appointment = await this.appointmentRepository.findAppointmentById(appointmentId)

    if (!appointment) {
      throw new NotFoundException('APPOINTMENT NOT FOUND')
    }

    const appointmentBarberId = appointment.barber.id.toString() || appointment.barber._id.toString()

    if (appointment.barber.id !== +appointmentBarberId) throw new ForbiddenException('THE_APPOINTMENT_DOES_NOT_BELONG_TO_YOU');

    appointment.status = dto.status

    return this.appointmentRepository.saveAppointment(appointment)
  }


  async getAppointmentsForUser(userId: string) {

    const user = await this.appointmentRepository.findUserById(userId)

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    if (user.role === status.BARBER) {
      return this.appointmentRepository.getAppointmentsForBarber(userId)
    }

    return this.appointmentRepository.getAppointmentsForClient(userId)
  }


  async endOfOrder(barberId: string, dto: EndOfServiceDTO): Promise<any> {
    const appointment = await this.appointmentRepository.findAppointmentById(dto.appointmentId)

    if (!appointment) throw new NotFoundException('APPOINTMENT_NOT_FOUND')

    const appointmentBarberId = appointment.barber.id.toString() || appointment.barber._id.toString()

    if (appointment.barber.id !== +appointmentBarberId) throw new ForbiddenException('THE_APPOINTMENT_DOES_NOT_BELONG_TO_YOU')

    appointment.end_of_order = dto.result

    return this.appointmentRepository.saveAppointment(appointment)
  }
}