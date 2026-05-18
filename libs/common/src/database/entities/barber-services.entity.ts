import { Entity, OneToOne, JoinColumn, Column, OneToMany } from "typeorm";
import { AppointmentEntity } from "./appointments-entity";
import { Base } from "./base";
import { UserEntity } from "./users-entity";

@Entity('barber_services')
export class BarberServiceEntity extends Base {
    @OneToOne(
        () => UserEntity,
        (user) => user.barberProfile,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn()
    user: UserEntity;

    @Column('text')
    description: string;

    @Column('text', { array: true, default: '{}' })
    services: string[];

    @Column('text', { array: true, default: '{}' })
    workingHours: string[];

    @Column({ nullable: true })
    experience: number;

    @OneToMany(
        () => AppointmentEntity,
        (appointment) => appointment.barber,
    )
    appointments: AppointmentEntity[];
}
