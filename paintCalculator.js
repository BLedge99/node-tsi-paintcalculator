//Class for an area, calculates area of area based on it's shape and dimensions
class Area {
    constructor(shape, dimensions) {
      this.shape = shape;
      this.dimensions = dimensions;
      this.area = this.calculateArea();
    }

    calculateArea() {
      if (this.shape === 'Rectangle') {
        return this.dimensions[0] * this.dimensions[1];
      } 
      else if (this.shape === 'Triangle') {
        const [a, b, c] = this.dimensions;
        const s = (a + b + c) / 2;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
      } 
      else if (this.shape === 'Circle') {
        return (this.dimensions[0] / 2) ** 2 * Math.PI;
      }
    }

    getDetails(){
        return `with Shape: ${this.shape}  and Dimensions: ${this.dimensions}`;
    }
  }

//Class for catalogue with methods for updating, setting and getting, catalogue stored as a dict of dicts of arrays in the format brand: paint: [[can size, cost/l],...]
class Catalogue{
    constructor(){

        this.catalogue = {
            'Dulux': {
                "Matt White": [[10, 24.00], [5, 18.00], [2.5, 16.00]],
                "Pure Brilliant White Silk Emulsion": [[10, 24.00], [5, 18.00], [2.5, 16.00]],
                "Matt Standard Emerald Glade": [[10, 24.00], [5, 18.00], [2.5, 15.00]],
                "Matt Easycare Willow Emulsion": [[2.5, 28.00], [0.03, 2.45]],
                "Kiwi Crush Silk": [[2.5, 22.00]],
            },
            'Zinsser': {
                "Matt White Anti Mold": [[1, 21.00]],
                "Perma White Satin Anti Mold": [[2.5, 42.00], [1, 21.00]],
                "Black Multi Surface AllCoat": [[1, 28.00]],
            },
            'Berger': {
                "Silk Emulsion Lemon Glow": [[2.5, 21.00]],
                "Navy Blue Non-Drip": [[0.75, 16.65]],
                "Quick Dry Matt White": [[10, 40.00], [5, 22.50], [3, 18.90], [1, 12.20]],
                "Gloss Non-Drip Russian Red": [[0.75, 16.65]],
                "Satin Magnolla": [[0.75, 21.00]]
            }
        };
    }

    setCatalogue(catalogue){
        this.catalogue = catalogue;
    }

    addendCatalogue(catalogue){
        this.catalogue = { ...this.catalogue, ...catalogue};
    }

    updateCatalogue(catalogue){

    }

    getCatalogue(){
        for (const key in this.catalogue) {
            console.log(key, Object.keys(this.catalogue[key]));
        }
    }
}

//Setup readline for reading cmd input and writing to console
const readline = require('node:readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const sides = { 'Rectangle': 2, 'Circle': 1, 'Triangle': 3 };
const shapes = ['Rectangle', 'Triangle', 'Circle'];

//Function to allow readline module to act similarly to let var = prompt() syntax, takes string as arg to feed to realine module and returns value read by readline question. 
function promptUser(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
        resolve(answer);
        });
    });
}
//Function takes an area, brand and colour and returns total cost of covering that area in that paint
function calculatePrice(area, brand, colour) {//update
    let catalogue = new Catalogue();
    return area * catalogue.catalogue[brand][colour];
}
//Function to give user dynamic prompt based on the shape of their given area
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


//Recursive generator function to find cost of all can combos 
function* findcombos(sizes, costs, cost, target, current, index) {
    //yield current cost if target reached
    if (current >= target) {
        yield cost;
        return;
    }

    //if no more can sizes stop recursion
    if (index >= sizes.length) {
        return;
    }

    //continue adding current can size
    yield* findcombos(sizes, costs, cost + costs[index], target, current + sizes[index], index);

    //move onto next can size
    yield* findcombos(sizes, costs, cost, target, current, index + 1);
}

//Function to get users desired shape and ensure it is a valid input
async function getShape(area) {
    let shape = await promptUser(`Please enter shape of ${area} (Rectangle, Triangle, Circle): `);
    if (!shapes.includes(shape)) {
        console.log("Please ensure you enter Rectangle, Triangle, or Circle, checking for capitalization.");
        console.log("Unfortunately, other shapes are not available at this time.");
        return null;
    }
    return shape;
}
//Function to get all nececarry dimensions of the given shape
async function getAreas(shape) {
    let dimensions = [];
    for (let side = 0; side < sides[shape]; side++) {
        dimensions.push(parseFloat(await promptUser(`Please enter side ${side + 1}: `)));
    }
    return dimensions;
}
//Function to handle getting info about users walls
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
        shapeInstructions(shape,"wall");
        let dimensions = await getAreas(shape);
        //Get brand and colour preferences
        const viewCatalogue = await promptUser("You will now be asked for your paint preferences, if you need to view the paint catalogue please type 1, otherwise press enter: ");
        if (viewCatalogue === '1') {
            catalogue = new Catalogue();
            catalogue.getCatalogue();
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
            shapeInstructions(takeAwayShape,"obstruction");
            takeAwayDimensions = await getAreas(takeAwayShape);
        }

        let toPaint = new Area(shape,dimensions);
        let toTakeAway = new Area(takeAwayShape,takeAwayDimensions);
        walls.push([toPaint, toTakeAway, brand, colour]);
    }

    console.log(walls);
    rl.close();
    return walls;
}
//Function to calculate cost of paint job given info on users walls
async function getQuote() {
    const walls = await userForm();
    for (let wall of walls) {
      const area = wall[0].area;
      const takeAwayArea = wall[1].area;
      let cost = calculatePrice(area, wall[2], wall[3]) - calculatePrice(takeAwayArea, wall[2], wall[3]);
      if  (cost < 0){
        console.log("Given obstacle is larger than given area to paint, thus cost will be £0");
        cost = 0;
      }
      console.log(`Wall ${wall[0].getDetails()} will cost £${cost.toFixed(2)}`);
    }
  }

  

async function getQuote2() {
    const walls = await userForm();
    for (let wall of walls){
        let area = wall[0].area - wall[1].area;
        let brand = wall[2];
        let colour = wall[3];
        getCheapCanCombo(area, brand, colour);
    }
  }


function getCheapCanCombo(area, brand, colour){

    const coverage = 10; // 10 square meters per liter of paint as per bnq paint calculator
    paintNeeded = area/coverage;

    catalogue = new Catalogue();
    catalogue = catalogue.catalogue;
    
    cans = catalogue[brand][colour];
    let costlist = [];
    let sizelist = [];
    for (can of cans) {
        costlist.push(can[1]);
        sizelist.push(can[0]);
    }

    const results = Array.from(findcombos(sizelist, costlist, 0, paintNeeded, 0, 0));
    if (results.length > 0) {
        const minCost = Math.min(...results);
        console.log(`Minimum cost to paint your wall: £${minCost}`);
    } else {
        console.log("Sorry an error occured, we were unable to find the cost to paint your wall.");
    }

}

getQuote2();
