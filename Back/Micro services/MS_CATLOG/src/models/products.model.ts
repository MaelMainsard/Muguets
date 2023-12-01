import { Table, Column, Model, HasMany, PrimaryKey, DataType, BelongsToMany } from 'sequelize-typescript';
import files_related_morphs from './files_related_morphs.model';
import files from './files.model';

@Table({ timestamps: false })
export default class products extends Model {
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number;

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

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.DECIMAL(10, 2) })
    price: number;

    @Column({ type: DataType.STRING })
    variant_type_name: string;

    @Column({ type: DataType.INTEGER })
    stock: number;

    @HasMany(() => files_related_morphs, 'related_id')
    FilesRelatedMorphs: files_related_morphs[];

    @BelongsToMany(() => files, () => files_related_morphs, 'related_id', 'file_id')
    Files: files[];
}