import { AppointmentStatus } from "@app/common/database/enums/appointment-status.enum";
import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class AppointmentStatusDTO {
    @ApiProperty({ description: 'Appointment status PENDING, ACCEPTED or REJECTED', example: 'pending' })
    @IsNotEmpty()
    @IsEnum(AppointmentStatus)
    status: AppointmentStatus
}