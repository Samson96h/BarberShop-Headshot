import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import type { IBarberRepository } from './interfaces/barber.repository';


@Injectable()
export class BarbersService {

  constructor(
    @Inject('BARBER_REPOSITORY')
    private readonly barberRepository: IBarberRepository
  ) { }


  async findAllBarbers() {

    return this.barberRepository.findAllBarbers()

  }


  async findOneBarber(userId: string) {

    const barber = await this.barberRepository.findBarberById(userId)

    if (!barber) throw new NotFoundException('BARBER_NOT_FOUND')

    return barber
  }


  async getAllServices() {

    return this.barberRepository.getAllServices()

  }


  async getOneServices(serviceId: string) {

    const service = await this.barberRepository.findServiceById(serviceId)

    if (!service) throw new NotFoundException('SERVICE_NOT_FOUND')


    return service

  }


  async removeService(userId: string) {

    const barber = await this.barberRepository.findBarberById(userId)

    if (!barber) {
      throw new NotFoundException('BARBER_NOT_FOUND');
    }

    const service = await this.barberRepository.findServiceById(userId)

    if (!service) {
      throw new NotFoundException('SERVICE_NOT_FOUND')
    }

    await this.barberRepository.removeService(service.id.toString())

    return {
      message: 'Service deleted successfully'
    }
  }
}