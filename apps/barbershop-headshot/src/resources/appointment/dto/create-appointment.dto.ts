import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


export class CreateAppointmentDto {
  @ApiProperty({ type: String, example: '694e7f373bc9e5edb44b4bba' })
  @IsNotEmpty()
  barberId!: string;

  @ApiProperty({ type: String, example: 'mazers bdi krtenq axper jan u trash dzenq' })
  @IsNotEmpty()
  service!: string;

  @ApiProperty({ type: Date, example: '2026-04-09T18:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  date!: Date;
}
