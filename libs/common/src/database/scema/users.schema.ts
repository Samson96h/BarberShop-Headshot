import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { status } from "../enums";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  name: string;

  @Prop({
    type: String,
    enum: status,
    required: true,
    default: status.CLIENT,
  })
  role: status;

  @Prop({ default: 0 })
  tokenVersion: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
