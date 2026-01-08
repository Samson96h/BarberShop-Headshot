import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class BarberServices extends Document {

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    description: string;

    @Prop({ type: [String], default: [] })
    services: string[];

    @Prop({ type: [String], default: [] })
    workingHours: string[];

    @Prop()
    experience: number;
}

export const BarberServiceSchema = SchemaFactory.createForClass(BarberServices);
