import { Controller, Get } from '@nestjs/common';
import { AdminAppService } from './admin-app.service';

@Controller()
export class AdminAppController {
  constructor(private readonly adminAppService: AdminAppService) {}

  @Get()
  getHello(): string {
    return this.adminAppService.getHello();
  }
}
