chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "queryDOM") {
    let result;
    try {
      if (message.query.includes("count")) {
        let tag = message.query.split(" ")[0]; // Extract element type
        result = document.querySelectorAll(tag).length;
      } else if (message.query.toLowerCase().includes("background color")) {
        let selector = message.query.split("of ")[1].trim();
        let element = document.querySelector(selector);
        result = element ? getComputedStyle(element).backgroundColor : "Element not found.";
      } else if (message.query.toLowerCase().includes("font size")) {
        let selector = message.query.split("of ")[1].trim();
        let element = document.querySelector(selector);
        result = element ? getComputedStyle(element).fontSize : "Element not found.";
      } else if (message.query.toLowerCase().includes("margin")) {
        let selector = message.query.split("of ")[1].trim();
        let element = document.querySelector(selector);
        result = element ? getComputedStyle(element).margin : "Element not found.";
      } else {
        result = "Unsupported query format.";
      }
    } catch (error) {
      result = `Error: ${error.message}`;
    }
    sendResponse({ result });
  }
});
