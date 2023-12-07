import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import { Json } from 'sequelize/types/utils';
import files  from './files.model';
import products from './products.model';

@Table({ timestamps: false })
export default class files_related_morphs extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @ForeignKey(() => files)
    @Column({ type: DataType.INTEGER })
    file_id: number;

    @ForeignKey(() => products)
    @Column({ type: DataType.INTEGER })
    related_id: number;

    @Column({ type: DataType.STRING })
    related_type: string;

    @Column({ type: DataType.STRING })
    field: string;

    @Column({ type: DataType.INTEGER })
    order: number;

    
}
