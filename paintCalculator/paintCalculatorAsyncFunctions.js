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
            shapeInstructions(shape,"obstruction")
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

async function getQuote() {
    const walls = await userForm();
    for (let wall of walls) {
      const area = wall[0].area
      const takeAwayArea = wall[1].area
      let cost = calculatePrice(area, wall[2], wall[3]) - calculatePrice(takeAwayArea, wall[2], wall[3]);
      if  (cost < 0){
        console.log("Given obstacle is larger than given area to paint, thus cost will be £0")
        cost = 0
      }
      console.log(`Wall ${wall[0]} will cost £${cost.toFixed(2)}`);
    }
  }
