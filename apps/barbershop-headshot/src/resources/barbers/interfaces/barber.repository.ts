import { CreateBarberServiceDto } from "../dto/create-barber-service.dto";
import { UpdateBarberServiceDto } from "../dto/update-barber.dto";

export interface IBarberRepository {
    createService(userId: string, dto: CreateBarberServiceDto, file?: Express.Multer.File): any;
    updateService(userId: string, dto: UpdateBarberServiceDto, file?: Express.Multer.File): any;
    findAllBarbers(): any;
    findOneBarber(userId: string): any;
    removeService(userId: string): any;
    getAllServices(): any;
    getMyService(userId: string): any;
    getOneService(serviceId: string): any;
}