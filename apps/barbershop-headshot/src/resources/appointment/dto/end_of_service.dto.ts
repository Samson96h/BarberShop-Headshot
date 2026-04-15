import { endOrder } from "@app/common";
import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class EndOfServiceDTO {
    @IsNotEmpty()
    @IsString()
    appointmentId!: string

    @IsNotEmpty()
    @IsEnum(endOrder)
    result!: endOrder

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    priceOfWork!: number;
}