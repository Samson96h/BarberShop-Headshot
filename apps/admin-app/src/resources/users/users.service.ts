import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserSecurityEntity } from '@app/common/database/entities/user.secutity.entity';
import type { IUserRepository } from './interfaces/user.repositori';
import { AdminEntity, UserEntity } from '@app/common/database/entities';
import { status } from '@app/common/database';


@Injectable()
export class UsersService implements IUserRepository {


  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,

    @InjectRepository(UserSecurityEntity)
    private readonly securityrepository: Repository<UserSecurityEntity>

  ) { }


  async getAllBarbers(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { role: status.BARBER } })
  }


  async getAllClients(): Promise<UserEntity[]> {
    return this.userRepository.find({ where: { role: status.CLIENT } })
  }


  async getOneUser(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: +id } })

    if (!user) throw new NotFoundException('user not found')

    return user
  }


  async deleteUser(userId: string): Promise<{message: string}> {
    const user = await this.userRepository.findOne({ where: { id: +userId } })

    if (!user) throw new NotFoundException('user not found')

    await this.userRepository.delete(user.id)

    return {message: 'Appointment deleted successfully'}
  }


  async unlockesUser(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: +userId } })

    if (!user) throw new NotFoundException('user not found')

    const userSecurity = await this.securityrepository.findOne({ where: { user } })

    if (!userSecurity) throw new NotFoundException('user dont has security')

    user.isActive = true
    this.userRepository.save(user)

    userSecurity.blockedUntil = null
    userSecurity.attemptsCount = 0
    userSecurity.blockCount = 0

    await this.securityrepository.save(userSecurity)

    return user

  }

  async getAllAdmins(adminId: string) : Promise<AdminEntity[]> {

    const admin = await this.adminRepository.findOne({where: {id: +adminId}})

    if(admin?.name !== 'Super Admin') {
      throw new ForbiddenException("Sorry, you don't have access rights.")
    }

    return this.adminRepository.find()
  }

}
