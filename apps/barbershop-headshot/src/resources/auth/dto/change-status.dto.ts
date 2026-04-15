import { IsEnum, IsNotEmpty } from "class-validator";
import { status } from "@app/common";
import { ApiProperty } from "@nestjs/swagger";


export class ChangeStatusDTO {
    @ApiProperty({ example: 'client', description: 'Are you a client or a barber?' })
    @IsEnum(status)
    @IsNotEmpty()
    role: status
}