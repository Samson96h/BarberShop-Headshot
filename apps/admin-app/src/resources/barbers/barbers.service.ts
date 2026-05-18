import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BarberServiceEntity, UserEntity } from '@app/common/database/entities';
import type { IBarberRepository } from './interfaces/barber.repository';
import { status } from '@app/common';


@Injectable()
export class BarbersService implements IBarberRepository {

  constructor(
    @InjectRepository(BarberServiceEntity)
    private readonly barberRepository: Repository<BarberServiceEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async findAllBarbers(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { role: status.BARBER } });
  }


  async findOneBarber(userId: string): Promise<UserEntity> {

    const barber = await this.userRepository.findOne({
      where: { id: +userId, role: status.BARBER }
    })

    if (!barber) {
      throw new NotFoundException('barber not found');
    }

    return barber;
  }


  async getAllServices(): Promise<BarberServiceEntity[]> {

    return this.barberRepository.find({
      relations: ['user']
    });
  }


  async getOneServices(userId: string): Promise<BarberServiceEntity> {

    const service = await this.barberRepository.findOne({
      where: {
        id: +userId
      },
      relations: ['user']
    });


    if (!service) {
      throw new NotFoundException('service not found');
    }

    return service;
  }


  async removeService(userId: string): Promise<{ message: string }> {

    const user = await this.userRepository.findOne({
      where: { id: +userId }
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const service = await this.barberRepository.findOne({
      where: {
        user: {
          id: user.id
        }
      }
    });

    if (!service) {
      throw new NotFoundException('service not found');
    }

    await this.barberRepository.delete(service.id);

    return { message: 'Server deleted successfully' }
  }
}