import { AuthUser } from '@app/common/decorators';
import { IdDTO } from '@app/common/dto';
import { AuthGuard } from '@app/common/guards';

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AppointmentStatusDTO } from './dto/appointment-status.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentService } from './appointment.service';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { EndOfServiceDTO } from './dto/end_of_service.dto';



@ApiTags('Appointment')
@ApiHeader({ name: 'X-Auth-token', })
@UseGuards(AuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }


  @Patch('end-of-service')
  async endOfOrder(@AuthUser('id') id: string, @Body() dto: EndOfServiceDTO) {
    return this.appointmentService.endOfOrder(id, dto)
  }
  

  @Patch('/:id')
  async acceptedOrRejected(@AuthUser('id') id: string, @Param() param: IdDTO, @Body() dto: AppointmentStatusDTO,) {
    return this.appointmentService.acceptedOrRejected(id, param.id, dto);
  }


  @Post()
  async createAppointment(@AuthUser('id') id: string, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(id, dto)
  }


  @Delete(':id')
  async removeAppointment(@AuthUser('id') id: string, @Param() param: IdDTO) {
    return this.appointmentService.removeAppointment(id, param.id)
  }


  @Get()
  async getAppointmentForUser(@AuthUser('id') id: string) {
    return this.appointmentService.getAppointmentsForUser(id)
  }



}
