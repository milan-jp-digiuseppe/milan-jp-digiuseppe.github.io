import { directionToString } from "./direction";

const GuessRow = ({ guessedPath, secretPath, isCurrentGuess }) => {
  const secretPathDirectionList = secretPath.toDirectionList();

  return (
    <tr>
      {guessedPath.toDirectionList().map((dir, index) => {
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
  return (
    <table>
      {guessedPaths.map((guessedPath) => (
        <GuessRow guessedPath={guessedPath} secretPath={secretPath} />
      ))}
      <GuessRow
        guessedPath={currGuess}
        secretPath={secretPath}
        isCurrentGuess={true}
      />
    </table>
  );
};

export default GuessTable;
