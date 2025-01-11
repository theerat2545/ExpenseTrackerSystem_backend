const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'BadWord',
    tableName: 'bad_words',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true,
        },
        word: {
            type: 'varchar',
            length: 100,
            unique: true,
        },
    },
});
