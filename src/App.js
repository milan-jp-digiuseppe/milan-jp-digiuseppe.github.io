import { useCallback, useEffect, useRef, useState } from "react";
import Coord from "./coord";
import { directionToString } from "./direction";
import { generatePath } from "./pathGenerator";

const CELL_SIZE = 100;
const ROWS = 5;
const COLUMNS = 5;

const CANVAS_WIDTH = COLUMNS * CELL_SIZE;
const CANVAS_HEIGHT = ROWS * CELL_SIZE;

const drawCircle = (ctx, x, y, rad) => {
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2, true);
  ctx.stroke();
};

const coordToPosition = (coord) => {
  return [
    coord.column * CELL_SIZE + CELL_SIZE / 2,
    coord.row * CELL_SIZE + CELL_SIZE / 2,
  ];
};

const coordPathToDirectionList = (path) => {
  const directionList = [];
  for (let c = 1; c < path.length; c++) {
    const direction = Coord.relativeDirection(path[c - 1], path[c]);
    directionList.push(direction);
  }
  return directionList;
};

const pathsAreEqual = (p, q) => {
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

const drawPath = (ctx, coords) => {
  if (coords.length === 0) {
    return;
  }
  ctx.beginPath();
  ctx.moveTo(...coordToPosition(coords[0]));
  for (let c = 1; c < coords.length; c++)
    ctx.lineTo(...coordToPosition(coords[c]));
  ctx.stroke();
};

const startCoord = new Coord(0, 0);
const endCoord = new Coord(3, 3);
// const secretPath = [
//   startCoord,
//   new Coord(0, 1),
//   new Coord(0, 2),
//   new Coord(1, 2),
//   new Coord(2, 2),
//   new Coord(3, 2),
//   endCoord,
// ];

const secretPath = generatePath(COLUMNS, ROWS, [startCoord], endCoord);
const secretPathDirectionList = coordPathToDirectionList(secretPath);

function App() {
  const canvasRef = useRef(null);
  const [selectedCell, setSelectedCell] = useState(startCoord);
  const [selectedPath, setSelectedPath] = useState([startCoord]);
  const [guessedPaths, setGuessedPaths] = useState([]);
  const [win, setWin] = useState(false);

  const onClickCanvas = useCallback(
    (event) => {
      const x = event.pageX;
      const y = event.pageY;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);

      const selectedCoord = new Coord(col, row);

      const matchedCoordIndex = selectedPath.findIndex((coord) =>
        Coord.isEqual(coord, selectedCoord)
      );
      if (matchedCoordIndex !== -1) {
        console.warn("coord exists in path");
        setSelectedCell([col, row]);
        setSelectedPath((currPath) => currPath.slice(0, matchedCoordIndex + 1));
        return;
      }

      const lastCoordInPath = selectedPath[selectedPath.length - 1];
      if (!Coord.isAdjacent(selectedCoord, lastCoordInPath)) {
        console.warn("coords are not adjacent", lastCoordInPath, selectedCoord);
        return;
      }

      setSelectedCell(new Coord(col, row));
      const updatedPath = [...selectedPath, selectedCoord];
      setSelectedPath(updatedPath);

      if (Coord.isEqual(selectedCoord, endCoord)) {
        setGuessedPaths((curr) => [...curr, updatedPath]);

        if (pathsAreEqual(updatedPath, secretPath)) {
          setWin(true);
        } else {
          setSelectedPath([startCoord]);
          setSelectedCell(startCoord);
        }
      }
    },
    [selectedPath]
  );

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear canvas before drawing

    ctx.fillStyle = "green";
    // Secret path
    if (win) {
      for (let coord of secretPath) {
        console.log(coord);
        ctx.fillRect(
          coord.column * CELL_SIZE,
          coord.row * CELL_SIZE,
          CELL_SIZE,
          CELL_SIZE
        );
      }
    }
    // Selected
    ctx.fillRect(
      selectedCell.column * CELL_SIZE,
      selectedCell.row * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    // Grid
    for (let col = 0; col < COLUMNS; col++) {
      for (let row = 0; row < ROWS; row++) {
        ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }

    // Start circle
    drawCircle(
      ctx,
      startCoord.column * CELL_SIZE + CELL_SIZE / 2,
      startCoord.row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    // End circle
    drawCircle(
      ctx,
      endCoord.column * CELL_SIZE + CELL_SIZE / 2,
      endCoord.row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );

    // Path
    drawPath(ctx, selectedPath);
    // drawPath(ctx, secretPath);
  }, [canvasRef, selectedCell, selectedPath, win]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onClick={onClickCanvas}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "4px solid pink" }}
      />
      <ol>
        {guessedPaths.map((guessedPath) => {
          const dirList = coordPathToDirectionList(guessedPath);
          return (
            <li style={{ flexDirection: "row" }}>
              {dirList.map((dir, index) => {
                const isCorrect = dir === secretPathDirectionList[index];
                return (
                  <span
                    style={{
                      marginRight: "8px",
                      backgroundColor: isCorrect ? "green" : "transparent",
                    }}
                  >
                    {directionToString(dir)}
                  </span>
                );
              })}
            </li>
          );
        })}
      </ol>
      {!!win && <h1>You guessed the path in {guessedPaths.length} tries</h1>}
    </div>
  );
}

export default App;
