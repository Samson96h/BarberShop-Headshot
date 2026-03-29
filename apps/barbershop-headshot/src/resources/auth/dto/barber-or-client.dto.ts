import { IsEnum, IsNotEmpty, IsPhoneNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { status } from "@app/common/database";


export class BarberOrClientDTO {

    @ApiProperty({ type: String, example: '+37493333333' })
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string

    @ApiProperty({ example: 'client', description: 'Are you a client or a barber?' })
    @IsEnum(status)
    @IsNotEmpty()
    statusUser: status
    
}