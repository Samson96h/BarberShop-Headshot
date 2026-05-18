import { Entity, ManyToOne, Column } from "typeorm";
import { AppointmentStatus, endOrder } from "../enums";
import { BarberServiceEntity } from "./barber-services.entity";
import { Base } from "./base";
import { UserEntity } from "./users-entity";

@Entity('appointments')
export class AppointmentEntity extends Base {
    @ManyToOne(
        () => UserEntity,
        (user) => user.clientAppointments,
        { onDelete: 'CASCADE' },
    )
    client: UserEntity;

    @ManyToOne(
        () => BarberServiceEntity,
        (barber) => barber.appointments,
        { onDelete: 'CASCADE' },
    )
    barber: BarberServiceEntity;

    @Column()
    service: string;

    @Column({
        type: 'timestamp',
    })
    date: Date;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING,
    })
    status: AppointmentStatus;

    @Column({
        type: 'enum',
        enum: endOrder,
        nullable: true,
    })
    end_of_order: endOrder | null;
}