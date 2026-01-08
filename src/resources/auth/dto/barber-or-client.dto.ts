import { IsEnum, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { status } from "src/database";

export class BarberOrClientDTO {

    @IsNotEmpty()
    @IsPhoneNumber()
    phone : string

    @IsEnum({enum:status})
    @IsNotEmpty()
    statusUser : status
}