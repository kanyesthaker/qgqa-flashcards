import "./App.css";
import Form from "./components/form.js";
import FlashcardContainer from "./flashcard-container";
import React, { useState, useEffect } from "react";

function App() {
  return (
    <div className="App">
      <FlashcardContainer></FlashcardContainer>
    </div>
  );
}

export default App;
