import { Entity, Column, ManyToOne } from 'typeorm';

import { Base } from './base';
import { UserEntity } from './users-entity';


@Entity('secret_codes')
export class SecretCode extends Base {

    @Column()
    code: string;

    @ManyToOne(() => UserEntity,(user) => user.secretCodes,{onDelete: 'CASCADE'})
    user: UserEntity;

}