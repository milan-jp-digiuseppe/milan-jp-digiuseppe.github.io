import DirectionIcon from "./DirectionIcon";

const GuessRow = ({ guessedPath, secretPath, isCurrentGuess }) => {
  const secretPathDirectionList = secretPath.toDirectionList();

  return (
    <tr>
      {guessedPath.toDirectionList().map((dir, index) => {
        const isCorrect = dir === secretPathDirectionList[index];
        return (
          <td key={index}>
            {isCurrentGuess ? (
              <DirectionIcon color={"black"} direction={dir} />
            ) : (
              <DirectionIcon
                inverted={isCorrect}
                color={isCorrect ? "green" : "black"}
                direction={dir}
              />
            )}
          </td>
        );
      })}
    </tr>
  );
};

const GuessTable = ({ secretPath, guessedPaths, currGuess }) => {
  return (
    <table>
      <tbody>
        {guessedPaths.map((guessedPath, index) => (
          <GuessRow
            key={index}
            guessedPath={guessedPath}
            secretPath={secretPath}
          />
        ))}
        <GuessRow
          guessedPath={currGuess}
          secretPath={secretPath}
          isCurrentGuess={true}
        />
      </tbody>
    </table>
  );
};

export default GuessTable;
