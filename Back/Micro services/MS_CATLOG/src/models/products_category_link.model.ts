import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Products } from './products.model';
import { Categories } from './categories.model';

@Table
export class Products_category_link extends Model {    
    @PrimaryKey
    @Column
    id: number;

    @ForeignKey(() => Products)
    @Column
    product_id: number;

    @ForeignKey(() => Categories)
    @Column
    category_id: number;
    
}