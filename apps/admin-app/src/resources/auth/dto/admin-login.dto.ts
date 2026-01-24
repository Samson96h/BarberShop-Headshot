import { IsNotEmpty, IsString } from "class-validator";

export class AdminLoginDTO {
    @IsNotEmpty()
    @IsString()
    login: string

    @IsNotEmpty()
    @IsString()
    password: string
}