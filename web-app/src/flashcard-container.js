import React, { useState, useEffect } from "react";

import "./flashcard-container.css";
import "./components/flashcard.css";

import Flashcard from "./components/flashcard";
import SampleData from "./data.js";
import Check from "./icons/checkmark-sharp.svg";
import Reload from "./icons/reload-sharp.svg";

/**
 * FILE HEADER: This stateful flashcard-container does the following
 * related to rendering flashcards:
 * 1. Accesses chrome.tabs API to find the user's current TAB URL
 * 2. POSTs to endpoint to receive flashcards object
 * 3. Maintains an internal queue to keep track of which flashcard to display,
 * initialized in initFlashcards() and updated in handleClick()
 * 4. Persists this queue in chrome.storage.sync in order to have a user's position
 * in the queue persist whether extension is closed or opened.
 * @param question - a question string passed as prop to flashcard.js
 * @param answer - a answer string passed as prop to flashcard.js
 * @param onPress - a custom onclick function passed to flashcard.js to propagate state to children
 * @param key - an arbitrary counter passed to flashcard.js used to force a render to display new flashcards
 **/

//ESSENTIAL: Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

function FlashcardContainer(props) {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [key, setKey] = useState(1);
  const loaded_data = SampleData;

  /**INITFLASHCARD():
   * Helper function that inits and renders the first flashcard on first open
   * of a new tab
   **/
  function initFlashcards() {
    var processed_data = loaded_data["id"];
    var object_to_load = processed_data.pop();
    chrome.storage.sync.set({ currObject: object_to_load });

    chrome.storage.sync.set({ currArray: processed_data }, function () {
      var curr_question = object_to_load.question;
      var curr_answer = object_to_load.answer;
      setQuestion(curr_question);
      setAnswer(curr_answer);
    });
  }

  /**RENDERFLASHCARDS():
   * Helper function that gets the current flashcard object,
   * and renders it
   *
   **/
  function renderFlashcards() {
    //Note: we actually want to display the popped value, not what is left in the array
    chrome.storage.sync.get(["currObject"], function (result) {
      var data = result.currObject;
      var curr_question = data.question;
      var curr_answer = data.answer;
      setQuestion(curr_question);
      setAnswer(curr_answer);
    });
  }

  useEffect(() => {
    chrome.storage.sync.get(null, function (results) {
      var keys = Object.keys(results);
      if (keys.length == 0) {
        initFlashcards();
      } else {
        renderFlashcards();
      }
    });
  }, []);

  /**HOOK TO DETERMINE TABS + POST
   **/
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

  /**handleEvent():
   * Helper function that calls onClick of when the "Remember"
   * button is clicked.  This gets the array we use as a queue,
   * pops off the next value, and if this value is not NULL (signififying no more flash cards)
   * We update React state and Chrome.storage
   *
   **/
  function handleEvent() {
    //Get the current array stored in Chrome storage
    chrome.storage.sync.get(["currArray"], function (results) {
      var object_to_load = results.currArray.pop();
      //Now set curr array equal to the popped value
      //If there are no more entries to pop, do nothing
      if (object_to_load != null) {
        var updated_curr_array = results.currArray;

        //Now, store the popped value in local storage to show on rerender
        chrome.storage.sync.set({ currObject: object_to_load });
        chrome.storage.sync.set({ currArray: updated_curr_array }, function () {
          //Query our local storage to get the most updated
          var curr_question = object_to_load["question"];
          var curr_answer = object_to_load["answer"];
          setQuestion(curr_question);
          setAnswer(curr_answer);
          //Great hack here: to force a component dismount, we update keys of a flashcard manually
          setKey(key + 1);
        });
      } else {
        //Do nothing
      }
    });
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
