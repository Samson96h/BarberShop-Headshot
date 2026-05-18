import { Column, Entity } from 'typeorm';
import { Base } from './base';

@Entity('admins')
export class AdminEntity extends Base {
    @Column()
    name: string;

    @Column({ unique: true })
    login: string;

    @Column()
    password: string;
}