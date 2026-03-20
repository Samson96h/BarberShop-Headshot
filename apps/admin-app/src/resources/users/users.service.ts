import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, BarberServices, status, User } from '@app/common/database';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(BarberServices.name)
    private readonly barberServicesModel: Model<BarberServices>,

    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>

  ) { }

  async getAllUsers(role?: string) {

    if (!role) return await this.userModel.find()

    return await this.userModel.find({ role })
  }

  async getAllBarbers() {

    return await this.userModel.find({ role: status.BARBER })

  }


  async getAllClients() {

    return await this.userModel.find({ role: status.CLIENT })

  }


  async getOneUser(id: string): Promise<User> {

    const user = await this.userModel.findOne({ _id: id })

    if (!user) {
      throw new NotFoundException('user not found')
    }

    return user
  }


  async deleteUser(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    user.isActive = false;
    user.tokenVersion += 1;

    await user.save();

    return { message: 'user deleted and tokens revoked' };
  }

}
