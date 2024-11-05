import { directionToString } from "./direction";
import { coordPathToDirectionList } from "./path";

const GuessRow = ({ guessedPath, secretPathDirectionList, isCurrentGuess }) => {
  const dirList = coordPathToDirectionList(guessedPath);
  return (
    <tr>
      {dirList.map((dir, index) => {
        const isCorrect = dir === secretPathDirectionList[index];
        return (
          <td
            style={
              isCurrentGuess
                ? {
                    //
                  }
                : {
                    backgroundColor: isCorrect ? "green" : "transparent",
                  }
            }
          >
            {directionToString(dir)}
          </td>
        );
      })}
    </tr>
  );
};

const GuessTable = ({ secretPath, guessedPaths, currGuess }) => {
  const secretPathDirectionList = coordPathToDirectionList(secretPath);

  return (
    <table>
      {guessedPaths.map((guessedPath) => (
        <GuessRow
          guessedPath={guessedPath}
          secretPathDirectionList={secretPathDirectionList}
        />
      ))}
      <GuessRow
        guessedPath={currGuess}
        secretPathDirectionList={secretPathDirectionList}
        isCurrentGuess={true}
      />
    </table>
  );
};

export default GuessTable;
