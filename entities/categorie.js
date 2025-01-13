const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Category',
    tableName: 'categories',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 100,
            unique: true,
        },
        type: {
            type: 'enum',
            enum: ['income', 'expense'],
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
            nullable: false,
        },
        transactions: {
            type: 'one-to-many',
            target: 'Transaction',
            inverseSide: 'category',
        },
    },
    
});
