import { BarberOrClientDTO } from "../dto/barber-or-client.dto";
import { ChangeStatusDTO } from "../dto/change-status.dto";
import { VerifyCodeDto } from "../dto/verify-code.dto";


export interface IAuthRepository {
    sendCode(dto: BarberOrClientDTO): Promise<any>;
    verifyCode(phone: string, dto: VerifyCodeDto): Promise<any>;
    changeStatusUser(userId: string, dto: ChangeStatusDTO): Promise<any>;
}