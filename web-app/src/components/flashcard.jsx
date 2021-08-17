import React, {
  Component,
  useState,
  useEffect,
  useReducer,
  useCallback,
  Fragment,
} from "react";
import "./flashcard.css";
import Check from "../icons/checkmark-sharp.svg";
import Reload from "../icons/reload-sharp.svg";
import styled, { css } from "styled-components";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import MyProgressBar from "./progress-bar";
// import ProgressBar from "react-bootstrap/ProgressBar";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 * Toggles opacity of hidden answer, implemented this SO post
 * https://stackoverflow.com/questions/68192257/react-how-to-change-opacity-of-element-by-clicking-button
 */

//This should trigger moving to the next flashcard
const FlashcardAnswerContainer = styled.div`
  border-top: 1px solid #f5f5f5;
  background-color: #fcfaff;
  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;

const FlashcardAnswer = styled.div`
  padding-left: 4%;
  padding-right: 4%;
  padding-top: 24px;
  padding-bottom: 16px;
  font-size: 14px;

  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;

const FlashcardAnswerHidden = styled.div`
  padding-top: 36px;
  padding-bottom: 36px;
  border-top: 1px solid #f5f5f5;
  background-color: #fcfaff;
  cursor: pointer;
  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
  display: ${(props) => props.display};
`;

//Using percents are preventing onClick here
const ReportAnswer = styled.div`
  font-family: "Chart";
  padding-left: 4%;
  padding-right: 4%;
  font-size: 10px;
  color: #6f6f6f;
  padding-top: 8px;
  padding-bottom: 16px;
  cursor: pointer;
  display: inline-block;

  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;

const ReportedAnswer = styled.div`
  font-family: "Chart";
  padding-left: 4%;
  padding-right: 4%;
  padding-bottom: 4%;
  padding-top: 8px;
  font-size: 10px;
  color: #6f6f6f;
  display: inline-block;

  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;
const FlashcardButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
  display: ${(props) => props.display};
`;

const FlashcardButtonContainer = styled.div`
  padding-top: 3%;
  padding-bottom: 3%;
  padding-left: 5%;
  padding-right: 5%;
  width: 410px;
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.bgColor};

  &:hover {
    background-color: ${(props) => props.onHoverBg};

    cursor: pointer;
  }
`;

const ProgressContainer = styled.div`
  border-radius: 6px;
  border-width: 1px;

  text-align: left;
  box-shadow: 0 7px 50px rgb(46 10 99 / 5%), 0 1px 1px 0.6px rgb(46 10 99 / 10%);

  background-color: white;
  padding: 4%;
  // margin-left: auto;
  // margin-right: auto;
`;

function FlashcardButton(props) {
  if (props.onForgot == "") {
    var onPress = props.onRemembered;
  } else {
    var onPress = props.onForgot;
  }
  return (
    <FlashcardButtonContainer
      onClick={onPress}
      bgColor={props.bgColor}
      onHoverBg={props.onHoverBg}
      // onMouseEnter={mouseEnter}
      // onMouseLeave={mouseOut}
    >
      <img className="Flashcard-button-icon" src={props.icon}></img>
      <div className="Flashcard-button-text" style={{ color: props.color }}>
        {props.text}
      </div>
    </FlashcardButtonContainer>
  );
}

function Flashcard(props) {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(0);
  const [absolute1, setAbsolute1] = useState("");
  const [absolute2, setAbsolute2] = useState("absolute");
  const [display1, setDisplay1] = useState("");
  const [display2, setDisplay2] = useState("none");
  const [ifReported, setIfReported] = useState(false);
  //test #
  // const [percentage, setPercentage] = useState(0);

  // const [key, setKey] = useState(0);'
  console.log("num renders before onClick");
  console.count("render");

  function handleReportAnswer() {
    setIfReported(true);
    console.log("num renders after onClick");
    console.count("render");
    var ENDPOINT_STRING =
      "https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/record-feedback";
    //Post this data
    var timestamp = new Date();
    timestamp = timestamp.toString();
    axios
      .post(ENDPOINT_STRING, {
        timestamp: timestamp,
        question: props.question,
        answer: props.answer,
        context: props.context,
      })
      .then(function (response) {
        console.log("Report answer onClick POSTd");
        console.log(response);
      })
      .catch(function (error) {
        console.log("Error in report answer onClick");
        console.log(error);
      });
  }

  return (
    <Fragment>
      {props.question == "" ? (
        <ProgressContainer>
          <div className="Progress-padding"></div>
          <MyProgressBar />
          <div className="Progress-text"> Loading Model </div>
        </ProgressContainer>
      ) : (
        <div className="Flashcard-container">
          <div className="Flashcard-question">
            {props.question || <Skeleton></Skeleton>}{" "}
          </div>
          <FlashcardAnswerHidden
            onClick={() => {
              setOpacity1(0);
              setOpacity2(1);
              setAbsolute1("absolute");
              setAbsolute2("");
              setDisplay1("none");
              setDisplay2("");
            }}
            opacity={opacity1}
            position={absolute1}
            display={display1}
          >
            <div className="Flashcard-answer-hidden-text">
              Click anywhere to reveal
            </div>
          </FlashcardAnswerHidden>

          <FlashcardAnswerContainer opacity={opacity2} absolute={absolute2}>
            <FlashcardAnswer opacity={opacity2} absolute={absolute2}>
              {props.answer || <Skeleton />}
            </FlashcardAnswer>
            {!ifReported && (
              <ReportAnswer onClick={handleReportAnswer}>
                {props.reportAnswer || <Skeleton />}
              </ReportAnswer>
            )}
            {ifReported && (
              <ReportedAnswer>
                {/* {props.reportAnswer || <Skeleton />} */}
                Thank you for your feedback
              </ReportedAnswer>
            )}
          </FlashcardAnswerContainer>

          <FlashcardButtonsContainer
            opacity={opacity2}
            absolute={opacity2}
            display={display2}
          >
            {props.dummyProp ? (
              <FlashcardButton
                text={"Forgot"}
                color="#774F00"
                bgColor="white"
                onHoverBg="#FFE0A5"
                icon={Reload}
                onRemembered={""}
                onForgot={props.onForgot}
                dummyProp={props.dummyProp}
              ></FlashcardButton>
            ) : (
              <div></div>
            )}
            {props.dummyProp ? (
              <FlashcardButton
                text={"Remembered"}
                color="#774F00"
                bgColor="#FFD37D"
                onHoverBg="#FFE0A5"
                icon={Check}
                onRemembered={props.onRemembered}
                onForgot={""}
                dummyProp={props.dummyProp}
              ></FlashcardButton>
            ) : (
              <div></div>
            )}
          </FlashcardButtonsContainer>
        </div>
      )}
    </Fragment>
  );
}

export default Flashcard;
