import { useState, useEffect, useRef } from "react";
import { words } from "../data/Words";
import uuid from "react-uuid";
import RefreshButton from "./RefreshButton";

const TypingTest = () => {
  const WORDS_LIMIT = 60;

  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [seconds, setSeconds] = useState<number>(0);
  const [typedText, setTypedText] = useState("");

  const [finish, setFinish] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const [errors, setErrors] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const getRandomWords = () => {
    for (let i = 0; i < WORDS_LIMIT; i++) {
      const index = Math.floor(Math.random() * words.length);
      setRandomWords((prev) => [...prev, words[index]]);
      if (i !== WORDS_LIMIT - 1) {
        setRandomWords((prev) => [...prev, " "]);
      }
    }
  };

  useEffect(() => {
    getRandomWords();
    inputRef?.current?.focus();
  }, []);

  useEffect(() => {
    let timer: any;

    if (typing && !finish) {
      timer = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [typing, finish]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const lastLetterInArray: string = randomWords
      .join("")
      .split("")
      .slice(event.target.value.length - 1, event.target.value.length)
      .join("");

    const lastTypedLetter = event.target.value.split("").at(-1);

    if (lastLetterInArray === lastTypedLetter) {
      setValue(event.target.value);
      if (event.target.value.length === randomWords.join("").length) {
        setFinish(true);
      }
      if (!typing) {
        setTyping(true);
      }
    } else if (typing) {
      setTyping(false);
    }
    if (lastLetterInArray !== lastTypedLetter) {
      setValue(event.target.value);
      setErrors((prev) => prev + 1);
    }
  };

  const calculateTypingSpeed = (): number => {
    const wordsTyped = value.trim().split(/\s+/).length;
    const typingSpeed = Math.round((wordsTyped / seconds) * 60);
    return typingSpeed;
  };

  const calculateAccuracy = (): number => {
    const correctLetters = value.length - errors;
    const accuracy = Math.round((correctLetters * 100) / value.length);
    return accuracy;
  };

  const renderWords = () => {
    let inputIndex = 0;
    return randomWords
      .join("")
      .split("")
      .map((letter, letterIndex) => {
        let style: any = { color: "#808080" };
        if (value[inputIndex]) {
          if (letter === value[inputIndex]) {
            style.backgroundColor = "rgb(15, 85, 15)";
            style.color = "#e5e5e5";
          } else {
            style.backgroundColor = "rgb(119, 23, 23)";
            style.color = "#e5e5e5";
          }
          inputIndex++;
        }
        return (
          <span key={letterIndex} style={style}>
            {letter}
          </span>
        );
      });
  };

  return (
    <div className="container">
      <input ref={inputRef} className="typing-area" value={value} onChange={handleChange} />
      <RefreshButton
        getRandomWords={getRandomWords}
        setErrors={setErrors}
        setSeconds={setSeconds}
        setTyping={setTyping}
        setValue={setValue}
        setRandomWords={setRandomWords}
        setFinish={setFinish}
        inputRef={inputRef}
      />
      <div className="timer-container">
        {finish ? (
          <p className="timer">
            Finished in {seconds} seconds {calculateTypingSpeed()} WPM <br />
            Accuracy :{calculateAccuracy()} %
          </p>
        ) : (
          <p className="timer">Time: {seconds}</p>
        )}
      </div>
      <div
        className="text-field"
        onClick={() => {
          inputRef?.current?.focus();
        }}
      >
        <p className="words">{renderWords()}</p>
      </div>
    </div>
  );
};

export default TypingTest;
