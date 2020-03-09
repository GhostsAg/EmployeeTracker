const mysql = require("mysql");
const inquirer = require("inquirer");
const myPassword = require("../sql_creds/sqlcred"); // Local sql Workbench password.

const connection = mysql.createConnection({
    host: "localhost",
    port: "3036",
    user: "root",
    password: `${myPassword}`,
    database: "internal_db"
});

connection.connect( (err) => {
    if (err) throw err;
    console.log(`Connected as id: ${connection.threadId}.\n`);

});

