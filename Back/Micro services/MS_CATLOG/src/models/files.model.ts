import { Table, Column, Model, HasMany, PrimaryKey, DataType } from 'sequelize-typescript';
import { Json } from 'sequelize/types/utils';
import files_related_morphs from './files_related_morphs.model';

@Table({ timestamps: false })
export default class files extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    alternative_text: string;

    @Column({ type: DataType.STRING })
    caption: string;

    @Column({ type: DataType.INTEGER })
    width: number;

    @Column({ type: DataType.INTEGER })
    height: number;

    @Column({ type: DataType.JSON })
    formats: Json;

    @Column({ type: DataType.STRING })
    hash: string;

    @Column({ type: DataType.STRING })
    ext: string;

    @Column({ type: DataType.STRING })
    mime: string;

    @Column({ type: DataType.INTEGER })
    size: number;

    @Column({ type: DataType.STRING })
    url: string;

    @Column({ type: DataType.STRING })
    preview_url: string;

    @Column({ type: DataType.STRING })
    provider: string;

    @Column({ type: DataType.JSON })
    provider_metadata: Json;

    @Column({ type: DataType.STRING })
    folder_path: string;

    @Column({ type: DataType.DATE })
    created_at: Date;

    @Column({ type: DataType.DATE })
    updated_at: Date;

    @Column({ type: DataType.INTEGER })
    created_by_id: number;

    @Column({ type: DataType.INTEGER })
    updated_by_id: number;

    @HasMany(() => files_related_morphs, 'file_id')
    FilesRelatedMorphs: files_related_morphs[];
}