import { status } from "@app/common";
import { Optional } from "@nestjs/common";
import { IsEnum } from "class-validator";

export class GetUsersDTO {
    @IsEnum({enum:status})
    @Optional()
    role: status
}