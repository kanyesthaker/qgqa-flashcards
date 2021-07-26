import "./App.css";
import Form from "./components/form.js";
import FlashcardContainer from "./flashcard-container";
// import Background from "./images/space.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
//Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Form></Form>
      </header>
      <FlashcardContainer></FlashcardContainer>
    </div>
  );
}

export default App;
