import { IsDate, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsNotEmpty()
  barberId: string;

  @IsNotEmpty()
  service: string;

  @Type(() => Date)
  @IsDate()
  date: Date;
}
