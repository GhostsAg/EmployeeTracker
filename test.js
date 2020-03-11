let arr = ["one $ ", "  tw' o", "3", "fo,ur", "5600.0", "45,00,0"];

function filterData(array) {
    const regex = /[^a-zA-Z0-9]+/g;
    array.forEach((val, index) => {
        array[index] = val.replace(regex,"");
    });
    parseNums(array);
    return array;
}

function parseNums(array) {
    array.forEach((val, index) => {
        if ( isNaN(parseInt(val)) === false ) {
            array[index] = parseInt(val);
        }
    }); 
}

//parseNums(arr);

printType(arr);

function printType(arr) {
    filterData(arr);
    for (let val of arr) {
        console.log(typeof val, val);
    }
}

// GETS LIST OF ALL VALUES IN A COLUMN

// const getColList = (table, column) => {
//     connection.query(`SELECT ${column} FROM ${table}`,
//     (err, res) => {
//         if (err) throw err;
//         const choices = new Array;
//         res.forEach( (el) => {
//             choices.push(el.column); //@@columnName
//         });
//         console.log(choices);
//         return choices;
//     });
// }

// getColList("department", "dept_name");

// function getColList(table, column) {
//     connection.query(`SELECT ${column} FROM ${table}`,
//     (err, res) => {
//         if (err) throw err;
//         console.log(res);
//     })
// }

// console.log(arr.filter( (el) => el === "four"));

// console.log(arr.length);

// function viewHandle(table) {
//     connection.query(`SELECT * FROM ${table}`, 
//     (err, res) => {
//         if (err) throw err;
//         console.table(res);
//     });
//     setTimeout( () => {
//         selectAct();
//     }, 2500);
// }


