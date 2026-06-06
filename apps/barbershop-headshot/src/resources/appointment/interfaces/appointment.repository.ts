import { AppointmentEntity, UserEntity } from "@app/common/database/entities";
import { Appointment } from "@app/common";


export interface IAppointmentRepository {

  createAppointment(client: UserEntity, barber: UserEntity, service: string, date: Date): Promise<AppointmentEntity | null>;

  saveAppointment(appointment: AppointmentEntity): Promise<AppointmentEntity | null>;

  removeAppointment(appointment: AppointmentEntity | Appointment): Promise<any>;

  getAppointmentsForBarber(barberId: string): Promise<AppointmentEntity[] | [] | Appointment[]>;

  getAppointmentsForClient(clientId: string): Promise<AppointmentEntity[] | [] | Appointment[]>;

  findAppointmentById(appointmentId: string): Promise<any>;

  findUserById(userId: string): Promise<UserEntity | null>;

}