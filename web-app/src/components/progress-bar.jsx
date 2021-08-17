import React, {
  Component,
  useState,
  useEffect,
  useReducer,
  useCallback,
  Fragment,
} from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./progress-bar.css";
import styled, { css } from "styled-components";
import Lottie, { useLottie } from "lottie-react";
import myAnimation from "../my_lottie.json";

// const styles = {
//   ProgressBar: {
//     marginTop: "10vh",
//     marginBottom: "10vh",
//     marginRight: "10vw",
//     marginLeft: "10vw",
//   },
// };

const ProgressContainer = styled.div`
  border-radius: 6px;
  border-width: 1px;

  text-align: left;
  box-shadow: 0 7px 50px rgb(46 10 99 / 5%), 0 1px 1px 0.6px rgb(46 10 99 / 10%);

  background-color: white;
  // margin-left: auto;
  // margin-right: auto;
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

// function MyProgressBar(props) {
//   const [percentage, setPercentage] = useState(5);
//   let progressInterval = null;

//   useEffect(() => {
//     progressInterval = setInterval(() => {
//       setPercentage((p) => p + Math.floor(Math.random() * (12 - 7) + 7));
//     }, 1000);
//   }, []);

//   useEffect(() => {
//     if (percentage >= 90) {
//       clearInterval(progressInterval);
//     }
//   }, [percentage]);

//   //   useEffect(
//   //     () => {
//   //       let timer = 0;
//   //       if (percentage <= 90) {
//   //         timer = setTimeout(
//   //           () =>
//   //             //Clean this up
//   //             setPercentage((p) => p + Math.floor(Math.random() * (12 - 7) + 7)),
//   //           1000
//   //         );
//   //       }
//   //       // this will clear Timeout
//   //       // when component unmount like in willComponentUnmount
//   //       // and show will not change to true
//   //       return () => {
//   //         clearTimeout(timer);
//   //       };
//   //     },
//   //     // useEffect will run only one time with empty []
//   //     // if you pass a value to array,
//   //     // like this - [data]
//   //     // than clearTimeout will run every time
//   //     // this value changes (useEffect re-run)
//   //     [percentage]
//   //   );

//   return (
//     <div className={"progressComp"}>
//       <div className="progress-div" style={{ width: 100 }}>
//         <div style={{ width: `${percentage}px` }} className="progress" />
//       </div>
//     </div>
//   );
// }

// export default MyProgressBar;
