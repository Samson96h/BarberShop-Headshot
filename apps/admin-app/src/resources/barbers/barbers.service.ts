import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BarberServices, User } from '@app/common';
import { status } from '@app/common';


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
  

  async getAllServices() {
    return this.barberModel.find().populate('user')
  }


  async getOneServices(userId: string) {
    return this.barberModel.findOne({ user: userId }).populate('user')
  }


  async removeService(userId: string) {
    const service = await this.barberModel.findOne({ user: userId })

    if (!service) {
      throw new NotFoundException('service not found')
    }

    return this.barberModel.findOneAndDelete({ _id: service._id })
  }





}
