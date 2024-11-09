import { dailyPuzzles } from "./dailyPuzzles";
import PuzzleBoard from "./PuzzleBoard";
import PuzzleConfig from "./puzzleConfig";

const App = () => {
  const config = PuzzleConfig.deserialize(dailyPuzzles[1]);
  console.log(config.toString());

  return (
    <PuzzleBoard
      numColumns={config.numColumns}
      numRows={config.numRows}
      startCoord={config.startCoord}
      endCoord={config.endCoord}
      secretPath={config.secretPath}
    />
  );
};

export default App;
