// 1. implement your own forEach

// create a hof that loops through a array and runs each item in a function.

// e.g. Sum function
function addTwo(num) {
    return num + 2;
}

const scores = [78, 90, 43, 50, 64];


function ForEach (/* ? */) {
    for (let i=0; i < Array.length; i++) {
        console.log(callback{arr[i]})
    }
    console.log('work')

    // only work in here
}
// make this work

ForEach(scores, addTwo)

// expected output:

// so I can console log
// 80
// 92
// 45
// 52
// 66
