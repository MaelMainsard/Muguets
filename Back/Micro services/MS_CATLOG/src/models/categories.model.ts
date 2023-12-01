import { Table, Column, Model, HasMany, PrimaryKey, DataType } from 'sequelize-typescript';
import files_related_morphs from './files_related_morphs.model';

@Table({ timestamps: false })
export default class categories extends Model {    
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