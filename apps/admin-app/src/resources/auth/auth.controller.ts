import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';

import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { AdminLoginDTO, CreateAdminDTO } from './dto';
import { AuthUser } from '@app/common/decorators';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(AdminAuthGuard)
  @Post()
  async addAdmin(@AuthUser('id') id: string, @Body() dto: CreateAdminDTO) {
    return this.authService.createAdmin(id, dto)
  }

  @Get()
  async adminLogin(@Body() dto: AdminLoginDTO) {
    return this.authService.adminLogin(dto)
  }

}
