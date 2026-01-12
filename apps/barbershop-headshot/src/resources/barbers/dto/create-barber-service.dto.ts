import { IsString, IsArray, IsOptional, IsNumber } from "class-validator";

export class CreateBarberServiceDto {
    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    services: string[];

    @IsArray()
    @IsString({ each: true })
    workingHours: string[];

    @IsOptional()
    @IsNumber()
    experience?: number;
}
