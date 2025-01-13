const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'User',
    tableName: 'users',
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
        email: {
            type: 'varchar',
            length: 100,
            unique: true,
        },
        password: {
            type: 'varchar',
            length: 255,
        },
        created_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
        },
        updated_at: {
            type: 'timestamp',
            default: () => 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
        },
    },
    relations: {
        accounts: {
            type: 'one-to-many',
            target: 'Account',
            inverseSide: 'user',
        },
        categories: {
            type: 'one-to-many',
            target: 'Category',
            inverseSide: 'user',
        },
        transactions: {
            type: 'one-to-many',
            target: 'Transaction',
            inverseSide: 'user',
        },
    },
});
