const { EntitySchema } = require('typeorm');
const User = require('./user');
const Account = require('./account');
const Category = require('./categorie');

module.exports = new EntitySchema({
    name: 'Transaction',
    tableName: 'transactions',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        type: {
            type: 'enum',
            enum: ['income', 'expense'],
        },
        amount: {
            type: 'decimal',
            precision: 15,
            scale: 2,
        },
        note: {
            type: 'text',
            nullable: true,
        },
        slip: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        transaction_date: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        created_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: { name: 'user_id' },
            onDelete: 'CASCADE',
        },
        account: {
            type: 'many-to-one',
            target: 'Account',
            joinColumn: { name: 'account_id' },
            onDelete: 'CASCADE',
        },
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: { name: 'category_id' },
            onDelete: 'CASCADE',
        },
    },
});
