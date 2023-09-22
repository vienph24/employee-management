const { getConnection } = require('./connection');

async function addNewEmployee(code, phone, email, sex, departmentId, avatar) {
    let conn;
    let result = {
        status: 'success',
        data: null,
        msg: null
    };
    try {
        conn = await getConnection();
        const query = `INSERT INTO employee (code, phone, email, sex, avatar) VALUES (?, ?, ?, ?, ?)`;
        const departmentRecord = await conn.get(`SELECT id FROM department WHERE id = '${departmentId}'`);
        if (!departmentRecord) {
            return {
                status: 'error',
                msg: `Invalid department ${departmentId}`
            };
        }
        const { lastID: employeeId } = await conn.run(query, code, phone, email, sex, avatar);
        await conn.exec(`INSERT INTO department_employee (department_id, employee_id) VALUES ((SELECT id FROM department WHERE id = '${departmentId}'), (SELECT id FROM employee WHERE code = '${code}'))`)
        result.data = {
            employeeId
        }
    } catch (e) {
        console.error(e.message);
        result = {
            status: 'error',
            msg: 'Something went wrong!'
        }
        if (e.message.includes('UNIQUE')) {
            result = {
                status: 'error',
                msg: `Employee ${code} existing`
            }
        }
        if (e.message.includes('SQLITE_CONSTRAINT') || e.message.includes('unrecognized token')) {
            result = {
                status: 'error',
                msg: `Invalid department ${departmentId}`
            }
        }

    } finally {
        await conn?.close();
    }
    return result;
}

async function getLastEmpCode() {
    let conn;
    try {
        conn = await getConnection();
        const query = `SELECT code FROM employee ORDER BY id DESC LIMIT 1`;
        const { code } = await conn.get(query);
        return code;
    } catch (e) {
        return null;
    } finally {
        await conn?.close();
    }
}

async function findEmployee(empCode) {
    let conn;
    try {
        conn = await getConnection();
        const query = `SELECT * FROM employee WHERE code = ?`;
        const employee = await conn.get(query, empCode);
        return employee;
    } catch (e) {
        return null;
    } finally {
        await conn?.close();
    }
}

async function updateEmployee(code, partial) {
    let conn;
    let result = {
        status: 'success',
        data: null,
        msg: null
    };
    try {
        const queries = [];
        for (let field of Object.keys(partial)) {
            if (typeof partial[field] == 'string') {
                queries.push(`${field} = "${partial[field]}"`);
                continue;
            }
            queries.push(`${field} = ${partial[field]}`);
        }
        conn = await getConnection();
        const query = `UPDATE employee SET %UPDATED_COLUMNS% WHERE code = ?`.replace('%UPDATED_COLUMNS%', queries.join(','));
        const employee = await conn.run(query, code);
        result.data = employee;
    } catch (e) {
        console.log(e.message);
        result = {
            status: 'error',
            msg: e.message,
        }
    } finally {
        await conn?.close();
    }

    return result;
}

async function deleteEmployee(empCode) {
    let conn;
    let result = {
        status: 'success',
        data: null,
        msg: null
    };
    try {
        conn = await getConnection();
        conn.inner.on("error", (sql) => console.log("[TRACE]", sql));
        const query = ` 
                        BEGIN;
                        DELETE FROM department_employee
                        WHERE employee_id = (
                            SELECT id FROM employee WHERE code = '${empCode}'
                        );

                        DELETE FROM employee
                        WHERE code = '${empCode}';

                        COMMIT;`;

        const employee = await conn.exec(query);
        result.data = `Delete employee ${empCode} success`;
    } catch (e) {
        result = {
            status: 'error',
            msg: e.message,
        };
    } finally {
        await conn?.close();
    }

    return result;
}

async function findEmployees() {
    let conn;
    try {
        conn = await getConnection();
        const query = `SELECT * FROM employee`;
        const employees = await conn.all(query);
        return employees;
    } catch (e) {
        return null;
    } finally {
        await conn?.close();
    }
}

module.exports = {
    addNewEmployee,
    getLastEmpCode,
    findEmployee,
    updateEmployee,
    deleteEmployee,
    findEmployees
}