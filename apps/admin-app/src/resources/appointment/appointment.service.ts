import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { status } from "@app/common";

import type { IAppointmentRepository } from "./interfaces/appointment.repository";


@Injectable()
export class AppointmentService {

  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private readonly appointmentRepo: IAppointmentRepository
  ) { }


  async removeAppointment(clientId: string, appointmentId: string): Promise<{ message: string }> {

    const appointment = await this.appointmentRepo.findAppointmentById(appointmentId)

    if (!appointment) {
      throw new NotFoundException('APPOINTMENT_NOT_FOUND')
    }

    const appointmentClientId = appointment.client.id.toString() || appointment.client._id.toString()

    if (appointmentClientId !== clientId) {
      throw new NotFoundException('APPOINTMENT_NOT_FOUND')
    }

    await this.appointmentRepo.removeAppointment(
      appointmentId
    );

    return {
      message: 'Appointment deleted successfully'
    }
  }


  async getAppointmentsForUser(userId: string) {

    const user = await this.appointmentRepo.findUserById(userId)

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    if (user.role === status.BARBER) {
      return this.appointmentRepo.getAppointmentsForBarber(userId)
    }

    return this.appointmentRepo.getAppointmentsForClient(userId)
  }
}