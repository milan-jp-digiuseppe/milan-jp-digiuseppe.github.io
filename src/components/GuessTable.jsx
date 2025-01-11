import DirectionIcon from "./DirectionIcon";

const GuessRow = ({ guessIndex, guessedPath, secretPath, isCurrentGuess }) => {
  const secretPathDirectionList = secretPath.toDirectionList();

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {guessedPath.length() > 1 && <h2>{guessIndex + 1}</h2>}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {guessedPath.toDirectionList().map((dir, index) => {
          const isCorrect = dir === secretPathDirectionList[index];
          return (
            <div key={index}>
              {isCurrentGuess ? (
                <DirectionIcon color={"black"} direction={dir} />
              ) : (
                <DirectionIcon
                  inverted={isCorrect}
                  color={isCorrect ? "green" : "black"}
                  direction={dir}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const GuessTable = ({ secretPath, guessedPaths, currGuess, style }) => {
  return (
    <div style={style}>
      <h2 style={{ textAlign: "center" }}>Guesses</h2>
      {guessedPaths.map((guessedPath, index) => (
        <GuessRow
          key={index}
          guessIndex={index}
          guessedPath={guessedPath}
          secretPath={secretPath}
        />
      ))}
      {!!currGuess && (
        <GuessRow
          guessIndex={guessedPaths.length}
          guessedPath={currGuess}
          secretPath={secretPath}
          isCurrentGuess={true}
        />
      )}
    </div>
  );
};

export default GuessTable;
