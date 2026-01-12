import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { status } from '../enums';

export type AuthSessionDocument = HydratedDocument<AuthSession>;

@Schema({ timestamps: true })
export class AuthSession {
    @Prop({ required: true })
    phone: string;

    @Prop({ enum: status, required: true })
    status: status;

    @Prop({ required: true })
    code: string;

    @Prop({ required: true, default: new Date(Date.now() + 5 * 60 * 1000) })
    expiresAt: Date;

    @Prop({ default: false })
    verified: boolean;
}

export const AuthSessionSchema =
    SchemaFactory.createForClass(AuthSession);

AuthSessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 },
);
