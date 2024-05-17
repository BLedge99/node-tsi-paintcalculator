function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
        resolve(answer);
        });
    });
}

function calculatePrice(area, brand, colour) {//update
    return area * prices[brand][colour];
}

function shapeInstructions(shape,area){
    switch (shape){
        case 'Rectangle':
            console.log(`Please enter the width and height of your ${area}, in meters, one after another: `);
            break;
        case 'Triangle':
            console.log(`Please enter the length of all three sides of your ${area}, in meters, one after another: `);
            break;
        case 'Circle':
            console.log(`Please enter the diameter of your ${area} in meters: `);
            break;
    }
}