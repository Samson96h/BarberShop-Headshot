import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

import { PhotoValidationPipe } from '@app/common/shared/photoValidator/photo-validation.pipe';
import { CreateBarberServiceDto } from './dto/create-barber-service.dto';
import { UpdateBarberServiceDto } from './dto/update-barber.dto';
import { BarbersService } from './barbers.service';
import { AuthUser } from '@app/common/decorators';
import { AuthGuard } from '@app/common/guards';
import { IdDTO } from '@app/common/dto';


@ApiTags('Services')
@ApiHeader({ name: 'X-Auth-token', })
@UseGuards(AuthGuard)
@Controller('barbers')
export class BarbersController {
  constructor(private readonly barbersService: BarbersService) { }

  @Get()
  async getAllBarbers() {
    return this.barbersService.findAllBarbers()
  }

  @Get('service')
  async getAllServices() {
    return this.barbersService.getAllServices()
  }

  @Get(':id')
  async findOneBarber(@Param() param: IdDTO) {
    return this.barbersService.findOneBarber(param.id)
  }

  @UseInterceptors(FileInterceptor('photo'))
  @Post('service')
  async createServices(@AuthUser('id') id: string, @Body() dto: CreateBarberServiceDto,
    @UploadedFile(PhotoValidationPipe) file?: Express.Multer.File) {
    return this.barbersService.createService(id, dto, file)
  }

  @UseInterceptors(FileInterceptor('photo'))
  @Patch('service')
  async updateService(@AuthUser('id') id: string, @Body() dto: UpdateBarberServiceDto,
    @UploadedFile(PhotoValidationPipe) file?: Express.Multer.File) {
    return this.barbersService.updateService(id, dto, file)
  }

  @Delete('service')
  async removeService(@AuthUser('id') id: string) {
    return this.barbersService.removeService(id)
  }

  @Get('service/my')
  async getMyService(@AuthUser('id') id: string) {
    return this.barbersService.getMyService(id)
  }

  @Get('service/:id')
  getOneService(@Param() params: IdDTO) {
    return this.barbersService.getOneService(params.id);
  }
}
