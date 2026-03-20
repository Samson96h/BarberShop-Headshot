import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyCodeDto {

    @ApiProperty({ type: String, example: '986532' })
    @IsNotEmpty()
    @IsString()
    code: string;
}
