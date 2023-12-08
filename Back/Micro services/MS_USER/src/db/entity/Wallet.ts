import { Entity, Column, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User'; // Assurez-vous de spécifier le chemin correct vers votre entité User

@Entity('Wallets')
export class Wallet {

    @Column('uuid')
    userUid!: string;

    @PrimaryColumn({ type: 'varchar', nullable: false})
    cardName?: string;

    @Column({ type: 'varchar', nullable: false })
    cardNumber?: string;

    @Column({ type: 'varchar', nullable: false })
    cvv?: string;

    @Column({ type: 'timestamp', nullable: false })
    expirationDate?: Date;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @ManyToOne(() => User, user => user.uid, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'userUid' })
    user?: User;
}