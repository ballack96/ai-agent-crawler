// document.getElementById("runQuery").addEventListener("click", async () => {
//   const query = document.getElementById("query").value;
//   const resultElement = document.getElementById("result");

//   if (!query) {
//     resultElement.textContent = "Please enter a query.";
//     return;
//   }

//   // Retrieve API key from Chrome storage
//   chrome.storage.local.get(["openaiKey"], async (data) => {
//     const apiKey = data.openaiKey?.trim();  // Ensure no whitespace issues
//     if (!apiKey) {
//       resultElement.textContent = "⚠️ API key not found. Set it in the extension options.";
//       return;
//     }

//     try {
//       // Call OpenAI API
//       const parsedQuery = await getParsedQuery(apiKey, query);

//       if (!parsedQuery) {
//         resultElement.textContent = "⚠️ Failed to process the query.";
//         return;
//       }

//       // Execute the parsed query in the active tab
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         function: queryDOM,
//         args: [parsedQuery]
//       }, (result) => {
//         resultElement.textContent = result[0]?.result || "No result found.";
//       });

//     } catch (error) {
//       resultElement.textContent = `⚠️ Error: ${error.message}`;
//     }
//   });
// });


// // Function to send query to OpenAI
// async function getParsedQuery(apiKey, userQuery) {
//   try {
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey}`,  // Ensure the "Bearer" token is correctly set
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "gpt-3.5-turbo",  // Use the correct model name
//         messages: [
//           { role: "system", content: "You are an assistant that converts user natural language queries into DOM queries." },
//           { role: "user", content: userQuery }
//         ],
//         max_tokens: 50
//       })
//     });

//     const data = await response.json();
    
//     if (data.error) {
//       throw new Error(`OpenAI API Error: ${data.error.message}`);
//     }

//     return data.choices?.[0]?.message?.content || "";  // Extract the parsed response
//   } catch (error) {
//     console.error("Error with OpenAI API:", error);
//     return null;  // Return null if there's an issue
//   }
// }



document.getElementById("generateTests").addEventListener("click", async () => {
  const resultElement = document.getElementById("result");

  // Get the active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Send message to content.js to generate unit tests
  chrome.tabs.sendMessage(tab.id, { action: "generateUnitTests" }, (response) => {
    if (chrome.runtime.lastError) {
      resultElement.textContent = "Error: Could not communicate with content script.";
      return;
    }

    if (!response || !response.report || !response.testCode) {
      resultElement.textContent = "No test report generated.";
      return;
    }

    const reportText = response.report;
    const testCodeText = response.testCode;

    resultElement.textContent = reportText;

    // Store the generated test code in the button attribute for downloading
    document.getElementById("downloadTests").setAttribute("data-test-code", testCodeText);
    document.getElementById("downloadTests").disabled = false;
  });
});

// Function to download the Jest test file
document.getElementById("downloadTests").addEventListener("click", () => {
  const testCode = document.getElementById("downloadTests").getAttribute("data-test-code");
  if (!testCode.trim()) {
    alert("No test code available to download.");
    return;
  }

  // Convert test code to Blob and trigger download
  const blob = new Blob([testCode], { type: "text/javascript" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "unit_test.spec.js";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});


