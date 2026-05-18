import { Controller, Get, Body, Param, Delete, UseGuards, Post } from '@nestjs/common';

import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { GetUsersDTO } from './dto/get-users.dto';
import { UsersService } from './users.service';
import { IdDTO } from '@app/common/dto';
import { AuthUser } from '@app/common/decorators';


@UseGuards(AdminAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get("admins")
  async getAllAdmins(@AuthUser('id') adminId: string) {
    return this.usersService.getAllAdmins(adminId)
  }

  @Get(":id")
  async getOneUser(@Param() param: IdDTO) {
    return this.usersService.getOneUser(param.id)
  }

  @Delete(':id')
  async deleteUser(@Param() param: IdDTO) {
    return this.usersService.deleteUser(param.id)
  }

  @Post(':id')
  async unlockedUser(@Param() param: IdDTO) {
    return this.usersService.unlockesUser(param.id)
  }

  @Get('clients')
  async getClients() {
    return this.usersService.getAllBarbers()
  }

  @Get('barbers')
  async getBarbers() {
    return this.usersService.getAllBarbers()
  }

}
