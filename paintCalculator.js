const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const sides = { 'Rectangle': 2, 'Circle': 1, 'Triangle': 3 };
const shapes = ['Rectangle', 'Triangle', 'Circle'];
const prices = {
    'Dulux': {
        "Matt White": 2.40,
        "Pure Brilliant White Silk Emulsion": 2.40,
        "Matt Standard Emerald Glade": 2.45,
        "Matt Easycare Willow Emulsion": 2.45,
        "Kiwi Crush Silk": 8.80
    },
    'Zinsser': {
        "Matt White Anti Mold": 21,
        "Perma White Satin Anti Mold": 16.80,
        "Black Multi Surface AllCoat": 28
    },
    'Berger': {
        "Silk Emulsion Lemon Glow": 8.40,
        "Navy Blue Non-Drip": 22.19,
        "Quick Dry Matt White": 12.20,
        "Gloss Non-Drip Russian Red": 22.19,
        "Satin Magnolla": 28
    }
};

function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
        resolve(answer);
        });
    });
}

function calculateArea(shape, dimensions) {
    if (shape === 'Rectangle') {
        return dimensions[0] * dimensions[1];
    } 
    else if (shape === 'Triangle') {
        const [a, b, c] = dimensions;
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    } 
    else if (shape === 'Circle') {
        return (dimensions[0] / 2) ** 2 * Math.PI;
    }
}

function calculatePrice(area, brand, colour) {
    return area * prices[brand][colour];
}

function showCatalogue() {
    console.log(prices);
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

async function getShape(area) {
    let shape = await promptUser(`Please enter shape of ${area} (Rectangle, Triangle, Circle): `);
    if (!shapes.includes(shape)) {
        console.log("Please ensure you enter Rectangle, Triangle, or Circle, checking for capitalization.");
        console.log("Unfortunately, other shapes are not available at this time.");
        return null;
    }
    return shape;
}

async function getAreas(shape) {
    let dimensions = [];
    for (let side = 0; side < sides[shape]; side++) {
        dimensions.push(parseFloat(await promptUser(`Please enter side ${side + 1}: `)));
    }
    return dimensions;
}

async function userForm() {
    let walls = [];
    const numWalls = parseInt(await promptUser("Please enter the number of walls you would like to paint: "));
    console.log("You will now be asked to enter details about each wall you would like to paint");

    //Iterate over each wall to be painted
    for (let i = 0; i < numWalls; i++) {
        console.log(`Please enter details about wall ${i + 1}: `);
        //Get shape of wall
        let shape = await getShape('wall');
        if (!shape) continue;
        //Find wall dimensions
        console.log("Next, you will be asked to enter the dimensions of your wall: ");
        shapeInstructions(shape,"wall")
        let dimensions = await getAreas(shape);
        //Get brand and colour preferences
        const viewCatalogue = await promptUser("You will now be asked for your paint preferences, if you need to view the paint catalogue please type 1, otherwise press enter: ");
        if (viewCatalogue === '1') {
            showCatalogue();
        }
        let brand = await promptUser("Please enter brand of paint you would like: ");
        let colour = await promptUser("Please enter colour of paint you would like: ");
        //Get any area the user might not want to paint, for example a door
        let takeAwayShape = 'Circle';
        let takeAwayDimensions = [0];
        let takeAwayBool = await promptUser("You will now be asked for the details of any obstructions in your wall, for example a door, if you have any obstructions please type 1, otherwise press enter: ");
        if (takeAwayBool === '1') {
            takeAwayShape = await getShape('obstruction');
        if (!takeAwayShape) continue;
            shapeInstructions(shape,"obstruction")
            takeAwayDimensions = await getAreas(takeAwayShape);
        }

        walls.push([shape, dimensions, brand, colour, takeAwayShape, takeAwayDimensions]);
    }

    console.log(walls);
    rl.close();
    return walls;
}

async function getQuote() {
    const walls = await userForm();
    for (let wall of walls) {
      const area = calculateArea(wall[0], wall[1]);
      const takeAwayArea = calculateArea(wall[4], wall[5]);
      let cost = calculatePrice(area, wall[2], wall[3]) - calculatePrice(takeAwayArea, wall[2], wall[3]);
      if  (cost < 0){
        console.log("Given obstacle is larger than given area to paint, thus cost will be £0")
        cost = 0
      }
      console.log(`Wall ${wall[0]} will cost £${cost.toFixed(2)}`);
    }
  }

getQuote();

