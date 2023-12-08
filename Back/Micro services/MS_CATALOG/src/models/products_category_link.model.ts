import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey, DataType } from 'sequelize-typescript';

import products from './products.model';
import categories from './categories.model';

@Table({ timestamps: false })
export default class products_category_link extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @ForeignKey(() => products)
    @Column({ type: DataType.INTEGER })
    product_id: number;

    @ForeignKey(() => categories)
    @Column({ type: DataType.INTEGER })
    category_id: number;

    @HasMany(() => products, 'id')
    products: products[];
}