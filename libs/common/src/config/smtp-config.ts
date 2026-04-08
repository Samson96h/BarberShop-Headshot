import { registerAs } from "@nestjs/config";
import { ISmtpConfig } from "../models";

export const smtpConfig = registerAs("SMTP_CONFIG", (): ISmtpConfig => {
  return {
    smtpHost: process.env.SMTP_HOST as string,
    smtpPort: Number(process.env.SMTP_PORT),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER as string,
    smtpPassword: process.env.SMTP_PASS as string,
  };
});