import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { AppointmentStatus } from '../enums/appointment-status.enum';
import { endOrder } from '../enums/end_order.enum';
import { BarberServices } from './barber-services.schema';


@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: BarberServices.name, required: true })
  barber!: Types.ObjectId;

  @Prop({ type: String, required: true })
  service!: string;

  @Prop({ type: Date, required: true })
  date!: Date;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status!: AppointmentStatus;

  @Prop({
    type: String,
    enum: endOrder,
    default: null
  })
  end_of_order!: endOrder | null;
}

export const AppointmentSchema =
  SchemaFactory.createForClass(Appointment);