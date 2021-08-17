import React, { useState, useEffect } from "react";
import "./flashcard-container.css";
import "./components/flashcard.css";
import Flashcard from "./components/flashcard";
import SampleData from "./data.js";
import Check from "./icons/checkmark-sharp.svg";
import Reload from "./icons/reload-sharp.svg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

import {
  getObjectFromLocalStorage,
  saveObjectInLocalStorage,
  removeObjectFromLocalStorage,
} from "./chrome-storage.js";

/**
 * Documentation updated Aug 10 2021
 * FILE HEADER: This stateful flashcard-container does the following
 * related to rendering flashcards:
 * 1. Calls UseEffect() a single time on init of the app to fetchBatchQGQAObjects(), if no errors
 * 2. Sends batch requests of 4 to Sagemaker endpoint with chunks parsed in background.js 
 * 3. Renders flashcard in renderBatchHandler()
 * 4. Maintains an internal queue titled @param currObjects to keep track of which flashcard to display.  
 * 4. Maintains internal queue @param currForgotChunks to keep track of chunks that were forgotten to render
 * 5. Determines whether to render a flashcard, error message, or message when all flashcards are exhausted
 * 
 * LOCAL STORAGE OBJECTS
 * @param forgotChunks - internal queue of current all forgotCunks
 * @param currObjects - internal queue of current chunks received by the model and not yet rendered
 * @param allChunks - parsed and preprocessed array of chunks 
 * @param idx - int idx counter used to slice into allChunks to get the next batch of 4 objects.
 * @param errorOccured - bool set in background.js if error occured
 *
 * PARAMS PASSED TO FLASHCARDS
 * @param key
 * @param question
 * @param answer
 * @param reportAnswer
 * @param onRemembered
 * @param onForgot

 **/

//ESSENTIAL: Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

function FlashcardContainer(props) {
  const [isMoreFlashcards, setisMoreFlashcards] = useState(true);
  const [errorOccured, setErrorOccured] = useState(false);
  const [question, setQuestion] = useState("");
  //Workaround to render this at the same time
  const [answer, setAnswer] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [reportAnswer, setReportAnswer] = useState("");
  const [dummyProp, setDummyProp] = useState(false);

  const [key, setKey] = useState(1);

  /**renderFlashcard():
   * Set question,answer and key of next flashcard and trigger DOM unmount and rerender
   * @param currChunk
   **/
  function renderFlashcard(currChunk) {
    var context = currChunk.context;
    var question = currChunk.question;
    var answer = currChunk.answer;
    setQuestion(question);
    setAnswer(answer);
    setContext(context);

    setKey(key + 1);
    setReportAnswer("Report Answer");
    setDummyProp(true);
  }

  /**addForgottenChunk():
   * Helper function that appends chunk that a user has forgotten to end of forgotChunks arr
   * @param currChunk
   **/
  async function addForgottenChunk(currChunk) {
    var forgotChunks = await getObjectFromLocalStorage("forgotChunks");
    var len = forgotChunks.push(currChunk);
    await saveObjectInLocalStorage({ forgotChunks: forgotChunks });
  }

  /**renderBatchHandler():
   * TODO: Write documentation
   * @param forgotObject bool flag that represents if user has forgotten current card or not
   **/
  async function renderBatchHandler(forgotObject) {
    var BATCH_SIZE = 4;
    var allChunks = await getObjectFromLocalStorage("allChunks");
    var data = await getObjectFromLocalStorage("currObjects");
    var idx = await getObjectFromLocalStorage("idx");
    var currForgotChunks = await getObjectFromLocalStorage("forgotChunks");

    console.log("this is currObjects");
    console.log(data);

    var currChunk = data.shift();
    //if idx has not reached the end?

    if (currChunk != null) {
      //If we set our forgot flag, then append this chunk to the end of the queue
      if (forgotObject == true) {
        addForgottenChunk(currChunk);
        //this can be null
        currForgotChunks = await getObjectFromLocalStorage("forgotChunks");
        console.log(currForgotChunks);
      }
      //Set currObjects to its new size
      await saveObjectInLocalStorage({ currObjects: data });
      await saveObjectInLocalStorage({ storedCurrChunk: currChunk });
      //Update currChunk so that we can highlight, this triggers our opportunity to highlight
      renderFlashcard(currChunk);
      //Decide to fetch more or not
      var size = idx + BATCH_SIZE; //ex) we're in idx 8 + 4 =12, there are 13 elements in allchunks, no more requests
      if (size <= allChunks.length) {
        var ifRender = false;
        fetchBatchQGQAObjects(ifRender);
      }
    } else if (currForgotChunks.length !== 0) {
      var forgottenChunk = currForgotChunks.shift();
      await saveObjectInLocalStorage({ forgotChunks: currForgotChunks });
      renderFlashcard(forgottenChunk);
    } else if (idx + BATCH_SIZE > allChunks.length && isLoading === false) {
      setisMoreFlashcards(false);
      //Set handler to clean up flashcards
    }

    // }
  }

  /**readResponse():
   * Helper function that calls onClick of when the "Remember"
   * @param response
   **/
  function readResponse(response) {
    //Data can be null if there is an error
    var data = response.data;
    data = JSON.parse(data.body);
    //Access values in the random ID string
    var prop_to_access = Object.keys(data)[0];
    var currObject = data[prop_to_access];
    return currObject;
  }

  /**addForgottenChunk():
   * Helper function that appends chunk that a user has forgotten to end of forgotChunks arr
   * @param currChunk
   **/
  function checkifNull(currChunk) {
    var question = currChunk.question;
    return question == null ? true : false;
  }

  /**preprocess_responses():
   * Helper function that appends chunk that a user has forgotten to end of forgotChunks arr
   * @param responses
   * @param ifRender
   **/
  async function preprocess_responses(responses, idx, ifRender) {
    var currBatch = [];
    for (var response of responses) {
      var currObject = readResponse(response);

      var isNull = checkifNull(currObject);
      if (isNull == false) {
        currBatch.push(currObject);
      }
    }
    //Now, save our next 4 objects to local storage
    var allObjects = await getObjectFromLocalStorage("currObjects");
    //now append our new batch to this queue
    for (var curr of currBatch) {
      allObjects.push(curr);
    }

    await saveObjectInLocalStorage({ currObjects: allObjects });

    if (ifRender == true) {
      var forgotObject = false;
      renderBatchHandler(forgotObject);
    }
  }

  /**renderBatchHandler():
   * Helper function that calls onClick of when the "Remember"
   * @param ifRender bool flag passed in to determine if function should call renderBatchHandler
   * Passed true on init, otherwise false
   **/
  async function fetchBatchQGQAObjects(ifRender) {
    var BATCH_SIZE = 4;
    //Check for null value of allchunks here
    try {
      var allChunks = await getObjectFromLocalStorage("allChunks");
      var idx = await getObjectFromLocalStorage("idx");
    } catch (error) {
      console.log("this is error in fetchBatchQGQA");
      console.log(error);
      setErrorOccured(true);
    }
    //Get the next 4 chunks
    var batchChunks = allChunks.slice(idx, idx + BATCH_SIZE);
    await saveObjectInLocalStorage({ idx: idx + 4 });

    var currChunk1 = batchChunks[0];
    var currChunk2 = batchChunks[1];
    var currChunk3 = batchChunks[2];
    var currChunk4 = batchChunks[3];
    //Update our IDX

    const ENDPOINT_STRING =
      "https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/generate-single ";
    setIsLoading(true);

    axios
      .all([
        axios.post(ENDPOINT_STRING, { ctx: currChunk1 }),
        axios.post(ENDPOINT_STRING, { ctx: currChunk2 }),
        axios.post(ENDPOINT_STRING, { ctx: currChunk3 }),
        axios.post(ENDPOINT_STRING, { ctx: currChunk4 }),
      ])
      .then(
        axios.spread(function (chunk1Resp, chunk2Resp, chunk3Resp, chunk4Resp) {
          var responses = [chunk1Resp, chunk2Resp, chunk3Resp, chunk4Resp];
          preprocess_responses(responses, idx, ifRender);
          setIsLoading(false);
        })
      )
      //Believe this only catches the first error, but it's something
      .catch((error) => {
        console.log("this is error in qgqa 2 after post request");
        console.log(error);
        setErrorOccured(true);
        setIsLoading(false);
      });
  }

  //Runs a single time upon load of component
  useEffect(() => {
    async function init_states() {
      var errorOccured = await getObjectFromLocalStorage("errorOccured");
      console.log("this is error in useEffect init");
      console.log(errorOccured);
      var ifRender = true;
      errorOccured ? setErrorOccured(true) : fetchBatchQGQAObjects(ifRender);
      //Now, clean up and reset errorOccured to false
      // await saveObjectInLocalStorage({ errorOccured: false });
    }
    init_states();
  }, []);

  /**handleEventRemember():
   * Helper function that calls onClick of when the "Remember"
   * button is clicked.  This gets the array we use as a queue,
   * pops off the next value, and if this value is not NULL (signififying no more flash cards)
   * We update React state and Chrome.storage
   *
   **/
  function handleEventRemember() {
    // getNextChunkandFetch();
    var forgotObject = false;
    renderBatchHandler(forgotObject);
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
    //Pass in a flag to append currObject back to end of queue
    var forgotObject = true;
    renderBatchHandler(forgotObject);
  }

  //Global check
  if (!isMoreFlashcards || errorOccured) {
    chrome.storage.local.set({ ifCleanUp: true }, function () {});
  }

  return (
    <div className="Flashcard-bg-container">
      {!errorOccured ? (
        [
          isMoreFlashcards ? (
            <Flashcard
              key={key}
              question={question}
              answer={answer}
              context={context}
              reportAnswer={reportAnswer}
              dummyProp={dummyProp}
              onRemembered={handleEventRemember}
              onForgot={handleEventForgot}
            ></Flashcard>
          ) : (
            <div className="final-container">
              Great job! No more questions to ask from our AI for now.{" "}
            </div>
          ),
        ]
      ) : (
        <div className="final-container">
          {" "}
          Ferrett can't read this type of page. Try again on another site!
        </div>
      )}
    </div>
  );
}

export default FlashcardContainer;
