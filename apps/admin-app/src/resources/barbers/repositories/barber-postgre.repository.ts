// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";

// import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
// import { IBarberRepository } from "../interfaces/barber.repository";
// import { status } from "@app/common";


// @Injectable()
// export class BarberPostgreRepository implements IBarberRepository {

//     constructor(
//         @InjectRepository(BarberServiceEntity)
//         private readonly barberRepository: Repository<BarberServiceEntity>,
//         @InjectRepository(UserEntity)
//         private readonly userRepository: Repository<UserEntity>
//     ) { }


//     async findOneBarber(userId: string): Promise<any> {
//         const barber = await this.barberRepository.findOne({ where: { id: +userId } })

//         if (!barber) throw new NotFoundException('barber not found')

//         return barber
//     }


//     async findAllBarbers(): Promise<any> {
//         return this.userRepository.find({ where: { role: status.BARBER } })
//     }


//     async getAllServices(): Promise<any> {
//         return this.barberRepository.find({ relations: ['user'] })
//     }


//     async getOneServices(userId: string): Promise<any> {
//         const service = await this.barberRepository.findOne({ where: { id: +userId }, relations: ['user'] })

//         if (!service) throw new NotFoundException('Service not found')

//         return service
//     }


//     async removeService(userId: string): Promise<any> {
//         const user = await this.userRepository.findOne({ where: { id: +userId } })

//         if (!user) throw new NotFoundException('user not found')

//         const service = await this.barberRepository.findOne({ where: { user } })

//         if (!service) throw new NotFoundException('service not found')

//         return this.barberRepository.delete(service.id)
//     }


// }