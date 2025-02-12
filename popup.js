document.getElementById("runQuery").addEventListener("click", async () => {
  const query = document.getElementById("query").value;
  const resultElement = document.getElementById("result");

  if (!query) {
    resultElement.textContent = "Please enter a query.";
    return;
  }

  // Retrieve API key from storage
  chrome.storage.local.get(["openaiKey"], async (data) => {
    const apiKey = data.openaiKey;
    if (!apiKey) {
      resultElement.textContent = "Please set your OpenAI API key in the options.";
      return;
    }

    // Call OpenAI to process the query
    const parsedQuery = await getParsedQuery(apiKey, query);

    if (!parsedQuery) {
      resultElement.textContent = "Failed to process the query.";
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: queryDOM,
      args: [parsedQuery]
    }, (result) => {
      resultElement.textContent = result[0]?.result || "No result found.";
    });
  });
});

// Function to send query to OpenAI
async function getParsedQuery(apiKey, userQuery) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "system", content: "You are an assistant that converts user natural language queries into DOM queries." },
                 { role: "user", content: userQuery }],
      max_tokens: 50
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}
