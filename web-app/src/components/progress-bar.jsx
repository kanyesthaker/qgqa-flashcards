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
import styled, { css } from "styled-components";
import Lottie, { useLottie } from "lottie-react";
import myAnimation from "../my_lottie.json";

const ProgressContainer = styled.div`
  border-radius: 6px;
  border-width: 1px;

  text-align: left;
  box-shadow: 0 7px 50px rgb(46 10 99 / 5%), 0 1px 1px 0.6px rgb(46 10 99 / 10%);

  background-color: white;
`;

const style = {
  height: 30,
};
const Animation = () => {
  const options = {
    animationData: myAnimation,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options, style);
  return View;
};

function MyProgressBar(props) {
  const [percentage, setPercentage] = useState(5);

  useEffect(
    () => {
      let timer = 0;
      if (percentage <= 90) {
        const easingFactor = Math.random() * 5 + 7;
        timer = setTimeout(
          () => setPercentage((p) => p + Math.floor(easingFactor)),
          1000
        );
      }
      // Clears Timeout when component unmounts
      return () => {
        clearTimeout(timer);
      };
    },
    /**  
     useEffect will run only one time with empty []
     Otherwise with value, clearTimeout will run every time
     this value changes (useEffect re-run)
    */
    [percentage]
  );

  return (
    <ProgressContainer>
      <ProgressBar now={percentage} animated />
      <div className="Model-container">
        <Animation></Animation>
        <div className="Progress-text"> Loading Model </div>
      </div>
    </ProgressContainer>
  );
}

export default MyProgressBar;
