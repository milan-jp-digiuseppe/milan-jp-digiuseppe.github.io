import Coord from "./coord";
import Path from "./path";

class PuzzleConfig {
  numColumns;
  numRows;
  secretPath; // Path
  startCoord; // Coord
  endCoord; // Coord

  constructor(numColumns, numRows, secretPath) {
    this.numColumns = numColumns;
    this.numRows = numRows;
    this.secretPath = secretPath;
    this.startCoord = secretPath.firstStep();
    this.endCoord = secretPath.lastStep();
  }

  isCoordInBounds(coord) {
    return (
      0 <= coord.column &&
      coord.column < this.numColumns &&
      0 <= coord.row &&
      coord.row < this.numRows
    );
  }

  toString() {
    return `${this.numColumns}x${this.numRows}: ` + this.secretPath.toString();
  }

  serialize() {
    const config = new Array(this.numRows)
      .fill(0)
      .map(() => new Array(this.numColumns).fill(0));
    for (let i = 0; i < this.secretPath.length(); i++) {
      const step = this.secretPath.steps[i];
      console.log(step.toString());
      config[step.row][step.column] = i + 1; // 1-indexed
    }
    return config;
  }

  static deserialize(config) {
    const numRows = config.length;
    if (numRows === 0) {
      console.log("invalid config: no rows");
      return;
    }
    const numColumns = config[0].length;
    if (numColumns === 0) {
      console.log("invalid config: no columns");
      return;
    }

    // Iterate over 2d array to pull out steps
    const indexedSteps = [];
    for (let r = 0; r < config.length; r++) {
      let row = config[r];
      if (row.length !== numColumns) {
        console.log("inconsistent row length");
      }
      for (let c = 0; c < row.length; c++) {
        let cell = row[c];
        if (cell === 0) continue;
        indexedSteps.push({
          coord: new Coord(c, r),
          index: cell,
        });
      }
    }

    const sortedIndexedSteps = indexedSteps.sort((a, b) =>
      a.index < b.index ? -1 : 1
    );
    const secretPath = sortedIndexedSteps.map((is) => is.coord);

    return new PuzzleConfig(numColumns, numRows, new Path(secretPath));
  }
}

export default PuzzleConfig;
