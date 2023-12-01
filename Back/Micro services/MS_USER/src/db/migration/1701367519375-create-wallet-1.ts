import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateWallet11701367519375 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Wallets',
            columns: [
                {
                    name: 'userUid',
                    type: 'uuid',
                    isPrimary: true,
                },
                {
                    name: 'cardName',
                    type: 'varchar',
                    isPrimary: true,
                    default: 'DEFAULT',
                },
                {
                    name: 'cardNumber',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'cvv',
                    type: 'varchar',
                    isNullable: false,
                },
                {
                    name: 'expirationDate',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }));

        // Ajouter une clé étrangère
        await queryRunner.createForeignKey('Wallets', new TableForeignKey({
            columnNames: ['userUid'],
            referencedTableName: 'Users',
            referencedColumnNames: ['uid'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Supprimer la clé étrangère d'abord pour éviter les erreurs de contrainte
        await queryRunner.dropForeignKey('Wallets', 'FK_Wallets_Users');

        // Supprimer la table
        await queryRunner.dropTable('Wallets');
    }
}