import { Inject, Injectable } from '@nestjs/common';

import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { type IBarberRepository } from './interfaces/barber.repository';
import { UpdateBarberServiceDto } from './dto/update-barber.dto';


@Injectable()
export class BarbersService {
  constructor(
    @Inject('BARBER_REPOSITORY')
    private readonly barberRepositort: IBarberRepository
  ) { }


  async createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {
    return this.barberRepositort.createService(userId, dto, file)
  }

  async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {
    return this.barberRepositort.updateService(userId, dto, file)
  }

  async findAllBarbers() {
    return this.barberRepositort.findAllBarbers()
  }


  async removeService(userId: string) {
    return this.barberRepositort.removeService(userId)
  }


  async getMyService(userId: string) {
    return this.barberRepositort.getMyService(userId)
  }

  async getAllServices() {
    return this.barberRepositort.getAllServices()
  }


  async getOneService(serviceId: string) {
    return this.barberRepositort.getOneService(serviceId)
  }

  async findOneBarber(userId: string) {
    return this.barberRepositort.findOneBarber(userId)
  }
}
