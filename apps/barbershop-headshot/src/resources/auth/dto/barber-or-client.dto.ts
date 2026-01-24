import { IsEnum, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { status } from "@app/common/database"; 

export class BarberOrClientDTO {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone : string

    @IsEnum({enum:status})
    @IsNotEmpty()
    statusUser : status
}