import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { Admin } from '@app/common/database';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
  ) { }

  async onModuleInit() {
    const existingAdmin = await this.adminModel.findOne({
      login: 'admin001',
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('111111', 12);

    await this.adminModel.create({
      name: 'Super Admin',
      login: 'admin001',
      password: hashedPassword,
    });

    console.log('Admin created: admin001 / 111111');
  }
}