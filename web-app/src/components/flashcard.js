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

function Flashcard(props) {
  const [showAnswer, setShowAnswer] = useState(0);

  return (
    <div className="Flashcard-container">
      <div className="Flashcard-question">{props.question}</div>
      <div
        onClick={() => setShowAnswer(1)}
        className="Flashcard-answer-hidden"
        style={{ opacity: showAnswer }}
      >
        <div className="Flashcard-answer-container">
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
      </div>
    </div>
  );
}

export default Flashcard;
