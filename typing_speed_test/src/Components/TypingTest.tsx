import { useState, useEffect, useRef } from "react";
import { words } from "../data/words";
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
          <p className="timer">
            Time: {seconds} <br /> Errors: {errors}
          </p>
        )}
      </div>
      <div
        className="text-field"
        onClick={() => {
          inputRef?.current?.focus();
        }}
      >
        <p className="words">{randomWords.map((el: string) => el + " ")}</p>
        <p className="typed-text">
          {value.split("").map((el) => (
            <span key={uuid()} className={`letter`}>
              {el}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default TypingTest;
