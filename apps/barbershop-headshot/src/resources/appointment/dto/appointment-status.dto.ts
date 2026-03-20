import { AppointmentStatus } from "@app/common/database/enums/appointment-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";

export class AppointmentStatusDTO {

    @ApiProperty({description: 'Appointment status PENDING, ACCEPTED or REJECTED', example: 'pending'})
    @IsNotEmpty()
    @IsEnum(AppointmentStatus)
    status:AppointmentStatus
}