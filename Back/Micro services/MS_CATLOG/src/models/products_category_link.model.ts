import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';
import Products from './products.model';
import Categories from './categories.model';

@Table({ timestamps: false })
export default class products_category_link extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @ForeignKey(() => Products)
    @Column({ type: DataType.INTEGER })
    product_id: number;

    @ForeignKey(() => Categories)
    @Column({ type: DataType.INTEGER })
    category_id: number;
}