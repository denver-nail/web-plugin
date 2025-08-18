// DOM Elements
const wordList = document.getElementById("word-list");
const wordCount = document.getElementById("word-count");
const exportTxtBtn = document.getElementById("export-txt");
const exportExcelBtn = document.getElementById("export-excel");
const clearAllBtn = document.getElementById("clear-all");
const emptyMessage = document.querySelector(".empty-message");

// Load saved words when popup opens
function loadSavedWords() {
  chrome.storage.local.get("savedWords", (result) => {
    const savedWords = result.savedWords || [];
    displayWords(savedWords);
  });
}

// Display words in the list
function displayWords(words) {
  // Update word count
  wordCount.textContent = words.length;

  // Clear current list
  wordList.innerHTML = "";

  // Show empty message if no words
  if (words.length === 0) {
    wordList.innerHTML =
      '<p class="empty-message">No words saved yet. Select a word on any webpage and click "Save".</p>';
    return;
  }

  // Sort words alphabetically
  const sortedWords = [...words].sort((a, b) => a.localeCompare(b));

  // Add each word to the list
  sortedWords.forEach((word) => {
    const wordItem = document.createElement("div");
    wordItem.className = "word-item";
    wordItem.innerHTML = `
      <span class="word-text">${word}</span>
      <button class="remove-btn" data-word="${word}">
        <i class="fas fa-times"></i>
      </button>
    `;
    wordList.appendChild(wordItem);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const wordToRemove = e.target.closest(".remove-btn").dataset.word;
      removeWord(wordToRemove);
    });
  });
}

// Remove a word from storage
function removeWord(word) {
  chrome.storage.local.get("savedWords", (result) => {
    let savedWords = result.savedWords || [];
    savedWords = savedWords.filter((w) => w !== word);
    chrome.storage.local.set({ savedWords }, () => {
      loadSavedWords();
    });
  });
}

// Export words as TXT
function exportAsTxt(words) {
  if (words.length === 0) return;

  const text = words.join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, "saved_words.txt");
}

// Export words as Excel (CSV format)
function exportAsExcel(words) {
  if (words.length === 0) return;

  // CSV header
  let csv = "Word\n";

  // Add words
  words.forEach((word) => {
    csv += `${word}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, "saved_words.csv");
}

// Helper function to download a file
function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Clear all saved words
function clearAllWords() {
  if (confirm("Are you sure you want to clear all saved words?")) {
    chrome.storage.local.set({ savedWords: [] }, () => {
      loadSavedWords();
    });
  }
}

// Event Listeners
exportTxtBtn.addEventListener("click", () => {
  chrome.storage.local.get("savedWords", (result) => {
    const savedWords = result.savedWords || [];
    exportAsTxt(savedWords);
  });
});

exportExcelBtn.addEventListener("click", () => {
  chrome.storage.local.get("savedWords", (result) => {
    const savedWords = result.savedWords || [];
    exportAsExcel(savedWords);
  });
});

clearAllBtn.addEventListener("click", clearAllWords);

// Initial load
loadSavedWords();
