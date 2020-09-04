const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './data.db',
    },
    useNullAsDefault: true
});


(async function () {

    try {
        // Create a table
        await knex.schema
            .createTable('users', table => {
                table.increments('id');
                table.string('user_name');
            })

            // ...and another
            .createTable('accounts', table => {
                table.increments('id');
                table.string('account_name');
                table
                    .integer('user_id')
                    .unsigned()
                    .references('users.id');
            })

    } catch (err) {
        console.error('table creation error:', err)
    }

    try {
        const rows = await knex('users').insert({
            user_name: 'Tom'
        })


        // ...and using the insert id, insert into the other table.

        await knex('accounts').insert({
            account_name: 'kex',
            user_id: rows[0]
        })

    } catch (err) {
        console.error('table insert error:', err)
    }

    // Query both of the rows.
    try {
        const rows = await knex('users')
            .join('accounts', 'users.id', 'accounts.user_id')
            .select('users.user_name as user', 'accounts.account_name as account')


        // map over the results

        rows.map(row => {
            console.log(row)
        })


        // Finally, add a .catch handler for the promise chain
    } catch (e) {
        console.error(e);
    }

    // test query
    try {
        const rows = await knex('accounts')

            .select(knex.raw('COUNT(*) as cnt'), 'accounts.account_name as account')
            .groupBy('account')


        // map over the results

        rows.map(row => {
            console.log(row)
        })


        // Finally, add a .catch handler for the promise chain
    } catch (e) {
        console.error(e);
    }
})()