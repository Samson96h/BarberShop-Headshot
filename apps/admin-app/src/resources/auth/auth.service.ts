import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AdminLoginDTO, CreateAdminDTO } from './dto';
import { IJWTConfig } from '@app/common/models';
import { Admin } from '@app/common/database';


@Injectable()
export class AuthService {
  private jwtConfig: IJWTConfig;

  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }

  async adminLogin(dto: AdminLoginDTO):Promise<{message,token}> {
    const admin = await this.adminModel.findOne({ login: dto.login })

    if (!admin) {
      throw new NotFoundException('admin not found');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('invalid credentials');
    }

    const token = this.jwtService.sign(
      {
        sub: admin._id.toString(),
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


  async createAdmin(id: string, dto: CreateAdminDTO):Promise<Admin> {
    const admin = await this.adminModel.findOne({_id: id})

    if(!admin) {
      throw new NotFoundException('admin not found')
    }

    if(admin?._id.toString() != '696a46f211fdf25edaa8db0c'){
      throw new ForbiddenException("You do not have permission to create a new admin.")
    }

    return this.adminModel.create({
      name:dto.name,
      login:dto.login,
      password: await bcrypt.hash(dto.password, 12)
    })
  }
}
