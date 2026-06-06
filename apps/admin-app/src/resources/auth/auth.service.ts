import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { IAuthRepository } from './interfaces/auth.repository';
import { AdminEntity } from '@app/common/database/entities';
import { AdminLoginDTO, CreateAdminDTO } from './dto';
import { IJWTConfig } from '@app/common/models';


@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: IAuthRepository,

    private readonly configService: ConfigService,

    private readonly jwtService: JwtService

  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }

  async adminLogin(dto: AdminLoginDTO): Promise<{ message: string; token: string; }> {
    const admin = await this.authRepository.findAdminByLogin(dto.login)

    if (!admin) throw new NotFoundException('admin not found')

    const isPasswordValid = await bcrypt.compare(dto.password, admin.password);

    if (!isPasswordValid) throw new NotFoundException('invalid credentials')

    const token = this.jwtService.sign(
      {
        sub: admin.id.toString(),
        login: dto.login,
        temp: true,
      },
      {
        secret: this.jwtConfig.adminSecret,
        expiresIn: '1d',
      },
    );

    return {
      message: `hello ${admin.name}`,
      token
    };
  }


  async createAdmin(id: string, dto: CreateAdminDTO): Promise<AdminEntity> {

    const admin = await this.authRepository.findAdminById(id)

    if (!admin) throw new NotFoundException('admin not found')

    if (admin.name != 'Super admin') {
      throw new ForbiddenException("You do not have permission to create a new admin.")
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12)

    const newAdmin =
      this.authRepository.createAdmin({
        name: dto.name,
        login: dto.login,
        password: hashedPassword
      })

    return this.authRepository.saveAdmin(newAdmin)
  }

}
