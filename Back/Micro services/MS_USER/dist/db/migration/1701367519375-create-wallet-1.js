"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateWallet11701367519375 = void 0;
const typeorm_1 = require("typeorm");
class CreateWallet11701367519375 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
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
            yield queryRunner.createForeignKey('Wallets', new typeorm_1.TableForeignKey({
                columnNames: ['userUid'],
                referencedTableName: 'Users',
                referencedColumnNames: ['uid'],
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Supprimer la clé étrangère d'abord pour éviter les erreurs de contrainte
            yield queryRunner.dropForeignKey('Wallets', 'FK_Wallets_Users');
            // Supprimer la table
            yield queryRunner.dropTable('Wallets');
        });
    }
}
exports.CreateWallet11701367519375 = CreateWallet11701367519375;
