//Should be a functional component
import React, { useState, useEffect } from "react";

import "./flashcard-container.css";
import "./components/flashcard.css";

import Flashcard from "./components/flashcard";
import SampleData from "./data.js";
import Check from "./icons/checkmark-sharp.svg";
import Reload from "./icons/reload-sharp.svg";

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
  const [key, setKey] = useState(1);

  //Hardcode this for now while we do not have an endpoint
  const loaded_data = SampleData;
  var processed_data = loaded_data["id"];

  useEffect(() => {
    var object_to_load = processed_data.pop();

    if (object_to_load != null) {
      var curr_question = object_to_load.question;
      var curr_answer = object_to_load.answer;
      console.log(processed_data);
      console.log(curr_answer);
      setQuestion(curr_question);
      setAnswer(curr_answer);
    }
  }, []);

  // var queue = [];
  // for (var i in loaded_data["id"]) queue.push([i, loaded_data[i]]);
  // console.log(queue);
  //Note that may need to intentionally create a queue here, try shift

  //Experiment with converting this to an array

  useEffect(() => {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender,
    // and breaks during development, so only uncomment for prod
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab_url = tabs[0].url;
      setUrl(tab_url);
    });
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
    //This handles logic for changing to the next card
  });

  function handleEvent(e) {
    e.preventDefault();
    console.log("handler ran");
    var object_to_load = processed_data.pop();
    if (object_to_load != null) {
      var curr_question = object_to_load["question"];
      var curr_answer = object_to_load["answer"];
      console.log(curr_answer);
      console.log(curr_question);

      setQuestion(curr_question);
      setAnswer(curr_answer);
      //Great hack here: to force a component dismount, we update keys of a flashcard manually
      setKey(key + 1);
    }
  }

  return (
    <div className="Flashcard-bg-container">
      <Flashcard
        key={key}
        question={question}
        answer={answer}
        onPress={handleEvent}
      ></Flashcard>

      <div>This is URL {url}</div>
    </div>
  );
}

export default FlashcardContainer;
