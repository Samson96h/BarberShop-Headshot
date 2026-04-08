import { registerAs } from "@nestjs/config";
import { IGoogleConfig } from "../models";

export const googleClientConfig = registerAs("GOOGLE_CLIENT_CONFIG", (): IGoogleConfig => {
    return {
        googleClientId: process.env.GOOGLE_CLIENT_ID as string,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL as string,
    }
})