const { getConnection } = require('./connection');

async function addNewDepartment(code, name) {
    let conn;
    let result = {
        status: 'success',
        data: null,
        msg: null
    };
    try {
        conn = await getConnection();
        const query = `INSERT INTO department (code, name) VALUES (?, ?)`;
        const { lastID: departmentId } = await conn.run(query, code, name);
        result.data = {
            departmentId
        };
    } catch (e) {
        console.error(e.message);
        if (e.message.includes('UNIQUE')) {
            result = {
                status: 'error',
                msg: `Department ${code} existing`
            }
        }
    } finally {
        await conn?.close();
    }

    return result;
}

module.exports = {
    addNewDepartment,
}