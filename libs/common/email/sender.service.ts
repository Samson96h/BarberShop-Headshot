import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';

import { IMailPayload } from './interfaces/mail.interface';
import { TemplateService } from './template.service';
import { ISmtpConfig } from '@app/common/models';


@Injectable()
export class SenderService implements OnModuleInit {

    private transporter!: Transporter;

    constructor(
        private readonly templateService: TemplateService,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit() {
        const smtp = this.configService.get<ISmtpConfig>('SMTP_CONFIG');

        if (!smtp) {
            throw new Error('SMTP_CONFIG is not loaded');
        }

        this.transporter = nodemailer.createTransport({
            host: smtp.smtpHost,
            port: smtp.smtpPort,
            secure: smtp.smtpSecure,
            auth: {
                user: smtp.smtpUser,
                pass: smtp.smtpPassword,
            },
        });

        try {
            await this.transporter.verify();
            console.log('SMTP transporter verified');
        } catch (error: any) {
            console.error('SMTP verification failed:', error.message);
        }
    }

    async sendEmail(payload: IMailPayload): Promise<boolean> {
        const { to, subject, template, context, attachments, from } = payload;

        const { html, error } = this.templateService.compile(template, context);

        if (error) {
            console.error(`[EMAIL] Template compile failed: ${error}`);
            return false;
        }

        try {
            await this.transporter.sendMail({
                from,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                html,
                attachments,
            });

            console.log(`Email sent to ${to}`);
            return true;
        } catch (error: any) {
            console.error(`[EMAIL] Error sending email: ${error.message}`);
            return false;
        }
    }
}