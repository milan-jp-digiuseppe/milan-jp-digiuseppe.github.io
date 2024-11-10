import { dailyPuzzles } from "./dailyPuzzles";
import PuzzleBoard from "./PuzzleBoard";
import PuzzleConfig from "./puzzleConfig";

const App = () => {
  const today = new Date();
  const dailyPuzzleIndex = (today.getDay() + 6) % 7;
  const config = PuzzleConfig.deserialize(dailyPuzzles[dailyPuzzleIndex]);

  return <PuzzleBoard config={config} />;
};

export default App;
