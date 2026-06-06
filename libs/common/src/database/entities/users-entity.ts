import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AppointmentEntity } from './appointments-entity';
import { BarberServiceEntity } from './barber-services.entity';
import { UserSecurityEntity } from './user.secutity.entity';
import { MediaFilesEntity } from './media-files';
import { Base } from './base';

import { status, userStatus } from '../enums';
import { SecretCode } from './secret-code';


@Entity('users')
export class UserEntity extends Base {

    @Column({
        type: 'varchar',
        unique: true,
        nullable: true,
    })
    email!: string | null;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: true,
    })
    phone!: string | null;

    @Column({ nullable: true })
    firstName!: string;

    @Column({ nullable: true })
    lastName!: string;

    @Column({
        type: 'enum',
        enum: status,
        default: status.CLIENT,
    })
    role!: status;

    @Column({ type: 'enum', enum: userStatus, default: userStatus.ACTIVE })
    status!: userStatus;

    @OneToMany(() => SecretCode, (code) => code.user)
    secretCodes!: SecretCode[];

    @OneToOne(() => UserSecurityEntity, (userSecurity) => userSecurity.user, { cascade: true })
    security?: UserSecurityEntity;

    @OneToMany(() => AppointmentEntity, (appointment) => appointment.client)
    clientAppointments: AppointmentEntity[];

    @OneToOne(() => BarberServiceEntity, (barber) => barber.user)
    barberProfile: BarberServiceEntity;

    @OneToOne(() => MediaFilesEntity, { cascade: true })
    @JoinColumn()
    mediaFiles: MediaFilesEntity;

    @Column({ default: true })
    isActive: boolean

}