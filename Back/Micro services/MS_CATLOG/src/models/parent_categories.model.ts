import { Table, Column, Model, HasMany, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { Products } from './products.model';
import { Categories } from './categories.model';

@Table
export class Parent_Categories extends Model {    
    @PrimaryKey
    @Column
    id: number;
    
    @Column
    name: string;

    @Column
    created_at: Date;

    @Column
    updated_at: Date;

    @Column
    published_at: Date;

    @Column
    created_by_id: number;

    @Column
    updated_by_id: number;    
}