const mysql = require("mysql");
const inquirer = require("inquirer");
const myPassword = require("../sql_creds/sqlcred");

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: `${myPassword}`,
    database: "internal_db"
});

connection.connect( (err) => {
    if (err) throw err;
    console.log(`Connected as id: ${connection.threadId}.\n`);
    selectAct();
});

function selectAct() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Department",
                "Add Employee Role",
                "Add Employee"
            ]
        }
    ]).then( ( {action} ) => {
        switch (action) {
            case "Add Department":
                handleDept();
                break;
            default:
                console.log("error");
        }
    });
}

function insertHandle(table, inputVal) {
    connection.query(`INSERT INTO ${table} (dept_name) VALUES ("${inputVal}")`,
    (err, res) => {
        if (err) throw err;
        console.log(`${inputVal} added to ${table}`);
    });
}

function handleDept() {
    inquirer.prompt([
        {
            name: "inputVal",
            message: "Type in the name of the department you would like to add."
        }
    ]).then( ({ inputVal }) => {
        insertHandle("department", inputVal);
    });
}