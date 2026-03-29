import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class VerifyCodeDto {

    @ApiProperty({ type: String, example: '986532' })
    @IsNotEmpty()
    @IsString()
    code: string;
    
}
