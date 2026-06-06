import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AdminEntity, UserEntity } from '@app/common/database/entities';
import type { IUserRepository } from './interfaces/user.repositori';


@Injectable()
export class UsersService {

  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IUserRepository
  ) { }


  async getAllBarbers(): Promise<UserEntity[]> {

    return this.userRepository.getAllBarbers()
  }


  async getAllClients(): Promise<UserEntity[]> {

    return this.userRepository.getAllClients()
  }


  async getOneUser(id: string): Promise<UserEntity> {

    const user = await this.userRepository.getUserById(id)

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    return user
  }


  async deleteUser(userId: string): Promise<{ message: string }> {

    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND')
    }

    await this.userRepository.deleteUser(userId)

    return {
      message: 'User deleted successfully'
    }
  }


  async unlockesUser(userId: string): Promise<UserEntity> {

    const user = await this.userRepository.getUserById(userId)

    if (!user) throw new NotFoundException('USER_NOT_FOUND')

    const security = await this.userRepository.findSecurityByUserId(userId)

    if (!security) {
      throw new NotFoundException('USER_DONT_HAS_SECURITY')
    }

    user.isActive = true

    security.blockedUntil = null
    security.attemptsCount = 0
    security.blockCount = 0

    await this.userRepository.saveUser(user)

    await this.userRepository.saveSecurity(security)

    return user
  }


  async getOneAdmin(adminId: string): Promise<AdminEntity> {

    const admin = await this.userRepository.getOneAdmin(adminId)

    if (!admin) throw new NotFoundException('ADMN_NOT_FOUND')

    return admin
  }


  async getAllAdmins(adminId: string): Promise<AdminEntity[]> {

    const admin = await this.getOneAdmin(adminId)

    if (admin.name !== 'Super Admin')  throw new ForbiddenException( "YOU_DONT_HAVE_ACCESS_RIGHTS")

    return this.userRepository.getAllAdmins()
  }

}