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
                "Add Employee",
                "View Departments",
                "View Roles",
                "View Employees",
                "View All",
                "Update Employee Role"
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
            case "Add Employee":
                handleEmp();
                break;
            case "View Departments":
                views("department");
                break;
            case "View Roles":
                views("emp_role");
                break;
            case "View Employees":
                views("employee");
                break;
            case "View All":
                views("All");
                break;
            case "Update Employee Role":
                updateEmpRole();
                break;
            default:
                console.log("error");
                break;
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
            connection.query(`INSERT INTO ${table} (first_name, last_name, role_id, manager_id) VALUES ("${inputVal[0]}", "${inputVal[1]}", ${inputVal[2]}, ${inputVal[3]})`,
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
            message: "Input new department name.",
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
            message: "Input employee title.",
            validate: function(input) {
                let done = this.async();
                validStr(input, "employee title", done);
            }
        },
        {
            name: "salary",
            message: "Input employee salary.",
            validate: function(input) {
                let done = this.async();
                validNum(input, "salary", done);
            }
        },
        {
            type: "list",
            name: "department",
            message: "Choose department.",
            choices: getDepts()
        }
    ]).then( ({ title, salary, department }) => {
        let inputVal = [title, salary, department];
        // filter data
        filterData(inputVal);
        insertHandle("emp_role", ...inputVal);
    });
}

function handleEmp() {
    inquirer.prompt([
        {
            name: "firstName",
            message: "Input employee first name.",
            validate: function(input) {
                let done = this.async();
                validStr(input, "employee first name", done);
            }
        },
        {
            name: "lastName",
            message: "Input employee last name.",
            validate: function(input) {
                let done = this.async();
                validStr(input, "employee last name", done);
            }
        },
        {
            name: "roleId",
            message: "Input employee role ID.",
            validate: function(input) {
                let done = this.async();
                validRoleId(input, done);
            }
        },
        {
            name: "managerId",
            message: "Input manager ID.",
            validate: function(input) {
                let done = this.async();
                validNum(input, "manager ID", done);
            }
        }
    ]).then( ({ firstName, lastName, roleId, managerId }) => {
        let inputVal = [firstName, lastName, roleId, managerId];
        filterData(inputVal);
        insertHandle("employee", ...inputVal);
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

function validRoleId(input, done) {
    connection.query(`SELECT id FROM emp_role`,
    (err, res) => {
        if (err) {
            throw err;
        } else if (isNaN(parseInt(input)) === false) {
            let check = res.filter( (el) => el.id === parseInt(input));
            check.length === 0 ? done("Role ID invalid, please make a role for that ID.", false) : done(null, true);
        } else {
            done("Invalid role ID number.", false);
        }
    });
}

function validEmpId(input, done) {
    connection.query(`SELECT id FROM employee`,
    (err, res) => {
        if (err) {
            throw err;
        } else if (isNaN(parseInt(input)) === false) {
            let check = res.filter( (el) => el.id === parseInt(input));
            check.length === 0 ? done("Employee ID invalid, no employee with that ID.", false) : done(null, true);
        } else {
            done("Invalid employee ID number.", false);
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

function viewAll() {
    connection.query("SELECT * FROM (department RIGHT JOIN emp_role ON department.dept_name = emp_role.department) RIGHT JOIN employee ON emp_role.id = employee.role_id", 
    (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    setTimeout( () => {
        selectAct();
    }, 2500);
}

function viewHandle(table) {
    connection.query(`SELECT * FROM ${table}`, 
    (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    setTimeout( () => {
        selectAct();
    }, 2500);
}

function views(table) {
    switch(table) {
        case "department":
            viewHandle(table);
            break;
        case "emp_role":
            viewHandle(table)
            break;
        case "employee":
            viewHandle(table);
            break;
        case "All":
            viewAll();
        default:
            console.log("Error pulling up table.");
            break;
    }
}

function updateEmpRole() {
    inquirer.prompt([
        {
            name: "id",
            message: "Input the employee ID.",
            validate: function(input) {
                let done = this.async();
                validEmpId(input, done);
            }
        },
        {
            name: "roleId",
            message: "Input the new role ID.",
            validate: function(input) {
                let done = this.async();
                validRoleId(input, done);
            }
        }
    ]).then( ({ id, roleId }) => {
        let inputVal = [roleId, id];
        filterData(inputVal);
        connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, inputVal,
        (err) => {
            if (err) throw err;
            console.log("Update successful.");
            setTimeout( () => {
                selectAct()
            }, 2500);
        });
    });
}