// background.js

console.log("start");
chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

// chrome.action.onClicked.addListener((tabs) => {
//   chrome.tabs.executeScript(null, { file: "popup.html" });
// });

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
  chrome.storage.local.get(["currChunk"], (results) => {
    var data = results.currChunk;
    // var curr_context = data.context;
    //Heuristic: truncate the context to first 6 words
    var truncated_context = truncate(data, 6);
    console.log(truncated_context);

    //Now, execute our div script
    match_string = truncated_context;
    for (var i = 0; i < divs.length - 1; ++i) {
      //Check if this div has the text content I want
      var text_in_div = divs[i].innerText;
      console.log(text_in_div);

      //This wa

      if (text_in_div != null && text_in_div.includes(match_string)) {
        console.log("Conditional ran");
        //If we're not at the first div, then remove the last two highlighting
        if (i > 2) {
          //This is hacky for now
          divs[0].style["background-color"] = "transparent"; //lets hope this works
          divs[1].style["background-color"] = "transparent"; //lets hope this works
          divs[i - 1].style["background-color"] = "transparent"; //lets hope this works
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
  if (area === "local" && changes.newCurrObject?.newValue) {
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
          // files: ["content-script.js"],
        },
        (results) => {
          console.log("i ran");
          console.log(results);
        }
      );
    });
  }
});
