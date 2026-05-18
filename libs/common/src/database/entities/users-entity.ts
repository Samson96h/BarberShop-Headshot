import { Column, Entity, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { AppointmentEntity } from './appointments-entity';
import { BarberServiceEntity } from './barber-services.entity';
import { Base } from './base';
import { MediaFilesEntity } from './media-files';
import { status, userStatus } from '../enums';
import { UserSecurityEntity } from './user.secutity.entity';

@Entity('users')
export class UserEntity extends Base {
    @Column({
        type: 'varchar',
        unique: true,
        nullable: true,
    })
    email: string | null;

    @Column({
        type: 'varchar',
        unique: true,
        nullable: true,
    })
    phone: string | null;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    secretCodes: any;

    @Column({
        type: 'enum',
        enum: status,
        default: status.CLIENT,
    })
    role: status;

    @Column({ default: true })
    isActive: boolean;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    blockedUntil: Date | null;

    @OneToMany(() => AppointmentEntity, (appointment) => appointment.client)
    clientAppointments: AppointmentEntity[];

    @OneToOne(() => BarberServiceEntity, (barber) => barber.user)
    barberProfile: BarberServiceEntity;

    @OneToOne(() => MediaFilesEntity, { cascade: true })
    @JoinTable({
        name: 'user_media_files',
        joinColumn: { name: 'user_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'media_file_id', referencedColumnName: 'id' },
    })
    mediaFiles: MediaFilesEntity

    @Column({
        type: 'enum',
        enum: userStatus,
        default: userStatus.ACTIVE,
    })
    status: userStatus;

    @OneToOne(() => UserSecurityEntity, (userSecurity) => userSecurity.user)
    security: UserSecurityEntity
}