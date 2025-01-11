import { useCallback, useEffect, useRef, useState } from "react";
import Coord from "../classes/coord";
import GuessTable from "./GuessTable";
import Path from "../classes/path";
import { useMeasure } from "@uidotdev/usehooks";

const drawCircle = (ctx, x, y, rad) => {
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2, true);
  ctx.stroke();
};

const PuzzleBoard = ({
  config, // PuzzleConfig
}) => {
  const { numColumns, numRows, startCoord, endCoord, secretPath } = config;

  const [ref, { width: containerWidth }] = useMeasure();
  console.log({ containerWidth });
  // const CELL_SIZE = containerWidth / numColumns;
  const CELL_SIZE = 100;

  const CANVAS_WIDTH = numColumns * CELL_SIZE;
  const CANVAS_HEIGHT = numRows * CELL_SIZE;

  const canvasRef = useRef(null);
  const [selectedPath, setSelectedPath] = useState(new Path([startCoord]));
  const selectedCoord = selectedPath.lastStep();
  const [guessedPaths, setGuessedPaths] = useState([]);
  const [win, setWin] = useState(false);

  const onSelectNextStep = useCallback(
    (nextStep) => {
      const foundStepIndex = selectedPath.findStep(nextStep);
      if (foundStepIndex !== -1) {
        setSelectedPath(
          (currPath) => new Path(currPath.steps.slice(0, foundStepIndex + 1))
        );
        return;
      }

      const lastStep = selectedPath.lastStep();
      if (!Coord.isAdjacent(nextStep, lastStep)) {
        return;
      }

      const updatedPath = new Path([...selectedPath.steps, nextStep]);
      setSelectedPath(updatedPath);

      if (Coord.isEqual(nextStep, endCoord)) {
        setGuessedPaths((curr) => [...curr, updatedPath]);

        if (Path.isEqual(updatedPath, secretPath)) {
          setWin(true);
        } else {
          setSelectedPath(new Path([startCoord]));
        }
      }
    },
    [endCoord, secretPath, selectedPath, startCoord]
  );

  const onKeyPress = useCallback(
    (e) => {
      let nextCoord;
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          nextCoord = selectedCoord.above();
          break;
        case "KeyA":
        case "ArrowLeft":
          nextCoord = selectedCoord.left();
          break;
        case "KeyS":
        case "ArrowDown":
          nextCoord = selectedCoord.below();
          break;
        case "KeyD":
        case "ArrowRight":
          nextCoord = selectedCoord.right();
          break;
        default:
          return;
      }
      if (config.isCoordInBounds(nextCoord)) {
        onSelectNextStep(nextCoord);
      }
    },
    [config, onSelectNextStep, selectedCoord]
  );
  useEffect(() => {
    document.addEventListener("keyup", onKeyPress);
    return () => document.removeEventListener("keyup", onKeyPress);
  }, [onKeyPress]);

  const onClickCanvas = useCallback(
    (event) => {
      const x = event.offsetX;
      const y = event.offsetY;
      const col = Math.floor(x / CELL_SIZE);
      const row = Math.floor(y / CELL_SIZE);

      onSelectNextStep(new Coord(col, row));
    },
    [onSelectNextStep]
  );
  useEffect(() => {
    canvasRef.current.addEventListener("click", onClickCanvas);
    const canvesRefInternal = canvasRef.current;
    return () => canvesRefInternal.removeEventListener("click", onClickCanvas);
  }, [onClickCanvas]);

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

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Clear canvas before drawing

    ctx.fillStyle = "green";
    // Secret path
    if (win) {
      for (let coord of secretPath.steps) {
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
      selectedCoord.column * CELL_SIZE,
      selectedCoord.row * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    // Grid
    for (let col = 0; col < numColumns; col++) {
      for (let row = 0; row < numRows; row++) {
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
    drawPath(ctx, selectedPath.steps);
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
  }, [
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    canvasRef,
    drawPath,
    endCoord.column,
    endCoord.row,
    numColumns,
    numRows,
    secretPath,
    selectedCoord,
    selectedPath,
    startCoord.column,
    startCoord.row,
    win,
  ]);

  return (
    <>
      <div
        ref={ref}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 48,
          width: "100%",
          margin: 48,
        }}
      >
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        <GuessTable
          secretPath={secretPath}
          guessedPaths={guessedPaths}
          currGuess={win ? null : selectedPath}
          style={{ flexGrow: 1 }}
        />
      </div>
      {!!win && <h1>You guessed the path in {guessedPaths.length} tries</h1>}
    </>
  );
};

export default PuzzleBoard;
