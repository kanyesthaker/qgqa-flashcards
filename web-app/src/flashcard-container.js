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

  /**fetchChunks():
   * Helper function that calls onClick of when the "Remember"
   * button is clicked.  This gets the array we use as a queue,
   * pops off the next value, and if this value is not NULL (signififying no more flash cards)
   * We update React state and Chrome.storage
   *
   **/
  function fetchChunks() {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender,
    // and breaks during development, so only uncomment for prod
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d

    chrome.storage.local.get(["allChunks"], function (result) {
      var result = result.allChunks;
      console.log("this is from content script in front end");
      console.log(result);
      chrome.storage.local.set({ storedChunks: result }, function (results) {
        setChunks(results);
        //And now make a call to get the first chunk
        // getNextChunkandFetch();
        // fetchBatchQGQAObjects();
      });
    });

    // callback();
  }

  /**fetchChunks():
   * Helper function that calls onClick of when the "Remember"
   * @param currChunk
   **/
  function checkifNull(currChunk) {
    var question = currChunk.question;
    return question == null ? true : false;
  }

  /**renderBatchHandler():
   * Helper function that calls onClick of when the "Remember"
   **/
  function renderBatchHandler() {
    console.log("render batch ran");
    //Used to be newCurrObject
    chrome.storage.local.get(["currObjects"], function (co_result) {
      //Get the IDX
      chrome.storage.local.get(["idx"], function (i_result) {
        var data = co_result.currObjects;
        var idx = i_result.currObjects;

        console.log("this is data in render");
        console.log(data);
        // console.log(result);

        //Case one: check length of temporary_queue, if there's values left, then take from it!
        // if (data.length > 1) {
        //Execute checkIfNullHandler until the function evaluates to true,
        //At which point it stops
        while (true) {
          var currChunk = data.shift();
          var isNull = checkifNull(currChunk);
          if (isNull == false) {
            break;
          }
        }
        //Create notion of batch_len filtered from nulls
        var batch_len = data.length;
        var context = currChunk.context;
        var question = currChunk.question;
        var answer = currChunk.answer;

        //Set currObjects to its new size
        chrome.storage.local.set({ currObjects: data }, function (results) {});
        //Update currChunk so that we can highlight, this triggers our opportunity to highlight
        console.log("this is currChunk in fcj");
        console.log(currChunk);
        chrome.storage.local.set({ storedCurrChunk: currChunk }, function (
          results
        ) {
          setQuestion(question);
          setAnswer(answer);
          setKey(key + 1);

          //If idx is 0 or divisible by 4, then render next batch
          var ifRender = false;
          fetchBatchQGQAObjects(ifRender);
        });

        //async start next req if size of data is sufficiently large
        // updateBatchSize();
        // }
        // else if (data.length <= 1) {
        //   console.log("to implement!");
        //   //make new request to batch if size of
        //   fetchBatchQGQAObjects();
        // }
        // else{

        // }
      });
    });
  }

  /**readResponse():
   * Helper function that calls onClick of when the "Remember"
   * @param response
   **/
  function readResponse(response) {
    var data = response.data;
    data = JSON.parse(data.body);
    //Access values in the random ID string
    var prop_to_access = Object.keys(data)[0];
    var currObject = data[prop_to_access];
    return currObject;
  }

  /**renderBatchHandler():
   * Helper function that calls onClick of when the "Remember"
   **/
  function fetchBatchQGQAObjects(ifRender) {
    //Must pass in the next chunk-- time for chrome local storage!
    //Now, get the nextChunk
    chrome.storage.local.get(["allChunks"], function (result) {
      //This is an array of text
      var allChunks = result.allChunks;
      var chunksLen = allChunks.length;

      chrome.storage.local.get(["idx"], function (result) {
        var idx = result.idx;
        //Get the next 4 chunks
        var batchChunks = allChunks.slice(idx, idx + 4);
        var currChunk1 = batchChunks[0];
        var currChunk2 = batchChunks[1];
        var currChunk3 = batchChunks[2];
        var currChunk4 = batchChunks[3];
        console.log("this is allChunks in fetch many");
        console.log(allChunks);

        //Update our IDX
        chrome.storage.local.set({ idx: idx + 4 }, function (results) {});

        const ENDPOINT_STRING =
          "https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/generate-single ";
        axios
          .all([
            axios.post(ENDPOINT_STRING, { ctx: currChunk1 }),
            axios.post(ENDPOINT_STRING, { ctx: currChunk2 }),
            axios.post(ENDPOINT_STRING, { ctx: currChunk3 }),
            axios.post(ENDPOINT_STRING, { ctx: currChunk4 }),
          ])
          .then(
            axios.spread(function (
              chunk1Resp,
              chunk2Resp,
              chunk3Resp,
              chunk4Resp
            ) {
              // do something
              var responses = [chunk1Resp, chunk2Resp, chunk3Resp, chunk4Resp];
              var currBatch = [];
              for (var response of responses) {
                var currObject = readResponse(response);
                console.log("in batch this is an object returned");
                console.log(currObject);
                // console.log("in batch this is currBatch");
                // console.log(currBatch);

                currBatch.push(currObject);
              }

              //Now, save our next 4 objects to local storage
              //UPDATE: append these values to our currObjects array
              chrome.storage.local.get(["currObjects"], function (result) {
                var allObjects = result.currObjects;
                //now append our new batch to this queue
                // var allObjects = [];
                for (var curr of currBatch) {
                  allObjects.push(curr);
                }
                console.log("this is current all objects");
                console.log(allObjects);
                chrome.storage.local.set({ currObjects: allObjects }, function (
                  results
                ) {
                  if (ifRender == true) {
                    renderBatchHandler();
                  }
                });
              });
            })
          );
      });
    });
  }

  function fetchQGQAObject() {
    console.log("new");

    // axios
    //   .post(ENDPOINT_STRING, {
    //     ctx: currChunk,
    //   })
    //   .then(function (response) {
    //     console.log("successfully got QA object");
    //     console.log(response);
    //     var data = response.data;
    //     data = JSON.parse(data.body);
    //     //Access values in the random ID string
    //     var prop_to_access = Object.keys(data)[0];
    //     var currObject = data[prop_to_access];
    //     //Store this in storage
    //     chrome.storage.local.set({ newCurrObject: currObject }, function (
    //       results
    //     ) {
    //       //call our handler
    //       checkIfNullHandler();
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  }

  //Runs a single time upon load of component
  useEffect(() => {
    fetchChunks();
    var ifRender = true;
    fetchBatchQGQAObjects(ifRender);
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
    // getNextChunkandFetch();
    renderBatchHandler();
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
    // getNextChunkandFetch();
    renderBatchHandler();

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
    </div>
  );
}

export default FlashcardContainer;
