import React, { Component, useState, useEffect } from "react";
import "./flashcard.css";
import Check from "../icons/checkmark-sharp.svg";
import Reload from "../icons/reload-sharp.svg";
import styled, { css } from "styled-components";

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
  padding-top: 36px;
  padding-bottom: 36px;

  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;

const FlashcardButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  opacity: ${(props) => props.opacity};
  position: ${(props) => props.absolute};
`;

function Flashcard_button(props) {
  const Icon = props.icon;
  return (
    <div
      className="Flashcard-button-container"
      onClick={props.onPress}
      style={{ backgroundColor: props.bgColor }}
    >
      <img className="Flashcard-button-icon" src={props.icon}></img>
      <div className="Flashcard-button-text" style={{ color: props.color }}>
        {props.text}
      </div>
    </div>
  );
}

function Flashcard_container(props) {
  const mystyle = {
    opacity: props.opacity,
    position: props.absolute,
  };
  return (
    // <div className="Flashcard-answer-container" style={mystyle}>
    <FlashcardAnswerContainer opacity={props.opacity} absolute={props.absolute}>
      <FlashcardAnswer opacity={props.opacity} absolute={props.absolute}>
        {props.answer}
      </FlashcardAnswer>

      <FlashcardButtonsContainer
        opacity={props.opacity}
        absolute={props.absolute}
      >
        <Flashcard_button
          text={"Forgot"}
          color="#774F00"
          bgColor="white"
          icon={Reload}
        ></Flashcard_button>
        <Flashcard_button
          text={"Remembered"}
          color="#774F00"
          bgColor="#FFD37D"
          icon={Check}
          onPress={props.onPress}
        ></Flashcard_button>
      </FlashcardButtonsContainer>
    </FlashcardAnswerContainer>
  );
}

function Flashcard(props) {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(0);
  const [absolute1, setAbsolute1] = useState("");
  const [absolute2, setAbsolute2] = useState("absolute");

  return (
    <div className="Flashcard-container">
      <div className="Flashcard-question">{props.question}</div>

      <div
        className="Flashcard-answer-hidden"
        onClick={() => {
          setOpacity1(0);
          setOpacity2(1);
          setAbsolute1("absolute");
          setAbsolute2("");
        }}
        style={{ opacity: opacity1, position: absolute1 }}
      >
        <div className="Flashcard-answer-hidden-text">
          Click anywhere to reveal
        </div>
      </div>

      <Flashcard_container
        opacity={opacity2}
        answer={props.answer}
        onPress={props.onPress}
        absolute={absolute2}
      ></Flashcard_container>
    </div>
  );
}

export default Flashcard;
