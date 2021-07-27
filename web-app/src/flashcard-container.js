//Should be a functional component
import React, { useState, useEffect } from "react";

import "./flashcard-container.css";
import Flashcard from "./components/flashcard";

/**
 * Given a question, displays a flashcard
 * @param question - a question string as returned in form.js
 */

//Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

function FlashcardContainer(props) {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  //Hardcode this for now while we do not have an endpoint

  useEffect(() => {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender,
    // and breaks during development, so only uncomment for prod
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const tab_url = tabs[0].url;
    //   setUrl(tab_url);
    // });
    //Now, send an Axios POST request
    // const endpoint_string = "";
    // axios
    //   .post(endpoint_string, {
    //     url: { url },
    //   })
    //   .then(function (response) {
    //     console.log(response);
    //     setData(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    setQuestion(
      "What is the main difference between classical dynamic programming methods and reinforcement learning algorithms?"
    );
    setAnswer(
      "do not assume knowledge of an exact mathematical model of the MDP"
    );
  });

  return (
    <div className="Flashcard-bg-container">
      <Flashcard question={question} answer={answer}></Flashcard>
      <div>This is URL {url}</div>
    </div>
  );
}

export default FlashcardContainer;
