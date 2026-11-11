const sourceText = document.getElementById("sourceText");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const summarizeBtn = document.getElementById("summarizeBtn");
const loadingSpinner = document.getElementById("loadingSpinner");
const errorBox = document.getElementById("errorBox");
const emptyState = document.getElementById("emptyState");
const resultsContent = document.getElementById("resultsContent");
const copyAllBtn = document.getElementById("copyAllBtn");
const toastMessage = document.getElementById("toastMessage");

let latestResult = null;
let toastTimer = null;

const sampleText = `Artificial intelligence is changing the way people work, learn, and communicate. Modern AI systems can process large amounts of information, recognize patterns, and help people complete tasks more efficiently. However, the quality of an AI result depends heavily on the quality of the information and instructions it receives.

One important challenge is information overload. Students and professionals often need to read long reports, research papers, articles, and documents. Finding the most important ideas can take a significant amount of time. Text summarization tools help by identifying central ideas and presenting them in a shorter, more organized format.

A useful summary should preserve the original meaning instead of simply removing random sentences. It should highlight the main argument, supporting details, important terms, and practical conclusions. Different readers may need different levels of detail: a short overview for a quick review, a detailed summary for deeper understanding, or bullet points for easy scanning.

AI-generated summaries should still be checked against the original source, especially when the content includes technical, legal, medical, or other high-stakes information. Summarization is best used as a reading assistant, not as a replacement for careful judgment.`;

function updateCounters() {
  const value = sourceText.value;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  wordCount.textContent = `${words.toLocaleString()} ${words === 1 ? "word" : "words"}`;
  charCount.textContent = `${value.length.toLocaleString()} characters`;
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("d-none");
}

function hideError() {
  errorBox.textContent = "";
  errorBox.classList.add("d-none");
}

function setLoading(isLoading) {
  summarizeBtn.disabled = isLoading;
  loadingSpinner.classList.toggle("d-none", !isLoading);
  summarizeBtn.querySelector(".btn-label").classList.toggle("d-none", isLoading);
}

function showToast(message) {
  toastMessage.textContent = message;
  toastMessage.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastMessage.classList.remove("show"), 1800);
}

function fillList(elementId, values) {
  const list = document.getElementById(elementId);
  list.replaceChildren();
  (Array.isArray(values) ? values : []).forEach(value => {
    const li = document.createElement("li");
    li.textContent = String(value);
    list.appendChild(li);
  });
}

function renderResults(result) {
  latestResult = result;
  document.getElementById("shortSummary").textContent = result.short_summary || "No summary available.";
  document.getElementById("detailedSummary").textContent = result.detailed_summary || "No detailed summary available.";
  fillList("bulletSummary", result.bullet_summary);
  fillList("keyTakeaways", result.key_takeaways);

  const keywordBox = document.getElementById("keywords");
  keywordBox.replaceChildren();
  (Array.isArray(result.keywords) ? result.keywords : []).forEach(keyword => {
    const chip = document.createElement("span");
    chip.className = "keyword-chip";
    chip.textContent = String(keyword);
    keywordBox.appendChild(chip);
  });

  emptyState.classList.add("d-none");
  resultsContent.classList.remove("d-none");
  copyAllBtn.disabled = false;
}

function sectionText(key) {
  if (!latestResult) return "";
  const value = latestResult[key];
  return Array.isArray(value) ? value.map(item => `• ${item}`).join("\n") : (value || "");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast("Copied to clipboard");
  }
}

sourceText.addEventListener("input", updateCounters);

document.getElementById("sampleBtn").addEventListener("click", () => {
  sourceText.value = sampleText;
  updateCounters();
  sourceText.focus();
  hideError();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  sourceText.value = "";
  updateCounters();
  hideError();
  sourceText.focus();
});

summarizeBtn.addEventListener("click", async () => {
  hideError();
  const text = sourceText.value.trim();
  if (!text) {
    showError("Please paste some text first, or try the sample text.");
    sourceText.focus();
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        length: document.getElementById("summaryLength").value
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to summarize this text.");
    renderResults(data.result);
  } catch (error) {
    showError(error.message || "A network error occurred. Please try again.");
  } finally {
    setLoading(false);
  }
});

document.querySelectorAll("[data-copy]").forEach(button => {
  button.addEventListener("click", () => {
    const key = button.dataset.copy;
    if (latestResult) copyText(sectionText(key));
  });
});

copyAllBtn.addEventListener("click", () => {
  if (!latestResult) return;
  const labels = {
    short_summary: "SHORT SUMMARY",
    detailed_summary: "DETAILED SUMMARY",
    bullet_summary: "BULLET-POINT SUMMARY",
    keywords: "IMPORTANT KEYWORDS",
    key_takeaways: "KEY TAKEAWAYS"
  };
  const combined = Object.keys(labels)
    .map(key => `${labels[key]}\n${sectionText(key)}`)
    .join("\n\n");
  copyText(combined);
});

updateCounters();
