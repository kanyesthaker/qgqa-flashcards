import React, { useState, useContext } from "react";
import axios from "axios";

import "./form.css";
// import Results from "./results.jsx";

function Form(props) {
  const [context, setContext] = useState("");
  const [n, setN] = useState("");
  const [prob, setProb] = useState("");
  const [results, setResults] = useState(false);

  const computeClick = (e) => {
    // e.preventDefault();
    const url = `https://us-central1-useful-lattice-308300.cloudfunctions.net/function-15?n=${n}&zipcode=${context}`;
    axios.post(url, {}).then((response) => setProb(response.data));
    //   (error) => {
    //     console.log(error);
    //   };
    //   .then((response) => setResults(true));

    // .catch((error)=>{
    //     console.log(error);
    //     //   this.setState({onError: true});
    //  });
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
  };

  return (
    <div>
      {prob ? (
        // <Results prob={prob} n={n}></Results>
        <div>Placeholder</div>
      ) : (
        <div className="SignUpBox-Container">
          <p className="SignUpBox-WelcomeMsg">Flashcards demo App</p>

          <p className="SignUpBox-Msg">Enter a context passage below.</p>

          <div className="SignUpBox-InputTable">
            <div className="SignUpBox-InputRow">
              <label className="SignUpBox-InputCell">Context Passage: </label>
              <input
                onChange={(e) => setContext(e.target.value)}
                className="SignUpBox-InputCell"
                id="signUpBox-EmailInput"
                type="text"
                value={context}
              />
            </div>
          </div>
          <div className="SignUpBox-InputRow">
            <button
              className="SignUpBox-SignUpButton"
              onClick={(e) => computeClick()}
            >
              GO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
