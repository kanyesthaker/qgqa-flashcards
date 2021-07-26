import logo from "./logo.svg";
import "./App.css";
import "./App.css";
import Form from "./components/form.js";
import FlashcardContainer from "./flashcard-container";

// import Background from "./images/space.png";
import styled, { css } from "styled-components";
import { useEffect } from "react";

//Let ESLint know that we are accessing Chrome browser methods
/* global chrome */

// const Bg = styled.div`
//   backgroundimage: url(${Background});
// `;

function App() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    //Insert Chrome logic here to access current URL. Note that this runs on rerender
    //https://blog.usejournal.com/making-an-interactive-chrome-extension-with-react-524483d7aa5d
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = new URL(tabs[0].url);
      // const domain = url.hostname;
      setUrl(url);
    });
  });
  return (
    <div className="App">
      {/* <div className="Bg" style={{ backgroundImage: `url(${Background})` }}> */}
      <header className="App-header">
        <Form></Form>
      </header>
      <FlashcardContainer></FlashcardContainer>
      <div>This is URL {url}</div>
      {/* </div> */}
    </div>
  );
}

export default App;
