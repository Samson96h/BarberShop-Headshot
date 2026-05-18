import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BarberOrClientDTO } from './dto/barber-or-client.dto';
import { ChangeStatusDTO } from './dto/change-status.dto';
import type { IAuthRepository } from './interfaces';
import { IJWTConfig } from '@app/common/models';
import { VerifyCodeDto } from './dto';


@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: IAuthRepository,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }


  async sendCode(dto: BarberOrClientDTO) {
    return this.authRepository.sendCode(dto)
  }


  async verifyCode(phone: string, dto: VerifyCodeDto) {
    return this.authRepository.verifyCode(phone, dto)
  }


  async changeStatusUser(userId: string, dto: ChangeStatusDTO) {
    return this.authRepository.changeStatusUser(userId, dto)
  }
}

