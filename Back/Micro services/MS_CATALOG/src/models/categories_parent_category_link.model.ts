import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import Parent_Categories  from './parent_categories.model';
import Categories from './categories.model';

@Table({ timestamps: false })
export default class categories_parent_category_link extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @ForeignKey(() => Categories)
    @Column({ type: DataType.INTEGER })
    category_id: number;

    @ForeignKey(() => Parent_Categories)
    @Column({ type: DataType.INTEGER })
    parent_category_id: number;
}