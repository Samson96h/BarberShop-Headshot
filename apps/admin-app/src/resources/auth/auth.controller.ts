import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDTO, CreateAdminDTO } from './dto';
import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { AuthUser } from '@app/common/decorators';


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
