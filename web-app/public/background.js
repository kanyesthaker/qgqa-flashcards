// background.js
console.log("start");
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

function getAllChunks() {
  //Test being able to access values stored in local storage
  const divs = [...document.querySelectorAll("p")];
  //Perform some preprocessing here

  var arr_of_divs = [];
  for (var i = 0; i < divs.length - 1; ++i) {
    var text_in_div = divs[i].innerText;
    arr_of_divs.push(text_in_div);
  }

  chrome.storage.local.set({ allChunks: arr_of_divs }, function (results) {});
  chrome.storage.local.set({ idx: 0 }, function (results) {});
  chrome.storage.local.set({ currObjects: [] }, function (results) {});
}

chrome.tabs.onActivated.addListener(function (info) {
  //get cur tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    var tab_id = tabs[0].id;
    console.log("tab id in get all chunks");
    console.log(tab_id);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab_id },
        function: getAllChunks,
      },
      (results) => {
        console.log(results);
      }
    );
  });
});

function highlightText() {
  function truncate(str, nu_words) {
    return str.split(" ").splice(0, nu_words).join(" ");
  }
  console.log("File ran");
  // Watch for changes to the user's options & apply them
  const divs = [...document.querySelectorAll("p")];

  //If extension changed
  //make a request to get the current value in storage
  //This was currObject
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
        //Now, highight the next div
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
