// Create tooltip element
const tooltip = document.createElement("div");
tooltip.className = "word-tooltip";
tooltip.innerHTML =
  '<span>Save word?</span><button id="save-word-btn">Save</button>';
document.body.appendChild(tooltip);

// Hide tooltip initially
tooltip.style.display = "none";

// Variable to track selected text
let selectedText = "";

// Function to show tooltip
function showTooltip(x, y) {
  if (selectedText && isEnglishWord(selectedText)) {
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
    tooltip.style.display = "flex";
    // Fade in effect
    setTimeout(() => {
      tooltip.style.opacity = "1";
    }, 10);
  } else {
    hideTooltip();
  }
}

// Function to hide tooltip
function hideTooltip() {
  tooltip.style.opacity = "0";
  setTimeout(() => {
    tooltip.style.display = "none";
  }, 200);
  selectedText = "";
}

// Check if selected text is an English word (letters only)
function isEnglishWord(text) {
  const trimmed = text.trim();
  // 允许带连字符的单词，如mother-in-law
  return /^[a-zA-Z-]+$/.test(trimmed) && trimmed.length > 1;
}

// 处理选中文本并显示提示框的通用函数
function handleSelection() {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();

  if (selectedText && isEnglishWord(selectedText)) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    // Position tooltip near the selection
    const x = rect.left + window.scrollX;
    const y = rect.top + window.scrollY - 30;
    showTooltip(x, y);
  } else {
    hideTooltip();
  }
}

// Listen for selection end (mouse up)
document.addEventListener("mouseup", handleSelection);

// Add double click support for word selection
document.addEventListener("dblclick", () => {
  // 延迟确保浏览器完成文本选择
  setTimeout(handleSelection, 100);
});

// Hide tooltip when clicking elsewhere or scrolling
document.addEventListener("mousedown", (e) => {
  if (!tooltip.contains(e.target)) {
    hideTooltip();
  }
});

// Hide tooltip when scrolling
document.addEventListener("scroll", () => {
  hideTooltip();
});

// Save word button click handler
document.getElementById("save-word-btn").addEventListener("click", () => {
  if (selectedText) {
    const word = selectedText.trim().toLowerCase();

    // Get current saved words from storage
    chrome.storage.local.get("savedWords", (result) => {
      const savedWords = result.savedWords || [];

      // Check if word already exists
      if (!savedWords.includes(word)) {
        // Add new word
        savedWords.push(word);

        // Save back to storage
        chrome.storage.local.set({ savedWords }, () => {
          // Show feedback by changing button text temporarily
          const saveBtn = document.getElementById("save-word-btn");
          const originalText = saveBtn.textContent;
          saveBtn.textContent = "Saved!";
          saveBtn.style.backgroundColor = "#4CAF50"; // 成功颜色

          setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.backgroundColor = ""; // 恢复默认
            hideTooltip();
          }, 1000);
        });
      } else {
        // Word already exists - show feedback
        const saveBtn = document.getElementById("save-word-btn");
        const originalText = saveBtn.textContent;
        saveBtn.textContent = "Already saved!";
        saveBtn.style.backgroundColor = "#ff9800"; // 警告颜色

        setTimeout(() => {
          saveBtn.textContent = originalText;
          saveBtn.style.backgroundColor = ""; // 恢复默认
          hideTooltip();
        }, 1000);
      }
    });
  }
});
