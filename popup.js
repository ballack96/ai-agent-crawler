document.getElementById("runQuery").addEventListener("click", async () => {
  const query = document.getElementById("query").value;
  const resultElement = document.getElementById("result");

  if (!query) {
    resultElement.textContent = "Please enter a query.";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: queryDOM,
    args: [query]
  }, (result) => {
    resultElement.textContent = result[0]?.result || "No result found.";
  });
});

function queryDOM(query) {
  try {
    if (query.includes("count")) {
      let tag = query.split(" ")[0]; // Extract element type
      return document.querySelectorAll(tag).length;
    }

    // Handling CSS queries
    if (query.toLowerCase().includes("background color")) {
      let selector = query.split("of ")[1].trim();
      let element = document.querySelector(selector);
      return element ? getComputedStyle(element).backgroundColor : "Element not found.";
    }

    if (query.toLowerCase().includes("font size")) {
      let selector = query.split("of ")[1].trim();
      let element = document.querySelector(selector);
      return element ? getComputedStyle(element).fontSize : "Element not found.";
    }

    if (query.toLowerCase().includes("margin")) {
      let selector = query.split("of ")[1].trim();
      let element = document.querySelector(selector);
      return element ? getComputedStyle(element).margin : "Element not found.";
    }

    return "Unsupported query format.";
  } catch (error) {
    return `Error: ${error.message}`;
  }
}
