import { faCircleArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  currentValue: string | number | null;
  readyToSubmit: boolean;
  onClick?: () => void;
}

export default function ThemeParkContinueButton({
  currentValue,
  readyToSubmit,
  onClick,
}: Props) {
  if (readyToSubmit) {
    return (
      <button type="submit">
        <FontAwesomeIcon
          icon={faCircleArrowRight}
          size="5x"
          fade={Boolean(currentValue)}
          color={currentValue ? "green" : "gray"}
        />
      </button>
    );
  }

  return (
    <FontAwesomeIcon
      icon={faCircleArrowRight}
      size="5x"
      fade={Boolean(currentValue)}
      color={currentValue ? "green" : "gray"}
      onClick={onClick}
    />
  );
}
