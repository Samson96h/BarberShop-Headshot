import { registerAs } from "@nestjs/config";
import { IAwsConfig } from "../models";

export const awsConfig = registerAs("AWS_CONFIG", (): IAwsConfig => {
    return {
        accessKeyId: process.env.ACCSESSKEYID as string,
        secretAccessKey: process.env.SECRETACCESSKEY as string,
        region: process.env.REGION as string,
        bucket: process.env.BUCKET as string
    }
})