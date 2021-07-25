//Should be a functional component
import React, { Component } from "react";
import styled, { css } from "styled-components";
import "./flashcard.css";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 */

function Flashcard(props) {
  return (
    <div className="Flashcard-container">
      <div className="Flashcard-question">
        What is the main difference between classical dynamic programming
        methods and reinforcement learning algorithms?'
      </div>
      <div className="Flashcard-answer-container">
        <div className="Flashcard-answer">
          do not assume knowledge of an exact mathematical model of the MDP
        </div>
      </div>
    </div>
  );
}

export default Flashcard;
