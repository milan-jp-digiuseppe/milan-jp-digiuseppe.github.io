import Coord from "./coord";

export const coordPathToDirectionList = (path) => {
  const directionList = [];
  for (let c = 1; c < path.length; c++) {
    const direction = Coord.relativeDirection(path[c - 1], path[c]);
    directionList.push(direction);
  }
  return directionList;
};

export const pathsAreEqual = (p, q) => {
  if (p.length !== q.length) {
    return false;
  }
  for (let c = 0; c < p.length; c++) {
    if (!Coord.isEqual(p[c], q[c])) {
      return false;
    }
  }
  return true;
};
