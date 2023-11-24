import { Table, Column, Model, HasMany, PrimaryKey } from 'sequelize-typescript';
import { Json } from 'sequelize/types/utils';

@Table
export class Files extends Model {    
    @PrimaryKey
    @Column
    id: number;

    @Column
    name: string;

    @Column
    alternative_text: string;

    @Column
    caption: string;

    @Column
    width: number;

    @Column
    height: number;

    @Column
    formats: Json;

    @Column
    hash: string;

    @Column
    ext: string;

    @Column
    mime: string;
    
    @Column
    size: number;

    @Column
    url: string;

    @Column
    preview_url: string;

    @Column
    provider: string;

    @Column
    provider_metadata: Json;

    @Column
    folder_path: string;

    @Column
    created_at: Date;

    @Column
    updated_at: Date;

    @Column
    created_by_id: number;

    @Column
    updated_by_id: number;
}