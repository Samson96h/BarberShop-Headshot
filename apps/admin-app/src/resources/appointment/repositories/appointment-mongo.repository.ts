// import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";

// import { Appointment, User } from "@app/common";
// import { IAppointmentRepository } from "../interfaces/appointment.repository";

// @Injectable()
// export class AppointmentMongoRepository implements IAppointmentRepository {

//     constructor(
//         @InjectModel(Appointment.name)
//         private readonly appointmentModel: Model<Appointment>,

//         @InjectModel(User.name)
//         private readonly userModel: Model<User>
//     ) { }

//     async removeAppointment(id: string): Promise<void> {
//         await this.appointmentModel.findByIdAndDelete(id)
//     }

//     async findUserById(userId: string) {
//         return this.userModel.findById(userId)
//     }

//     async findAppointmentById(id: string) {
//         return this.appointmentModel.findById(id).populate("client")
//     }

//     async getAppointmentsForBarber(barberId: string): Promise<Appointment[]> {

//         return this.appointmentModel.find({ barber: barberId }).populate("client")
//     }

//     async getAppointmentsForClient(clientId: string): Promise<Appointment[]> {

//         return this.appointmentModel.find({ client: clientId }).populate("barber")
//     }
// }