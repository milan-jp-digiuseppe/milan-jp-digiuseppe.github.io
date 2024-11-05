import { useCallback, useEffect, useRef, useState } from "react";
import Coord from "./coord";
import GuessTable from "./GuessTable";
import { pathsAreEqual } from "./path";
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
      CELL_SIZE / 6
    );

    // End circle
    drawCircle(
      ctx,
      endCoord.column * CELL_SIZE + CELL_SIZE / 2,
      endCoord.row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 6
    );

    // Path
    drawPath(ctx, selectedPath);
    // drawPath(ctx, secretPath);

    ctx.font = "50px Arial";
    const grad = ctx.createLinearGradient(0, 0, 280, 0);
    grad.addColorStop(0, "lightblue");
    grad.addColorStop(1, "darkblue");
    ctx.fillStyle = grad;

    ctx.fillText(
      "Start",
      startCoord.column * CELL_SIZE,
      (startCoord.row + 1) * CELL_SIZE
    );
    ctx.fillText(
      "End",
      endCoord.column * CELL_SIZE,
      (endCoord.row + 1) * CELL_SIZE
    );
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
      <GuessTable
        secretPath={secretPath}
        guessedPaths={guessedPaths}
        currGuess={selectedPath}
      />
      {!!win && <h1>You guessed the path in {guessedPaths.length} tries</h1>}
    </div>
  );
}

export default App;
