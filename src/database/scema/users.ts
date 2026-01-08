import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { status } from "../enums";

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  name: string;

  @Prop({ enum: status, required: true })
  role: status;
}

export const UserSchema = SchemaFactory.createForClass(User);
