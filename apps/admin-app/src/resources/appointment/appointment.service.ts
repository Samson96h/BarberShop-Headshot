import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Appointment, User } from "@app/common";
import { status } from "@app/common";


@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }


  async removeAppointment(clientId: string, appointmentId: string) {
    const appointment = await this.appointmentModel
      .findOne({ _id: appointmentId })
      .populate("client");

    if (!appointment) {
      throw new NotFoundException("appointment not found");
    }

    if (appointment.client._id.toString() === clientId) {
      return this.appointmentModel.findOneAndDelete({ _id: appointment._id });
    }

    throw new ForbiddenException("You cannot delete this appointment");
  }


  async getAppointmentsForBarber(barberId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ barber: barberId }).populate("client");
  }

  async getAppointmentsForClient(clientId: string): Promise<Appointment[]> {
    return this.appointmentModel.find({ client: clientId }).populate("client");
  }

  async getAppointmentsForUser(userId: string) {
    const user = await this.userModel.findOne({ _id: userId })
    if (!user) throw new NotFoundException('user not found')

    if (user.role === status.BARBER) {
      return this.getAppointmentsForBarber(userId)
    }

    return this.getAppointmentsForClient(userId)
  }

}
