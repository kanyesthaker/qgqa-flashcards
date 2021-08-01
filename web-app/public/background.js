// background.js

// try {
//   console.log("start");
//   chrome.commands.onCommand.addListener((command) => {
//     console.log(`Command: ${command}`);
//   });
//   throw new Error("lol");
//   console.log("end");
// } catch (e) {
//   console.error(e);
// }

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
  chrome.storage.sync.get(["currObject"], (results) => {
    var data = results.currObject;
    var curr_context = data.context;
    //Heuristic: truncate the context to first 6 words
    var truncated_context = truncate(curr_context, 6);

    console.log(truncated_context);

    //Now, execute our div script
    match_string = truncated_context;
    for (var i = 0; i < divs.length - 1; ++i) {
      //Check if this div has the text content I want
      var text_in_div = divs[i].innerText;
      console.log(text_in_div);

      if (text_in_div != null && text_in_div.includes(match_string)) {
        console.log("Conditional ran");
        divs[i].style["background-color"] = "rgba(255, 211, 125, 0.2)";
        divs[i].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        divs[i + 1].style["background-color"] = "rgba(255, 211, 125, 0.2)";

        //Now, highight the next div
      }
    }
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.currObject?.newValue) {
    //inject the script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab_url = tabs[0].url;
      //does not contain id
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

// console.log(divs);
//   match_string =
//     "Now that we’ve gone through the basics of RL terminology and notation, we can cover a little bit of the richer material: the landscape of algorithms in modern RL, and a description of the kinds of trade-offs that go into algorithm design.";
// }

//On listening to a change in local storage

//then use the tabs API?
//All we need here is is when user is on new tab
// chrome.action.onClicked.addListener(function (tab) {
//   // No tabs or host permissions needed!
//   console.log(tab.id);
//   chrome.scripting.executeScript(
//     {
//       target: { tabId: tab.id },
//       function: highlightText,
//       // files: ["content-script.js"],
//     },
//     (results) => {
//       console.log("i ran");
//       console.log(results);
//     }
//   );
// });
