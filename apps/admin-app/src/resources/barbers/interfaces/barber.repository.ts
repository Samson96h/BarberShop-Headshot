import { BarberServiceEntity, UserEntity } from "@app/common/database/entities";
import { BarberServices, User } from "@app/common/database/scema";


export interface IBarberRepository {
    
    findAllBarbers(): Promise<UserEntity[] | User[]>;

    findOneBarber(userId: string): Promise<UserEntity | User>;
    
    getAllServices(): Promise<BarberServiceEntity[] | BarberServices[]>;
    
    getOneServices(userId: string): Promise<BarberServiceEntity | BarberServiceEntity>;
    
    removeService(userId: string): Promise<{message: string}>;

}