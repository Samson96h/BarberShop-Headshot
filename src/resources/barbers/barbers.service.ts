import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BarberServices } from 'src/database/scema/barber-services.schema';
import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { UpdateBarberServiceDto } from './dto/update-barber.dto';
import { status, User } from 'src/database';


@Injectable()
export class BarbersService {
  constructor(
    @InjectModel(BarberServices.name)
    private readonly barberModel: Model<BarberServices>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) { }

  async findAllBarbers() {
    const services = await this.userModel.find()
    return services.filter(e => e.role === status.BARBER);
  }

  async findOneBarber(userId: string) {
    const barber = await this.userModel.findOne({
      _id: userId,
      role: status.BARBER,
    });

    if (!barber) {
      throw new NotFoundException('Barber not found');
    }

    return barber;
  }


  async createService(userId: string, dto: CreateBarberServiceDto) {
    return this.barberModel.create({ user: userId, ...dto })
  }


  async updateService(userId: string, dto: UpdateBarberServiceDto) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndUpdate({ _id: service._id }, dto, { new: true })
  }

  async removeService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndDelete({ _id: service._id })
  }


  async getOneServices(userId: string) {
    return this.barberModel.findOne({ user: userId }).populate('user')
  }
  

}
