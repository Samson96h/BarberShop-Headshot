import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class UserImage extends Document {

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    user: Types.ObjectId;

    @Prop({type: String})
    path: string

    @Prop()
    size: number
}

export const UserImageSchema = SchemaFactory.createForClass(UserImage);
