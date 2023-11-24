import { Table, Column, Model, HasMany, PrimaryKey } from 'sequelize-typescript';

@Table
export class Categories extends Model {    
    @PrimaryKey
    @Column
    id: number;

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

    @Column
    name: string;
}