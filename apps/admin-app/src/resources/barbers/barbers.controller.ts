import { IdDTO } from '@app/common/dto';

import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { BarbersService } from './barbers.service';


@UseGuards(AdminAuthGuard)
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) { }

  @Get()
  getAllBarbers() {
    return this.barbersService.findAllBarbers()
  }

  @Get('service')
  getAllServices() {
    return this.barbersService.getAllServices()
  }

  @Get('service/:id')
  getOneService(@Param() param: IdDTO) {
    return this.barbersService.getOneServices(param.id)
  }

  @Delete('service/:id')
  removeService(@Param() param: IdDTO) {
    return this.barbersService.removeService(param.id)
  }

  @Get(':id')
  findOneBarber(@Param() param: IdDTO) {
    this.barbersService.findOneBarber(param.id)
    return {
      message: 'The server has been successfully removed.'
    }
  }
}
