chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "queryDOM") {
    let result;
    try {
      const parsedQuery = message.query.toLowerCase();

      if (parsedQuery.includes("count")) {
        let tag = parsedQuery.split(" ")[0]; 
        result = document.querySelectorAll(tag).length;
      } else if (parsedQuery.includes("background color")) {
        let selector = parsedQuery.split("of ")[1].trim();
        let element = document.querySelector(selector);
        result = element ? getComputedStyle(element).backgroundColor : "Element not found.";
      } else if (parsedQuery.includes("font size")) {
        let selector = parsedQuery.split("of ")[1].trim();
        let element = document.querySelector(selector);
        result = element ? getComputedStyle(element).fontSize : "Element not found.";
      } else {
        result = "Unsupported query.";
      }
    } catch (error) {
      result = `Error: ${error.message}`;
    }
    sendResponse({ result });
  }
});
