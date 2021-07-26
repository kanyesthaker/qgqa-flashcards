import "./App.css";
import Form from "./components/form.js";
import FlashcardContainer from "./flashcard-container";
// import Background from "./images/space.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
//Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender,
    // and breaks during development, so only uncomment for prod
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d
    // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //   const tab_url = tabs[0].url;
    //   setUrl(tab_url);
    // });
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
  });
  return (
    <div className="App">
      <header className="App-header">
        <Form></Form>
      </header>
      <FlashcardContainer></FlashcardContainer>
      <div>This is URL {url}</div>
    </div>
  );
}

export default App;
