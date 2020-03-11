const mysql = require("mysql");
const inquirer = require("inquirer");
require("dotenv").config();

const connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: process.env.myPassword,
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
                console.log(`Changes made succesfully to ${table} table.`);
                selectAct();
            });
            break;
        case "emp_role":
            connection.query(`INSERT INTO ${table} (title, salary, department) VALUES ("${inputVal[0]}", ${inputVal[1]}, "${inputVal[2]}")`,
            (err, res) => {
                if (err) throw err;
                console.log(`Changes made succesfully to ${table} table.`);
                selectAct();
            });
            break;
        case "employee":
            connection.query(`INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES ("${inputVal}", "${inputVal}", "${inputVal}", "${inputVal}")`,
            (err, res) => {
                if (err) throw err;
                console.log(`Changes made succesfully to ${table} table.`);
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
            message: "Type in the name of the department you would like to add.",
            validate: function(input) {
                let done = this.async();
                validDpt(input, done);
            }
        }
    ]).then( ({ inputVal }) => {
        insertHandle("department", inputVal);
    });
}

function handleRole() {
    inquirer.prompt([
        {
            name: "title",
            message: "Type in the title of the employee you would like to add.",
            validate: function(input) {
                let done = this.async();
                validStr(input, "employee title", done);
            }
        },
        {
            name: "salary",
            message: "Type in the employee salary.",
            validate: function(input) {
                let done = this.async();
                validNum(input, "salary", done);
            }
        },
        {
            type: "list",
            name: "department",
            message: "To what department does this employee belong?",
            choices: getDepts()
        }
    ]).then( ({ title, salary, department }) => {
        let inputVal = [title, salary, department];
        // filter data
        filterData(inputVal);
        insertHandle("emp_role", ...inputVal);
    });
}

function filterData(array) {
    const regex = /[^a-zA-Z0-9]+/g;
    array.forEach((val, index) => {
        array[index] = val.replace(regex,"");
    });
    parseNums(array);
}

function parseNums(array) {
    array.forEach((val, index) => {
        if ( isNaN(parseInt(val)) === false ) {
            array[index] = parseInt(val);
        }
    }); 
}

function validStr(input, name, done) {
    isNaN(parseInt(input)) === true ? done(null, true) : done(`Please enter a valid ${name}.`, false);  
}

function validNum(input, name, done) {
    isNaN(parseInt(input)) === false ? done(null, true) : done(`Please enter a valid ${name} number.`, false);
}

const getDepts = () => {
    const choices = new Array();
    connection.query("SELECT dept_name FROM department",
    (err, res) => {
        if (err) throw err;
        res.forEach( (el) => {
            choices.push(el.dept_name);
        })
    });
    return choices;
}

function validDpt(input, done) {
    connection.query(`SELECT dept_name FROM department`,
    (err, res) => {
        if (err) {
            throw err;
        } else if (isNaN(parseInt(input)) === true) {
            let check = res.filter( (el) => el.dept_name === input);
            check.length === 0 ? done(null, true) : done("Department already exists.", false);
        } else {
            done("Department name invalid.", false);
        }
    });
}