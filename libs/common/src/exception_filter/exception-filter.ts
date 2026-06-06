import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { TranslationService } from '../i18n/TranslationService';


@Catch(HttpException)
export class TranslationExceptionFilter implements ExceptionFilter {
    constructor(
        private readonly translationService: TranslationService,
    ) { }

    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp()

        const response = ctx.getResponse()
        const request = ctx.getRequest()

        const lang = typeof request.headers['lang'] === 'string' ? request.headers['lang'] : 'en'

        const status = exception.getStatus()
        const exceptionResponse = exception.getResponse()

        let message = 'Unknown error'

        if (typeof exceptionResponse === 'object' && exceptionResponse !== null && 'key' in exceptionResponse &&
            typeof exceptionResponse.key === 'string') {
            message = this.translationService.translate(lang, exceptionResponse.key)
        }

        response.status(status).json({
            success: false,
            message
        })
    }
}