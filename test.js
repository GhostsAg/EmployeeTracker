
// function parseNums(array) {
//     array.forEach( (val, index) => {
//         array[index].trim();    // fix .trim() not a function
//         if ( isNaN(parseFloat(val)) === true) {
//             return;
//         }else {
//             array[index] = parseFloat(val); // delete commas from val floats
//         }
//     });
// }


// const getColList = (table, column) => {
//     connection.query(`SELECT ${column} FROM ${table}`,
//     (err, res) => {
//         if (err) throw err;
//         const choices = new Array;
//         res.forEach( (el) => {
//             choices.push(el.column);
//         });
//         console.log(choices);
//         return choices;
//     });
// }

//getColList("department", "dept_name");

 let arr = ["one  ", "  two", 3, "four", "56000", "45,000"];

// printType(arr);

// function printType(arr) {
//     parseNums(arr);
//     for (let val of arr) {
//         console.log(typeof val, val);
//     }
// }

function getColList(table, column) {
    connection.query(`SELECT ${column} FROM ${table}`,
    (err, res) => {
        if (err) throw err;
        console.log(res);
    })
}

console.log(arr.filter( (el) => el === "four"));

console.log(arr.length);


