import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Admin {
    @Prop()
    name: string;

    @Prop({ required: true, unique: true })
    login: string;

    @Prop()
    password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin)