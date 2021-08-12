/* global chrome */

const getObjectFromLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value[key]);
      });
    } catch (ex) {
      // chrome.storage.local.set({ errorOccured: true }, function () {
      reject(ex);
      // });
      // reject(ex);
    }
  });
};

/**
 * Save Object in Chrome's Local StorageArea
 * @param {*} obj
 */
const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

/**
 * Removes Object from Chrome Local StorageArea.
 *
 * @param {string or array of string keys} keys
 */
const removeObjectFromLocalStorage = async function (keys) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

// background.js
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

function getAllChunks() {
  console.time("answer time");

  const divs = [...document.querySelectorAll("p")];

  //Helper function to process a selected chunk
  function preprocess_chunk(text_in_div) {
    //Replace all with {} [] <>
    var pat = /(\{.*?\})|(\[.*?\])|(<.*?>)/g;
    var ret = text_in_div.replaceAll(pat, "");
    return ret;
  }

  //Helper function to determine if should discard a chunk
  function shouldBeIncluded(text_in_div) {
    //If contains any strings w more than one word that start w/ a capital letter and end with punctuation, keep it
    var pat = /^[A-Z].+ .+[\.|!|?]/;
    var bool = pat.test(text_in_div);
    return bool;
  }

  var arr_of_divs = [];
  for (var i = 0; i < divs.length - 1; ++i) {
    var text_in_div = divs[i].innerText;
    if (shouldBeIncluded(text_in_div)) {
      var processed_chunk = preprocess_chunk(text_in_div);
      arr_of_divs.push(processed_chunk);
    }
  }

  //-2 to generate chunks of size 3 each
  var arr_of_answer_chunks = [];
  for (var j = 0; j < arr_of_divs.length - 2; ++j) {
    var chunks = [arr_of_divs[j], arr_of_divs[j + 1], arr_of_divs[j + 2]];
    // var chunks = [arr_of_divs[i], arr_of_divs[i + 1]]; //Batches of 2 may increase performance
    var answerChunk = chunks.join(" ");
    arr_of_answer_chunks.push(answerChunk);
  }
  console.timeEnd("answer time");
  return arr_of_answer_chunks;
}

//Listener function to get all chunks upon user navigating to new tab
chrome.tabs.onActivated.addListener(function (activeInfo) {
  async function handleInit(tab_id) {
    await saveObjectInLocalStorage({ errorOccured: false });
    await saveObjectInLocalStorage({ idx: 0 });
    await saveObjectInLocalStorage({ currObjects: [] });
    await saveObjectInLocalStorage({ forgotChunks: [] });
    // console.log("onActivated fired");
    // console.log("tab id in get all chunks");
    // console.log(tab_id);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab_id },
        function: getAllChunks,
      },
      (results) => {
        console.log("all results");
        console.log(results);
        try {
          var arr_of_answer_chunks = results[0];
          arr_of_answer_chunks = arr_of_answer_chunks.result;
          //Store the persistent tab_id in storage
          if (arr_of_answer_chunks.length < 4) {
            throw new Error("Webpage is not able to be parsed");
          }
          chrome.storage.local.set(
            { allChunks: arr_of_answer_chunks },
            function (results) {}
          );
        } catch (exception) {
          //set some error state to be false
          chrome.storage.local.set(
            { errorOccured: true },
            function (results) {}
          );
        }
      }
    );
  }
  var tab_id = activeInfo.tabId;
  handleInit(tab_id);
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
  async function handleInit(tab_id) {
    await saveObjectInLocalStorage({ errorOccured: false });
    await saveObjectInLocalStorage({ idx: 0 });
    await saveObjectInLocalStorage({ currObjects: [] });
    await saveObjectInLocalStorage({ forgotChunks: [] });
    console.log("onUpdated fired");

    console.log("tab id in get all chunks");
    console.log(tab_id);
    console.log(changeInfo);

    chrome.scripting.executeScript(
      {
        target: { tabId: tab_id },
        function: getAllChunks,
      },
      (results) => {
        console.log("all results");
        console.log(results);
        try {
          var arr_of_answer_chunks = results[0];
          arr_of_answer_chunks = arr_of_answer_chunks.result;
          if (arr_of_answer_chunks.length < 4) {
            throw new Error("Webpage is not able to be parsed");
          }
          chrome.storage.local.set(
            { allChunks: arr_of_answer_chunks },
            function (results) {}
          );
        } catch (exception) {
          //set some error state to be false
          chrome.storage.local.set(
            { errorOccured: true },
            function (results) {}
          );
        }
      }
    );
  }

  var tab_id = tabID;
  if (changeInfo.status == "complete" && changeInfo.title) {
    handleInit(tab_id);
  }
});

async function highlightText() {
  function truncate(str, nu_words) {
    return str.split(" ").splice(0, nu_words).join(" ");
  }
  // Get all p tags
  const divs = [...document.querySelectorAll("p")];

  //make a request to get the current value in storage
  chrome.storage.local.get(["storedCurrChunk"], (results) => {
    var data = results.storedCurrChunk;
    var context = data.context;
    //Heuristic: truncate the context to first 6 words
    var truncated_context = truncate(context, 6);

    //Context is offset by 1, so we truncate first character as workaround
    var match_string = truncated_context.substring(1);
    for (var i = 0; i < divs.length - 1; ++i) {
      //Check if this div has the text content I want
      var text_in_div = divs[i].innerText;
      console.log(text_in_div);
      console.log(text_in_div.includes(match_string));

      if (text_in_div != null && text_in_div.includes(match_string)) {
        console.log("Conditional ran");
        //If we're not at the first div, then remove the last two highlighting
        if (i > 2) {
          //This is hacky for now
          divs[0].style["background-color"] = "transparent";
          divs[1].style["background-color"] = "transparent";
          divs[i - 1].style["background-color"] = "transparent";
          divs[i - 2].style["background-color"] = "transparent";
        }

        divs[i].style["background-color"] = "rgba(255, 211, 125, 0.2)";
        divs[i + 1].style["background-color"] = "rgba(255, 211, 125, 0.2)";
        divs[i].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.storedCurrChunk?.newValue) {
    //inject the script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var tab_id = tabs[0].id;
      console.log("this is tab id in highlighter listener");
      console.log(tab_id);
      //Execute the script
      chrome.scripting.executeScript(
        {
          target: { tabId: tab_id },
          function: highlightText,
        },
        (results) => {
          console.log("i ran");
          console.log(results);
        }
      );
    });
  }
});
