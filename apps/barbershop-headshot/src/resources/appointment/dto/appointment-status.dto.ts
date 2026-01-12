import { IsEnum, IsNotEmpty } from "class-validator";
import { AppointmentStatus } from "src/database/enums/appointment-status.enum";

export class AppointmentStatusDTO {
    @IsNotEmpty()
    @IsEnum(AppointmentStatus)
    status:AppointmentStatus
}