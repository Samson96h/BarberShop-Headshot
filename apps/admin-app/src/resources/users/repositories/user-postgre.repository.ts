// import { Injectable, NotFoundException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";

// import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";
// import { IUserRepository } from "../interfaces/user.repositori";
// import { UserEntity } from "@app/common/database/entities";
// import { status } from "@app/common";


// @Injectable()
// export class UserPostgreRepository implements IUserRepository {

//     constructor(
//         @InjectRepository(UserEntity)
//         private readonly userRepository: Repository<UserEntity>,

//         @InjectRepository(UserSecurityEntity)
//         private readonly securityrepository: Repository<UserSecurityEntity>

//     ) { }


//     async getAllBarbers(): Promise<UserEntity[]> {
//         return this.userRepository.find({ where: { role: status.BARBER } })
//     }


//     async getAllClients(): Promise<UserEntity[]> {
//         return this.userRepository.find({ where: { role: status.CLIENT } })
//     }


//     async getOneUser(id: string): Promise<UserEntity> {
//         const user = await this.userRepository.findOne({ where: { id: +id } })

//         if (!user) throw new NotFoundException('user not found')

//         return user
//     }


//     async deleteUser(userId: string): Promise<any> {
//         const user = await this.userRepository.findOne({ where: { id: +userId } })

//         if (!user) throw new NotFoundException('user not found')

//         return this.userRepository.delete(user.id)
//     }


//     async unlockesUser(userId: string): Promise<any> {
//         const user = await this.userRepository.findOne({ where: { id: +userId } })

//         if (!user) throw new NotFoundException('user not found')

//         const userSecurity = await this.securityrepository.findOne({ where: { user } })

//         if (!userSecurity) throw new NotFoundException('user dont has security')

//         user.isActive = true
//         this.userRepository.save(user)

//         userSecurity.blockedUntil = null
//         userSecurity.attemptsCount = 0
//         userSecurity.blockCount = 0

//         return this.securityrepository.save(userSecurity)

//     }

// }