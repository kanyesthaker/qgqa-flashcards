import React, { useState, useEffect } from "react";

import "./flashcard-container.css";
import "./components/flashcard.css";

import Flashcard from "./components/flashcard";
import SampleData from "./data.js";
import Check from "./icons/checkmark-sharp.svg";
import Reload from "./icons/reload-sharp.svg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

/**
 * FILE HEADER: This stateful flashcard-container does the following
 * related to rendering flashcards:
 * 1. Accesses chrome.tabs API to find the user's current TAB URL
 * 2. POSTs to endpoint to receive flashcards object
 * 3. Maintains an internal queue to keep track of which flashcard to display,
 * initialized in initFlashcards() and updated in handleClick()
 * 4. Persists this queue in chrome.storage.local in order to have a user's position
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
  const [chunks, setChunks] = useState([]);
  const [QGQAObject, setQGQAObject] = useState([]);

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
    var object_to_load = processed_data.shift();
    chrome.storage.local.set({ currObject: object_to_load });

    chrome.storage.local.set({ currArray: processed_data }, function () {
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
    chrome.storage.local.get(["newCurrObject"], function (result) {
      var data = result.currObject;
      var curr_question = data.question;
      var curr_answer = data.answer;
      setQuestion(curr_question);
      setAnswer(curr_answer);
    });
  }

  function getNextChunkandFetch() {
    //Get the next chunk from Chrome synced storage
    chrome.storage.local.get(["storedChunks"], function (result) {
      var data = result.storedChunks;
      //Shift the first element of the array off
      console.log("data");
      console.log(data);
      var currChunk = data.shift();
      console.log("currChunk");
      console.log(currChunk);

      //Store the current chunk in storage
      //Call back here to get the first chunk
      chrome.storage.local.set({ currChunk: currChunk }, function () {
        fetchQGQAObject();
      });

      //Update the storedChunks queue
      chrome.storage.local.set({ storedChunks: data });
    });
  }

  function fetchChunks() {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender,
    // and breaks during development, so only uncomment for prod
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab_url = tabs[0].url;
      setUrl(tab_url);

      //Now, send an Axios POST request to get all chunks given url
      const ENDPOINT_STRING =
        "https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/segment-text";
      axios
        .post(ENDPOINT_STRING + `?src=${tab_url}`)
        .then(function (response) {
          var prop_to_access = Object.keys(response.data)[0];
          var data = response.data[prop_to_access];
          data = Object.values(data);

          //Now, store chunks in Chrome synced storage to persist
          chrome.storage.local.set({ storedChunks: data }, function (results) {
            setChunks(results);
            //And now make a call to get the first chunk
            getNextChunkandFetch();
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  //Check if null
  function checkIfNullHandler() {
    chrome.storage.local.get(["newCurrObject"], function (result) {
      var data = result.newCurrObject;
      var question = data.question;
      var answer = data.answer;
      var context = data.context;

      if (question == null) {
        //get the next chunk and fetch object
        getNextChunkandFetch();
      } else {
        //render the card
        setQuestion(question);
        setAnswer(answer);
        setKey(key + 1);

        // renderFlashcards();
      }
    });
  }

  function fetchQGQAObject() {
    //Must pass in the next chunk-- time for chrome local storage!
    //Now, get the nextChunk
    chrome.storage.local.get(["currChunk"], function (result) {
      var currChunk = result.currChunk;
      console.log("this is currChunk in fetch");
      console.log(currChunk);

      const ENDPOINT_STRING =
        "https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/generate-single ";
      axios
        .post(ENDPOINT_STRING, {
          ctx: currChunk,
        })
        .then(function (response) {
          console.log("successfully got QA object");
          console.log(response);
          var data = response.data;
          data = JSON.parse(data.body);
          //Access values in the random ID string
          var prop_to_access = Object.keys(data)[0];
          var currObject = data[prop_to_access];
          //Store this in storage
          chrome.storage.local.set({ newCurrObject: currObject }, function (
            results
          ) {
            //call our handler
            checkIfNullHandler();
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  //Runs a single time upon load of component
  useEffect(() => {
    //Before initializing a flashcard, we must POST to get all chunks
    //Pass a callback here
    fetchChunks();
    //Then post a chunk to get the first question

    // chrome.storage.local.get(null, function (results) {
    //   var keys = Object.keys(results);
    //   if (keys.length == 0) {
    //     initFlashcards();
    //   } else {
    //     renderFlashcards();
    //   }
    // });
  }, []);

  /**HOOK TO DETERMINE TABS + POST
   **/
  useEffect(() => {
    //This handles logic for changing to the next card
  });

  /**handleEventRemember():
   * Helper function that calls onClick of when the "Remember"
   * button is clicked.  This gets the array we use as a queue,
   * pops off the next value, and if this value is not NULL (signififying no more flash cards)
   * We update React state and Chrome.storage
   *
   **/
  function handleEventRemember() {
    getNextChunkandFetch();
    //Get the current array stored in Chrome storage
    // chrome.storage.local.get(["currArray"], function (results) {
    //   var object_to_load = results.currArray.shift();
    //   //Now set curr array equal to the popped value
    //   //If there are no more entries to pop, do nothing
    //   if (object_to_load != null) {
    //     var updated_curr_array = results.currArray;

    //     //Now, store the popped value in local storage to show on rerender
    //     chrome.storage.local.set({ currObject: object_to_load });
    //     chrome.storage.local.set(
    //       { currArray: updated_curr_array },
    //       function () {
    //         //Query our local storage to get the most updated
    //         var curr_question = object_to_load["question"];
    //         var curr_answer = object_to_load["answer"];
    //         setQuestion(curr_question);
    //         setAnswer(curr_answer);
    //         //Great hack here: to force a component dismount, we update keys of a flashcard manually
    //         setKey(key + 1);
    //       }
    //     );
    //   } else {
    //     //Do nothing
    //   }
    // });
  }

  /**handleEventForgot():
   * Helper function that calls onClick of when the "Forgot"
   * button is clicked.  This gets the array we use as a queue,
   * pops off the next value, and then pops back on if this value is not NULL (signififying no more flash cards)
   * We update React state and Chrome.storage
   * TO DO: Figure out how to combine this in one handleEvent with some kind of bool
   *
   **/
  function handleEventForgot() {
    getNextChunkandFetch();

    //Get the current object
    // chrome.storage.local.get(["currObject"], function (result) {
    //   var data = result.currObject;

    //   //Get the current array stored in Chrome storage
    //   chrome.storage.local.get(["currArray"], function (results) {
    //     //Push current object to the end of the results array
    //     var len_push_to_array = results.currArray.push(data);
    //     //Get the next value
    //     var object_to_load = results.currArray.shift();
    //     //Now set curr array equal to the popped value

    //     //If there are no more entries to pop, do nothing
    //     if (object_to_load != null) {
    //       var updated_curr_array = results.currArray;

    //       //Now, store the popped value in local storage to show on rerender
    //       chrome.storage.local.set({ currObject: object_to_load });
    //       chrome.storage.local.set(
    //         { currArray: updated_curr_array },
    //         function () {
    //           //Query our local storage to get the most updated
    //           var curr_question = object_to_load["question"];
    //           var curr_answer = object_to_load["answer"];
    //           setQuestion(curr_question);
    //           setAnswer(curr_answer);
    //           //Great hack here: to force a component dismount, we update keys of a flashcard manually
    //           setKey(key + 1);
    //         }
    //       );
    //     } else {
    //       //Do nothing
    //     }
    //   });
    // });
  }

  return (
    <div className="Flashcard-bg-container">
      <Flashcard
        key={key}
        question={question}
        answer={answer}
        onRemembered={handleEventRemember}
        onForgot={handleEventForgot}
      ></Flashcard>

      {/* <div>This is URL {url}</div> */}
    </div>
  );
}

export default FlashcardContainer;
