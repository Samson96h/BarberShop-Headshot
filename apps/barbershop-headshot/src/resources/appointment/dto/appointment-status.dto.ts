import { AppointmentStatus } from "@app/common/database/enums/appointment-status.enum";
import { IsEnum, IsNotEmpty } from "class-validator";

export class AppointmentStatusDTO {
    @IsNotEmpty()
    @IsEnum(AppointmentStatus)
    status:AppointmentStatus
}