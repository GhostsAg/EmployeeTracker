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
            case "Add Employee Role":
                handleRole();
                break;
            default:
                console.log("error");
        }
    });
}

function insertHandle(table, ...inputVal) {
    switch (table) {
        case "department":
            connection.query(`INSERT INTO ${table} (dept_name) VALUES ("${inputVal}")`,
            (err, res) => {
                if (err) throw err;
                console.log(`${inputVal} added to ${table}`);
                selectAct();
            });
            break;
        case "emp_role":
            parseNums(inputVal);
            connection.query(`INSERT INTO ${table} (title, salary, department) VALUES (${inputVal})`,
            (err, res) => {
                if (err) {console.log(typeof inputVal[1]); throw err;}
                console.log(`${inputVal} added to ${table}`);
                selectAct();
            });
            break;
        case "employee":
            connection.query(`INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES ("${inputVal}", "${inputVal}", "${inputVal}", "${inputVal}")`,
            (err, res) => {
                if (err) throw err;
                console.log(`${inputVal} added to ${table}`);
                selectAct();
            });
            break;
        default:
            console.log("Error looking up table");
            break;
    }
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

function handleRole() {
    inquirer.prompt([
        {
            name: "title",
            message: "Type in the title of the employee you would like to add."
        },
        {
            name: "salary",
            message: "Type in the employee salary."
        },
        {
            name: "department",
            message: "To what department does this employee belong?"
        }
    ]).then( ({ title, salary, department }) => {
        let inputVal = [title, salary, department];
        insertHandle("emp_role", ...inputVal);
    });
}

function parseNums(array) {
    array.forEach( (val, index) => {
        if ( isNaN(parseFloat(val)) === true) {
            return;
        }else {
            array[index] = parseFloat(val);
        }
    });
}