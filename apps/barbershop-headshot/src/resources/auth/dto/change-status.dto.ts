import { IsEnum, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { status } from "@app/common";


export class ChangeStatusDTO {
    @ApiProperty({ example: 'client', description: 'Are you a client or a barber?' })
    @IsEnum(status)
    @IsNotEmpty()
    role!: status
}