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
    ret = text_in_div.replaceAll(pat, "");
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
      processed_chunk = preprocess_chunk(text_in_div);
      arr_of_divs.push(processed_chunk);
    }
  }

  //-2 to generate chunks of size 3 each
  var arr_of_answer_chunks = [];

  for (var i = 0; i < arr_of_divs.length - 2; ++i) {
    var chunks = [arr_of_divs[i], arr_of_divs[i + 1], arr_of_divs[i + 2]];
    // var chunks = [arr_of_divs[i], arr_of_divs[i + 1]]; //Batches of 2 may increase performance

    var answerChunk = chunks.join(" ");
    arr_of_answer_chunks.push(answerChunk);
  }

  console.timeEnd("answer time");
  return arr_of_answer_chunks;
}

//Listener function to determine if should discard a chunk
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.storage.local.set({ idx: 0 }, function (results) {
    chrome.storage.local.set({ currObjects: [] }, function (results) {
      chrome.storage.local.set({ forgotChunks: [] }, function (results) {
        console.log("All callbacks set");
      });
    });
  });
  //get cur tab
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  var tab_id = activeInfo.tabId;
  console.log("tab id in get all chunks");
  console.log(tab_id);
  chrome.scripting.executeScript(
    {
      target: { tabId: tab_id },
      function: getAllChunks,
    },
    (results) => {
      console.log("all results");
      console.log(results);

      var arr_of_answer_chunks = results[0];
      arr_of_answer_chunks = arr_of_answer_chunks.result;

      chrome.storage.local.set(
        { allChunks: arr_of_answer_chunks },
        function (results) {}
      );
    }
  );
  // });
});

function highlightText() {
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
    //This returns a chunk, so get its context
    var truncated_context = truncate(context, 6);
    console.log(truncated_context);

    //Now, execute our div script
    match_string = truncated_context;
    for (var i = 0; i < divs.length - 1; ++i) {
      //Check if this div has the text content I want
      var text_in_div = divs[i].innerText;
      console.log(text_in_div);
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
      console.log("tab in bg");
      console.log(tabs);
      var tab_id = tabs[0].id;
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
