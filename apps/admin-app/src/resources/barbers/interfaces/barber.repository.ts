import {BarberServiceEntity, UserEntity} from "@app/common/database/entities";

export interface IBarberRepository {

    findBarberById(id: string): Promise<UserEntity | null>;

    findAllBarbers(): Promise<UserEntity[]>;

    findServiceById(userId: string): Promise<BarberServiceEntity | null>;

    getAllServices(): Promise<BarberServiceEntity[]>;

    removeService(serviceId: string): Promise<void>;
}