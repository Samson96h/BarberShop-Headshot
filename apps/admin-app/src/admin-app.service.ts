import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminAppService {
  getHello(): string {
    return 'Hello World!';
  }
}
