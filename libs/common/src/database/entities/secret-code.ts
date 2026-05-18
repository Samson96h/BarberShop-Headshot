import { Entity, Column, ManyToOne } from 'typeorm';

import { Base } from './base';
import { UserEntity } from '../entities';


@Entity()
export class SecretCode extends Base {
  @Column()
  code: string;

  @ManyToOne(() => UserEntity, (user) => user.secretCodes, { onDelete: 'SET NULL' })
  user: UserEntity;

}
