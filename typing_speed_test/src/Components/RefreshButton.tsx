import React from "react";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

interface ResreshButtonProps {
  getRandomWords: () => void;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setErrors: React.Dispatch<React.SetStateAction<number>>;
  setRandomWords: React.Dispatch<React.SetStateAction<string[]>>;
  setFinish: React.Dispatch<React.SetStateAction<boolean>>
  inputRef: React.RefObject<HTMLInputElement>;
}

const RefreshButton = ({
  getRandomWords,
  setErrors,
  setSeconds,
  setTyping,
  setValue,
  setRandomWords,
  setFinish,inputRef
}: ResreshButtonProps) => {
  const clickHandler = () => {
    setRandomWords([]);
    setErrors(0);
    setSeconds(0);
    setTyping(false);
    setFinish(false)
    setValue("");
    getRandomWords();
    inputRef?.current?.focus()
  };

  return (
    <button className="refresh-button" onClick={clickHandler}>
      <RefreshRoundedIcon />
    </button>
  );
};

export default RefreshButton;
