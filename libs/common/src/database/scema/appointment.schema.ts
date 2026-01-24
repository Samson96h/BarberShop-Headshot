import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AppointmentStatus } from '../enums/appointment-status.enum';

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'BarberService', required: true })
  barber: Types.ObjectId;

  @Prop({ type: String, required: true })
  service: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;
}

export const AppointmentSchema =
  SchemaFactory.createForClass(Appointment);