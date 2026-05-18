import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import type { IAuthRepository } from './interfaces/auth.repository';
import { AdminEntity } from '@app/common/database/entities';
import { AdminLoginDTO, CreateAdminDTO } from './dto';
import { IJWTConfig } from '@app/common/models';


@Injectable()
export class AuthService implements IAuthRepository {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }

  async adminLogin(dto: AdminLoginDTO): Promise<{ message: string; token: string; }> {
    const admin = await this.adminRepository.findOne({ where: { login: dto.login } })

    if (!admin) throw new NotFoundException('admin not found')

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('invalid credentials');
    }

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
    const admin = await this.adminRepository.findOne({ where: { id: +id } })

    if (!admin) {
      throw new NotFoundException('admin not found')
    }

    if (admin.name != 'Super admin') {
      throw new ForbiddenException("You do not have permission to create a new admin.")
    }

    const newAdmin = await this.adminRepository.create({
      name: dto.name,
      login: dto.login,
      password: await bcrypt.hash(dto.password, 12)
    })

    return this.adminRepository.save(newAdmin)
  }

}
