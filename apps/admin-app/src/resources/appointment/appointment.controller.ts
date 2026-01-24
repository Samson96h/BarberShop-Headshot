import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';

import { AdminAuthGuard } from '@app/common/guards/admin-auth.guard';
import { AuthUser } from '@app/common/decorators';
import { IdDTO } from '@app/common/dto';


@UseGuards(AdminAuthGuard)
@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) { }


  @Delete(':id')
  async removeAppointment(@AuthUser('id') id: string, @Param() param: IdDTO) {
    return this.appointmentService.removeAppointment(id, param.id)
  }


  @Get(':id')
  async getAppointmentForUser(@Param() param: IdDTO) {
    return this.appointmentService.getAppointmentsForUser(param.id)
  }

}
