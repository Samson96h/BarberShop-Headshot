export interface IMailPayload {
    to: string | string[];
    from: string;
    subject: string;
    template: string;
    context?: { [key: string]: any };
    attachments?: any[];
}