[...document.querySelectorAll("div")] // get all the divs in an array
  .map((div) => div.innerHTML) // get their contents
  .filter((txt) =>
    txt.includes(
      "Now that we’ve gone through the basics of RL terminology and notation, we can cover a little bit of the richer material: the landscape of algorithms in modern RL, and a description of the kinds of trade-offs that go into algorithm design."
    )
  ) // keep only those containing the query
  .forEach((txt) => console.log(txt)); // output the entire contents of those

console.log("File ran");
