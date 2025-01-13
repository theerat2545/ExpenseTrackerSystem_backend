const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Account',
    tableName: 'accounts',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 100,
        },
        balance: {
            type: 'decimal',
            precision: 15,
            scale: 2,
            default: 0,
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
        transactions: {
            type: 'one-to-many',
            target: 'Transaction',
            inverseSide: 'account',
        },
    },
});
