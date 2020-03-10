
function parseNums(array) {
    array.forEach( (val, index) => {
        array[index].trim();
        if ( isNaN(parseFloat(val)) === true) {
            return;
        }else {
            array[index] = parseFloat(val); // delete commas from val floats
        }
    });
}

let arr = ["one  ", "  two", 3, "four", "56000", "45,000"];

printType(arr);

function printType(arr) {
    parseNums(arr);
    for (let val of arr) {
        console.log(typeof val, val);
    }
}