require('dotenv').config();
const { AsyncDatabase } = require("promised-sqlite3");

async function getConnection() {
    return AsyncDatabase.open(process.env.DB_NAME?.trim());
}

module.exports = {
    getConnection
}