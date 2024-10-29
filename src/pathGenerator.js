import Coord from "./coord";

const getAdjacentCoords = (numColumns, numRows, currCoord) => {
  const adjacentCoords = [];
  const { column: currCol, row: currRow } = currCoord;

  // Left
  if (currCol - 1 >= 0) {
    adjacentCoords.push(new Coord(currCol - 1, currRow));
  }
  // Right
  if (currCol + 1 < numColumns) {
    adjacentCoords.push(new Coord(currCol + 1, currRow));
  }
  // Up
  if (currRow - 1 >= 0) {
    adjacentCoords.push(new Coord(currCol, currRow - 1));
  }
  // Down
  if (currRow + 1 < numRows) {
    adjacentCoords.push(new Coord(currCol, currRow + 1));
  }

  return adjacentCoords;
};

// const shuffleArray = (array) => {
//   for (let i = 0; i < array.length - 2; i++) {
//     const j = Math.random() * (array.length - i) + i;
//     const temp = array[i];
//     array[i] = array[j];
//     array[j] = temp;
//   }
// };

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export const generatePath = (numColumns, numRows, currPath, endCoord) => {
  console.log(
    "currPath",
    currPath.map((coord) => coord.toString())
  );
  const currCoord = currPath[currPath.length - 1];

  const adjacentCoords = getAdjacentCoords(numColumns, numRows, currCoord);
  let potentialNextSteps = adjacentCoords.filter(
    (adj) => !currPath.some((pathCoord) => Coord.isEqual(pathCoord, adj))
  );
  console.log(
    "potentialNextSteps",
    potentialNextSteps.map((coord) => coord.toString())
  );

  // if no next steps
  // - go back a step (check if currPath is empty, in which case no path exists)
  if (adjacentCoords.length === 0) {
    console.log("Path got stuck");
    return null;
  }

  shuffle(potentialNextSteps);
  for (let i = 0; i < potentialNextSteps.length; i++) {
    const nextStep = potentialNextSteps[i];
    console.log("next step", nextStep.toString());

    const updatedPath = [...currPath, nextStep];

    if (Coord.isEqual(nextStep, endCoord)) {
      return updatedPath;
    } else {
      const completedPath = generatePath(
        numColumns,
        numRows,
        updatedPath,
        endCoord
      );
      if (completedPath !== null) {
        return completedPath;
      }
    }
  }

  return null;
};
