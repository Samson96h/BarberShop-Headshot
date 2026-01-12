import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { BarberOrClientDTO } from './dto/barber-or-client.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { AuthService } from './auth.service';
import { AuthUser } from 'src/decorators';
import { AuthGuard } from 'src/guards';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-code')
  async sendCode(@Body() dto: BarberOrClientDTO) {
    return this.authService.sendCode(dto);
  }

  @UseGuards(AuthGuard)
  @Post('verify-code')
  async verifyCode(@Body() dto: VerifyCodeDto, @AuthUser('phone') phone: string) {
    return this.authService.verifyCode(phone, dto.code);
  }
}
