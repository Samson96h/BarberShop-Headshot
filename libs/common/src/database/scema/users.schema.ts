import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";

import { status } from "../enums";


@Schema({ timestamps: true })
export class User {

  @Prop({ type: String, default: null, unique: true })
  email: string | null;

  @Prop({ type: String, unique: true, default: null })
  phone: string | null;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string

  @Prop({
    type: String,
    enum: status,
    required: true,
    default: status.CLIENT,
  })
  role: status;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  temporaryBlockCount: number;

  @Prop({ default: 0 })
  permanentBlockCount: number;

  @Prop({ type: Date, default: null })
  blockedUntil: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User)
