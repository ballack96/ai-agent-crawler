document.getElementById("saveKey").addEventListener("click", () => {
    const apiKey = document.getElementById("apiKey").value;
    if (apiKey) {
      chrome.storage.local.set({ openaiKey: apiKey }, () => {
        alert("API key saved successfully!");
      });
    }
  });
  