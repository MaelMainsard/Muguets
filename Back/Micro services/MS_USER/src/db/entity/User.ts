import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('Users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ type: 'varchar', nullable: false })
    username!: string;

    @Column({ type: 'varchar', nullable: false })
    email!: string;

    @Column({ type: 'varchar', nullable: false })
    password!: string;

    @Column({ type: 'varchar', nullable: true })
    adress?: string;

    @Column({ type: 'varchar', nullable: true })
    phone?: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

}
