import logo from "./logo.svg";
import "./App.css";
import "./App.css";
import Form from "./components/form.js";

// import Background from "./images/space.png";
import styled, { css } from "styled-components";

// const Bg = styled.div`
//   backgroundimage: url(${Background});
// `;

function App() {
  return (
    <div className="App">
      {/* <div className="Bg" style={{ backgroundImage: `url(${Background})` }}> */}
      <header className="App-header">
        <Form></Form>
      </header>
      {/* </div> */}
    </div>
  );
}

export default App;
