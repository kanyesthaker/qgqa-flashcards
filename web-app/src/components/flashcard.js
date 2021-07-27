import React, { Component, useState } from "react";
import "./flashcard.css";
import Check from "../icons/checkmark-sharp.svg";
import Reload from "../icons/reload-sharp.svg";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 * Toggles opacity of hidden answer, implemented this SO post
 * https://stackoverflow.com/questions/68192257/react-how-to-change-opacity-of-element-by-clicking-button
 */

//This should trigger moving to the next flashcard
function Flashcard_button(props) {
  const Icon = props.icon;
  return (
    <div
      className="Flashcard-button-container"
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
  return (
    <div
      className="Flashcard-answer-container"
      style={{ opacity: props.opacity }}
    >
      <div className="Flashcard-answer">{props.answer}</div>
      <div className="Flashcard-buttons-container">
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
        ></Flashcard_button>
      </div>
    </div>
  );
}

function Flashcard_answer_hidden(props) {
  return (
    <div className="Flashcard-answer-hidden">
      <div className="Flashcard-answer-hidden-text">
        Click anywhere to reveal
      </div>
    </div>
  );
}

function Flashcard(props) {
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(0);
  const [absolute, setAbsolute] = useState("");

  return (
    <div className="Flashcard-container">
      <div className="Flashcard-question">{props.question}</div>

      <div
        className="Flashcard-answer-hidden"
        onClick={() => {
          setOpacity1(0);
          setOpacity2(1);
          setAbsolute("absolute");
        }}
        style={{ opacity: opacity1, position: absolute }}
      >
        <div className="Flashcard-answer-hidden-text">
          Click anywhere to reveal
        </div>
      </div>

      <Flashcard_container
        opacity={opacity2}
        answer={props.answer}
      ></Flashcard_container>
    </div>
  );
}

export default Flashcard;
