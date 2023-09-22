const { addNewDepartment } = require('../db/department');

async function createOne(code, name) {
    const result = await addNewDepartment(code, name);
    return {
        success: result.status == 'success' ? true : false,
        data: result.status == 'success' ? 'Add new department success' : result.msg
    }
}

module.exports = {
    createOne
}