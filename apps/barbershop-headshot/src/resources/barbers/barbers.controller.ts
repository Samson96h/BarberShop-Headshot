import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { UpdateBarberServiceDto } from './dto/update-barber.dto';
import { BarbersService } from './barbers.service';
import { AuthUser } from 'src/decorators';
import { AuthGuard } from 'src/guards';
import { IdDTO } from 'src/dto';


@UseGuards(AuthGuard)
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) { }

  @Get()
  async getAllBarbers() {
    return this.barbersService.findAllBarbers()
  }

  @Get(':id')
  async findOneBarber(@Param() param: IdDTO) {
    return this.barbersService.findOneBarber(param.id)
  }

  @Post('service')
  async createServices(@AuthUser('id') id: string, @Body() dto: CreateBarberServiceDto) {
    return this.barbersService.createService(id, dto)
  }

  @Patch('service')
  async updateService(@AuthUser('id') id: string, @Body() dto: UpdateBarberServiceDto) {
    return this.barbersService.updateService(id, dto)
  }

  @Delete('service')
  async removeService(@AuthUser('id') id: string) {
    return this.barbersService.removeService(id)
  }

  @Get('service/:id')
  async getOneService(@Param() @Body() param: IdDTO) {
    return this.barbersService.getOneServices(param.id)
  }
}
