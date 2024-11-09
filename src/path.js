import Coord from "./coord";

class Path {
  steps; // Coord[]

  constructor(steps) {
    this.steps = steps;
  }

  static isEqual(p, q) {
    if (p.length() !== q.length()) {
      return false;
    }
    for (let s = 0; s < p.length(); s++) {
      if (!Coord.isEqual(p.steps[s], q.steps[s])) {
        return false;
      }
    }
    return true;
  }

  length() {
    return this.steps.length;
  }

  firstStep() {
    return this.steps[0];
  }

  lastStep() {
    return this.steps[this.length() - 1];
  }

  findStep(step) {
    return this.steps.findIndex((s) => Coord.isEqual(s, step));
  }

  toDirectionList() {
    const directionList = [];
    for (let s = 1; s < this.steps.length; s++) {
      const direction = Coord.relativeDirection(
        this.steps[s - 1],
        this.steps[s]
      );
      directionList.push(direction);
    }
    return directionList;
  }

  toString() {
    return this.steps.map((s) => s.toString()).join(" ");
  }
}

export default Path;
