import { Table, Column, Model, PrimaryKey, DataType } from 'sequelize-typescript';

@Table({ timestamps: false })
export default class parent_Categories extends Model {    
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.DATE })
    created_at: Date;

    @Column({ type: DataType.DATE })
    updated_at: Date;

    @Column({ type: DataType.DATE })
    published_at: Date;

    @Column({ type: DataType.INTEGER })
    created_by_id: number;

    @Column({ type: DataType.INTEGER })
    updated_by_id: number;  
}