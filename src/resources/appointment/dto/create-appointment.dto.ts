import { IsDate, IsNotEmpty } from "class-validator";

export class CreateAppointmentDto {

    @IsNotEmpty()
    barberId:string

    @IsNotEmpty()
    service:string

    @IsDate()
    date:Date

}
