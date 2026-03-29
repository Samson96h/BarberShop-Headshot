import { Optional } from "@nestjs/common";
import { IsEnum } from "class-validator";
import { status } from "@app/common";


export class GetUsersDTO {
    @IsEnum({ enum: status })
    @Optional()
    role: status
}