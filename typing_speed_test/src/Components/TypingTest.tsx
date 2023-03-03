import { useState, useEffect, useRef } from "react";
import { words } from "../data/words";
import uuid from "react-uuid";

const TypingTest = () => {
  const WORDS_LIMIT = 30;

  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [seconds, setSeconds] = useState<number>(0);

  const [finish, setFinish] = useState<boolean>(false);
  const [typing, setTyping] = useState<boolean>(false);

  const [errors, setErrors] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const textFieldRef = useRef<HTMLDivElement>(null);
  const typedTextRef = useRef<HTMLParagraphElement>(null);
  const [scroll, setScroll] = useState<number>(10);

  const textContainer = textFieldRef?.current ?? undefined;

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
      textContainer?.scrollTo(scroll, 0);
      console.log(textContainer!.scrollLeft);
      setValue(event.target.value);
      setScroll((prev) => prev + 10);

      if (event.target.value.length === randomWords.join("").length) {
        setFinish(true);
      }
      if (!typing) {
        setTyping(true);
      }
    } else if (typing) {
      setTyping(false);
    } else {
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
      <div className="text-field" ref={textFieldRef}>
        <p className="words">{randomWords.map((el: string) => el + " ")}</p>
        <p className="typed-text" ref={typedTextRef}>
          {value.split("").map((el) => (
            <span key={uuid()} className={`letter`}>
              {el}
            </span>
          ))}
        </p>
        <input ref={inputRef} className="typing-area" value={value} onChange={handleChange} />
      </div>
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
    </div>
  );
};

export default TypingTest;
