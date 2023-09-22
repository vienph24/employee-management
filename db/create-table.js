const { getConnection } = require('./connection');

async function createTable() {
    let conn;
    try {
        conn = await getConnection();
        conn.inner.on("trace", (sql) => console.log("[TRACE]", sql));

        /**
         * Create department table
         */
        await conn.run(
            `CREATE TABLE IF NOT EXISTS department (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                code TEXT NOT NULL UNIQUE, 
                name TEXT
            )`
        );

        /**
         * Create employee table
         */
        await conn.run(
            `CREATE TABLE IF NOT EXISTS employee (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                phone TEXT,
                email TEXT,
                sex INTEGER,
                avatar BLOB
            )`
        );

        /**
         * Create department_employee table
         */
        await conn.run(
            `CREATE TABLE IF NOT EXISTS department_employee (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                department_id INTEGER NOT NULL,
                employee_id INTEGER NOT NULL,
                FOREIGN KEY(department_id) REFERENCES department (id),
                FOREIGN KEY(employee_id) REFERENCES employee (id)
            )`
        );
        console.log('Create database done');
    } catch (e) {
        console.error(e);
    } finally {
        await conn?.close();
    }
}

module.exports = {
    createTable
}