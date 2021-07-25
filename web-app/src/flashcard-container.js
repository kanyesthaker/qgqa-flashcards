//Should be a functional component
import React, { Component } from "react";
import "./flashcard-container.css";
import Flashcard from "./components/flashcard";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 */

function FlashcardContainer(props) {
  return (
    <div className="Flashcard-bg-container">
      <Flashcard></Flashcard>
    </div>
  );
}

export default FlashcardContainer;
