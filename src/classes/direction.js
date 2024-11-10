export const DIRECTION = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

export const directionToString = (direction) => {
  if (direction === DIRECTION.UP) {
    return "up";
  } else if (direction === DIRECTION.RIGHT) {
    return "right";
  } else if (direction === DIRECTION.DOWN) {
    return "down";
  } else if (direction === DIRECTION.LEFT) {
    return "left";
  }
  return "unknown direction";
};
