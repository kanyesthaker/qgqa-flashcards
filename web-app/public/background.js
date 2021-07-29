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
