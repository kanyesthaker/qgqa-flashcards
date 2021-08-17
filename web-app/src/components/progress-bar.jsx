import React, {
  Component,
  useState,
  useEffect,
  useReducer,
  useCallback,
  Fragment,
} from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import "./progress-bar.css";

function MyProgressBar(props) {
  const [percentage, setPercentage] = useState(5);
  function handlePercentage() {
    setPercentage(percentage + 10);
    return percentage;
  }

  useEffect(
    () => {
      let timer = 0;
      if (percentage <= 90) {
        timer = setTimeout(
          () =>
            //Clean this up
            setPercentage((p) => p + Math.floor(Math.random() * (12 - 7) + 7)),
          1000
        );
      }
      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        clearTimeout(timer);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    [percentage]
  );

  return <ProgressBar now={percentage} animated />;
}

export default MyProgressBar;
