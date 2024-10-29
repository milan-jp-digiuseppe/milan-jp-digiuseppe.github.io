import { DIRECTION } from "./direction";

class Coord {
  constructor(column, row) {
    this.column = column;
    this.row = row;
  }

  static isEqual(a, b) {
    return a.column === b.column && a.row === b.row;
  }

  static isAdjacent(a, b) {
    return Math.abs(a.column - b.column) + Math.abs(a.row - b.row) === 1;
  }

  static relativeDirection(a, b) {
    if (a.column - b.column === -1) {
      return DIRECTION.RIGHT;
    } else if (a.column - b.column === 1) {
      return DIRECTION.LEFT;
    } else if (a.row - b.row === -1) {
      return DIRECTION.DOWN;
    } else if (a.row - b.row === 1) {
      return DIRECTION.UP;
    }
    return null;
  }

  toString() {
    return `[${this.column}, ${this.row}]`;
  }
}

export default Coord;
