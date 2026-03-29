import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Appointment, User } from "@app/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { AppointmentStatusDTO } from "./dto/appointment-status.dto";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { status } from '../../../../../libs/common/src/database'


@Injectable()
export class AppointmentService {

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async createAppointment(
    clientId: string,
    dto: CreateAppointmentDto
  ): Promise<Appointment> {

    return this.appointmentModel.create({
      client: clientId,
      barber: dto.barberId,
      service: dto.service,
      date: dto.date
    });
  }

  async removeAppointment(
    clientId: string,
    appointmentId: string
  ) {

    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .populate("client");

    if (!appointment) {
      throw new NotFoundException("appointment not found");
    }

    if (appointment.client._id.toString() !== clientId) {
      throw new ForbiddenException("You cannot delete this appointment");
    }

    return this.appointmentModel.findByIdAndDelete(appointmentId);
  }

  async acceptedOrRejected(
    barberId: string,
    appointmentId: string,
    dto: AppointmentStatusDTO
  ) {

    const appointment = await this.appointmentModel
      .findById(appointmentId)
      .populate("barber");

    if (!appointment) {
      throw new NotFoundException("appointment not found");
    }

    if (appointment.barber.toString() !== barberId) {
      throw new ForbiddenException("You cannot update this appointment");
    }

    appointment.status = dto.status;

    return appointment.save();
  }

  async getAppointmentsForBarber(barberId: string): Promise<Appointment[]> {

    return this.appointmentModel
      .find({ barber: barberId })
      .populate("client")
  }

  async getAppointmentsForClient(clientId: string): Promise<Appointment[]> {

    return this.appointmentModel
      .find({ client: clientId })
  }

  async getAppointmentsForUser(userId: string) {

    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException("user not found");
    }

    if (user.role === status.BARBER) {
      return this.getAppointmentsForBarber(userId);
    }

    return this.getAppointmentsForClient(userId);
  }
}