const { addNewEmployee, getLastEmpCode, findEmployee, updateEmployee, deleteEmployee, findEmployees } = require("../db/employee");

async function createOne(code, phone, email, sex, departmentId, avatar) {
    let increaseCode = code;

    if (!code || code == 'null' || code == 'blank') {
        increaseCode = increaseEmpId(await getLastEmpCode());
    }

    const employee = await addNewEmployee(increaseCode, phone, email, encodeSexType(sex), departmentId, avatar);
    return {
        success: employee.status == 'success' ? true : false,
        data: employee.status == 'success' ? `Add new employee ${increaseCode} success` : employee.msg,
    };
}

async function getEmployee(code) {
    let employee;
    if (code) {
        employee = await findEmployee(code);
    } else {
        employee = await findEmployees();
    }

    return {
        success: employee ? true : false,
        data: employee,
    }
}

async function updateOne(code, partial) {
    if (Object.keys(partial).includes('sex')) {
        partial = {
            ...partial,
            sex: encodeSexType(partial.sex),
        }
    }
    const employee = await updateEmployee(code, partial);
    return {
        success: employee.status == 'success' ? true : false,
        data: employee.status == 'success' ? 'Update employee info success' : employee.msg,
    }
}

async function deleteOne(code) {
    const deleted = await deleteEmployee(code);
    return {
        success: deleted.status == 'success' ? true : false,
        data: deleted.status == 'success' ? deleted.data : deleted.msg,
    }
}

function encodeSexType(type = 0) {
    const typeLowerCase = type?.toLowerCase();
    if (typeLowerCase == "not known") return 0;
    if (typeLowerCase == "male") return 1;
    if (typeLowerCase == "female") return 2;
}

function increaseEmpId(code) {
    if (!code) {
        return '00001-Emp';
    }

    const empIdPattern = /^Emp-\d+$/;
    const numberPattern = /\d+/;

    const numericPart = parseInt(code, 10);
    const numericLength = code.match(numberPattern)[0].length;

    if (empIdPattern.test(code)) {
        const newNumericPart = parseInt(code.split('-')[1]) + 1;
        const formattedNumericPart = String(newNumericPart).padStart(numericLength, '0');
        return `Emp-${formattedNumericPart}`;
    }

    const newNumericPart = numericPart + 1;

    const formattedNumericPart = String(newNumericPart).padStart(numericLength, '0');

    return `${formattedNumericPart}-Emp`;
}

module.exports = {
    createOne,
    getEmployee,
    updateOne,
    deleteOne
};
