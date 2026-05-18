import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
import { Exclude } from 'class-transformer';


export abstract class Base {
    @PrimaryGeneratedColumn()
    id: number;

    @Exclude()
    @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
    createdAt: Date;

    @Exclude()
    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
    updatedAt: Date;
}