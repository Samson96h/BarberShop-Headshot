import { Appointment } from "@app/common";
import { AppointmentStatusDTO } from "../dto/appointment-status.dto";
import { CreateAppointmentDto } from "../dto/create-appointment.dto";
import { EndOfServiceDTO } from "../dto/end_of_service.dto";

export interface IAppointmentRepository {
  createAppointment(clientId: string, dto: CreateAppointmentDto): Promise<any>;
  removeAppointment(clientId: string, appointmentId: string): Promise<any>;
  acceptedOrRejected(barberId: string, appointmentId: string, dto: AppointmentStatusDTO): Promise<any>;
  getAppointmentsForBarber(barberId: string): Promise<any>;
  getAppointmentsForClient(clientId: string): Promise<any>;
  getAppointmentsForUser(userId: string): Promise<any>;
  endOfOrder(barberId: string, dto: EndOfServiceDTO): Promise<any>;
}