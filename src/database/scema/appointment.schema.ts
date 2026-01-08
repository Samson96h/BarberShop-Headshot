import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

import { AppointmentStatus } from "../enums/appointment-status.enum";


@Schema({ timestamps: true })
export class Appointment {
    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    client: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: "BarberProfile", required: true })
    barber: Types.ObjectId;

    @Prop({ required: true })
    service: string;

    @Prop({ required: true })
    date: Date;

    @Prop({ enum: AppointmentStatus, default: AppointmentStatus.PENDING })
    status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
