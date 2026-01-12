import { PartialType } from '@nestjs/mapped-types';
import { CreateBarberServiceDto } from './create-barber-service.dto';

export class UpdateBarberServiceDto extends PartialType(CreateBarberServiceDto) {}
