const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Transaction',
    tableName: 'transactions',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
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
        slipOriginalName: {
            type: 'varchar',
            length: 255,
            nullable: true, 
        },
        slipFileName: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        slipFilePath: {
            type: 'varchar',
            length: 500,
            nullable: true,
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
            nullable: false,
        },
        account: {
            type: 'many-to-one',
            target: 'Account',
            joinColumn: { name: 'account_id' },
            onDelete: 'CASCADE',
            nullable: false,
        },
        category: {
            type: 'many-to-one',
            target: 'Category',
            joinColumn: { name: 'category_id' },
            onDelete: 'CASCADE',
            nullable: false,
        },
    },
});
