import db from '#config/pg-config';

db.getTableColumns = async (table) => {
    const query = await db
        .withSchema('information_schema')
        .select(
            'column_name AS name',
            db.raw(`
                CASE
                    WHEN data_type IN ('integer','numeric')
                    THEN 'Number'

                    WHEN data_type = 'boolean'
                    THEN 'Boolean'

                    WHEN data_type IN ('JSONB', 'JSON')
                    THEN 'Object'

                    ELSE 'String'
                END AS type
            `)
        )
        .from('columns')
        .where({
            table_schema: 'public',
            table_name: table
        });
}

export default db;