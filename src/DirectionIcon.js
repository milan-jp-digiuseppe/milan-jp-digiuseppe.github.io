import { useMemo } from "react";
import Icon from "./icons";
import { DIRECTION } from "./direction";

const DirectionIcon = ({ direction, inverted, color }) => {
  const degrees = useMemo(() => {
    switch (direction) {
      case DIRECTION.UP:
        return 0;
      case DIRECTION.RIGHT:
        return 90;
      case DIRECTION.DOWN:
        return 180;
      case DIRECTION.LEFT:
        return 270;
      default:
        return 0;
    }
  }, [direction]);

  return (
    <Icon
      name={inverted ? "arrow-inverted" : "arrow"}
      color={color}
      transform={`rotate(${degrees})`}
      size={48}
    />
  );
};

export default DirectionIcon;
