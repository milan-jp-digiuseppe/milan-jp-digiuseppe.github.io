import { dailyPuzzles } from "./dailyPuzzles";
import PuzzleBoard from "./PuzzleBoard";
import PuzzleConfig from "./puzzleConfig";

const App = () => {
  const today = new Date();
  const dailyPuzzleIndex = (today.getDay() + 6) % 7;
  const config = PuzzleConfig.deserialize(dailyPuzzles[dailyPuzzleIndex]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <h1>Minos</h1>
      <p>
        Draw a path from <strong>Start</strong> to <strong>End</strong> by
        moving up, down, left, and right between cells. Once you complete the
        path, you'll see which steps you've taken in the right direction. Find
        the secret path in the fewest steps you can!
      </p>
      <PuzzleBoard config={config} />
    </div>
  );
};

export default App;
