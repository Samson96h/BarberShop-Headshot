import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Base } from "./base";
import { UserEntity } from "./users-entity";


@Entity('user_security')
export class UserSecurityEntity extends Base {

    @Column({ name: 'attempts_count', default: 0 })
    attemptsCount: number

    @Column({ name: 'block_count', default: 0 })
    blockCount: number

    @Column({
        name: 'blocked_until',
        type: 'timestamp',
        nullable: true
    })
    blockedUntil: Date | null;

    @OneToOne(() => UserEntity, (user) => user.security, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity;

}