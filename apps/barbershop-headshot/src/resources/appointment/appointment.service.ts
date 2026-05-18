import { Inject, Injectable } from "@nestjs/common";
import { Appointment, User } from "@app/common";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { AppointmentStatusDTO } from "./dto/appointment-status.dto";
import { EndOfServiceDTO } from "./dto/end_of_service.dto";
import type { IAppointmentRepository } from "./interfaces/appointment.repository";


@Injectable()
export class AppointmentService {
  constructor(
    @Inject('APPOINTMENT_REPOSITORY')
    private readonly appointmentRepo: IAppointmentRepository,
  ) { }


  async createAppointment(clientId: string, dto: CreateAppointmentDto) {
    return this.appointmentRepo.createAppointment(clientId, dto);
  }


  async removeAppointment(clientId: string, appointmentId: string) {
    return this.appointmentRepo.removeAppointment(clientId, appointmentId)
  }

  async acceptedOrRejected(barberId: string, appointmentId: string, dto: AppointmentStatusDTO) {
    return this.appointmentRepo.acceptedOrRejected(barberId, appointmentId, dto)
  }


  async getAppointmentsForBarber(barberId: string): Promise<Appointment[]> {

    return this.appointmentRepo.getAppointmentsForBarber(barberId)
  }


  async getAppointmentsForClient(clientId: string): Promise<Appointment[]> {

    return this.appointmentRepo.getAppointmentsForClient(clientId)
  }


  async getAppointmentsForUser(userId: string) {
    return this.appointmentRepo.getAppointmentsForUser(userId)
  }

  async endOfOrder(barberId: string, dto: EndOfServiceDTO) {
    return this.appointmentRepo.endOfOrder(barberId, dto)
  }

}