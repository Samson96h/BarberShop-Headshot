import { IsString, IsArray, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";


export class CreateBarberServiceDto {

    @ApiProperty({ example: 'es shat porcaru varsahardar em u kktrem amen glox' })
    @IsString()
    description: string;

    @ApiProperty({ type: Array, example: ["qyachalacnel", "plplacnel"] })
    @IsArray()
    @IsString({ each: true })
    @Type(() => String)
    services: string[];

    @ApiProperty({ type: Array, example: ["09:00", "18:00"] })
    @IsArray()
    @IsString({ each: true })
    workingHours: string[];

    @ApiProperty({ type: Number, example: 17 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    experience: number;
    
}

