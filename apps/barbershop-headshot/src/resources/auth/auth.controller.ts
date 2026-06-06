import { Controller, Post, Body, UseGuards, Patch } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '@app/common/decorators';
import { AuthGuard } from '@app/common/guards';

import { BarberOrClientDTO, VerifyCodeDto, ChangeStatusDTO } from './dto';
import { AuthService } from './auth.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('send-code')
  async sendCode(@Body() dto: BarberOrClientDTO) {
    return this.authService.sendCode(dto)
  }

  @ApiHeader({ name: 'X-Auth-token', })
  @UseGuards(AuthGuard)
  @Post('verify-code')
  async verifyCode(@AuthUser('phone') phone: string, @Body() dto: VerifyCodeDto,) {
    return this.authService.verifyCode(phone, dto)
  }

  @UseGuards(AuthGuard)
  @Patch('change-status')
  changeStatusUser(@AuthUser('id') id: string, @Body() dto: ChangeStatusDTO) {
    return this.authService.changeStatusUser(id, dto)
  }
}
