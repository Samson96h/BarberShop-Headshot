import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AdminEntity } from '@app/common/database/entities';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async onModuleInit() {
    const existingAdmin = await this.adminRepository.findOne({
      where: { login: 'admin001' },
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('111111', 12);

    await this.adminRepository.save({
      name: 'Super Admin',
      login: 'admin001',
      password: hashedPassword,
    });

    console.log('Admin created: admin001 / 111111');
  }
}