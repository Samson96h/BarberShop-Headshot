import { Injectable, BadRequestException, NotFoundException, Inject } from "@nestjs/common";

import type { IBarberRepository } from "./interfaces/barber.repository";
import { CreateBarberServiceDto } from "./dto/create-barber-service.dto";
import { UpdateBarberServiceDto } from "./dto/update-barber.dto";


@Injectable()
export class BarbersService {
  constructor(
    @Inject('BARBER_REPOSITORY')
    private readonly barberRepository: IBarberRepository
  ) { }


  async createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File) {

    const user = await this.barberRepository.findUserById(userId)

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const existing = await this.barberRepository.getServiceBarber(user.id.toString())

    if (existing) throw new BadRequestException('YOU_ALREADY_HAVE_SERVICE')

    if (file) {
      await this.barberRepository.loadUserImage(user.id.toString(), file)
    }

    const service = this.barberRepository.createService(user, dto)


    return service
  }


  async updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File) {

    const service = await this.barberRepository.findServiceByUserId(userId)

    if (!service) throw new NotFoundException('SERVICE_NOT_FOUND')

    if (file) {
      await this.barberRepository.loadUserImage(userId, file)
    }

    const updatedService = await this.barberRepository.updateService(service, dto)

    const userWithMedia = await this.barberRepository.getUserWithMedia(userId)

    return {
      service: updatedService,
      portfolioPath: userWithMedia?.mediaFiles?.path || null
    }
  }


  async findAllBarbers() {

    return this.barberRepository.findAllBarbers()

  }


  async findOneBarber(userId: string) {

    const barber = await this.barberRepository.findUserById(userId)

    if (!barber) throw new NotFoundException('BARBER_NOT_FOUND')

    return barber

  }


  async removeService(userId: string) {

    const service = await this.barberRepository.findServiceByUserId(userId)

    if (!service) throw new NotFoundException('SERVICE_NOT_FOUND')

    await this.barberRepository.removeService(service)

    return {
      message: 'Service deleted'
    }

  }


  async getMyService(userId: string) {
    const service = await this.barberRepository.findServiceByUserId(userId)

    if (!service) {
      return null
    }

    const userWithMedia = await this.barberRepository.getUserWithMedia(userId)

    return {
      ...service,
      portfolioImage: userWithMedia?.mediaFiles?.path || null
    }
  }


  async getAllServices() {

    return this.barberRepository.getAllServices()

  }


  async getOneService(serviceId: string) {

    const service = await this.barberRepository.getOneService(serviceId)

    if (!service) throw new NotFoundException('SERVICE_NOT_FOUND')

    const userWithMedia = await this.barberRepository.getUserWithMedia(service.user.id.toString())

    return {
      ...service,
      portfolioImage: userWithMedia?.mediaFiles?.path || null
    }

  }


}