document.addEventListener("DOMContentLoaded", () => {
    const apiKeyInput = document.getElementById("apiKey");
    const saveButton = document.getElementById("saveKey");
    const statusText = document.getElementById("status");
  
    // Load the saved API key when options page is opened
    chrome.storage.local.get(["openaiKey"], (result) => {
      if (result.openaiKey) {
        apiKeyInput.value = result.openaiKey;
      }
    });
  
    // Save the API key when the button is clicked
    saveButton.addEventListener("click", () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        chrome.storage.local.set({ openaiKey: apiKey }, () => {
          statusText.textContent = "API key saved successfully!";
          statusText.style.color = "green";
        });
      } else {
        statusText.textContent = "Please enter a valid API key.";
        statusText.style.color = "red";
      }
    });
  });
  