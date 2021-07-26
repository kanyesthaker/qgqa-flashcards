//Should be a functional component
import React, { Component, useState } from "react";
import styled, { css } from "styled-components";
import "./flashcard.css";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 * Toggles opacity of hidden answer, implemented this SO post
 * https://stackoverflow.com/questions/68192257/react-how-to-change-opacity-of-element-by-clicking-button
 */

function Flashcard(props) {
  const [showAnswer, setShowAnswer] = useState(0);

  return (
    <div className="Flashcard-container">
      <div className="Flashcard-question">
        What is the main difference between classical dynamic programming
        methods and reinforcement learning algorithms?'
      </div>
      <div
        onClick={() => setShowAnswer(1)}
        className="Flashcard-answer-hidden"
        style={{ opacity: showAnswer }}
      >
        <div className="Flashcard-answer-container">
          <div className="Flashcard-answer">
            do not assume knowledge of an exact mathematical model of the MDP
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
