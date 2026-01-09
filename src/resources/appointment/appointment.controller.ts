import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { AppointmentStatusDTO } from './dto/appointment-status.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentService } from './appointment.service';
import { AuthUser } from 'src/decorators';
import { AuthGuard } from 'src/guards';
import { IdDTO } from 'src/dto';


@UseGuards(AuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }

  @Post()
  async createAppointment(@AuthUser('id') id: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(id, dto)
  }

  @Delete(':id')
  async removeAppointment(@AuthUser('id') id: string, @Param() param: IdDTO) {
    return this.appointmentService.removeAppointment(id, param.id)
  }

  @Patch('id')
  async acceptedOrRejected(@AuthUser('id') id: string, @Param() param: IdDTO, dto: AppointmentStatusDTO) {
    return this.appointmentService.acceptedOrRejected(id, param.id, dto)
  }

  @Get()
  async getAppointmentForUser(@AuthUser('id') id: string){
    return this.appointmentService.getAppointmentsForUser(id)
  }

}
