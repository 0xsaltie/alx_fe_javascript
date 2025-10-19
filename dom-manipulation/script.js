const STORAGE_KEY = 'quoteManager.quotes';

const defaultQuotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "In the middle of difficulty lies opportunity.", category: "Resilience" }
];

let quotes = [];

const ref = {
  quoteDisplay: document.getElementById('quoteDisplay'),
  newQuote: document.getElementById('newQuote'),
  newQuoteCategory: document.getElementById('newQuoteCategory'),
  newQuoteTextInput: document.getElementById('newQuoteText'),
  newQuoteCategoryInput: document.getElementById('newQuoteCategoryInput'),
  addQuoteBtn: document.getElementById('addQuoteBtn'),
  message: document.getElementById('message')
};

function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

function loadQuotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    quotes = defaultQuotes.slice();
    saveQuotes();
  } else {
    const parsed = JSON.parse(raw);
    quotes = Array.isArray(parsed) ? parsed : defaultQuotes.slice();
  }
}

function randomIndex(n) {
  return Math.floor(Math.random() * n);
}

function showRandomQuotes() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    ref.quoteDisplay.textContent = 'No quotes available.';
    ref.newQuoteCategory.textContent = '';
    return;
  }

  const idx = randomIndex(quotes.length);
  const q = quotes[idx];

  ref.quoteDisplay.textContent = q.text;
  ref.newQuoteCategory.textContent = `Category: ${q.category}`;
}

function init() {
  loadQuotes();
  ref.quoteDisplay.textContent = 'Click "Show New Quote" to see a quote.';
  ref.newQuote.addEventListener('click', showRandomQuotes);
}

init();

function addQuote() {
  const text = ref.newQuoteTextInput.value.trim();
  const category = ref.newQuoteCategoryInput.value.trim();

  // simple validation
  if (text.length < 3) {
    ref.message.textContent = "Quote is too short.";
    ref.message.style.color = "red";
    return;
  }
  if (category.length < 2) {
    ref.message.textContent = "Category is too short.";
    ref.message.style.color = "red";
    return;
  }

  // create new quote object
  const newQuote = { text, category };

  // push to quotes array
  quotes.push(newQuote);

  // save to localStorage
  saveQuotes();

  // show success message
  ref.message.textContent = "Quote added successfully!";
  ref.message.style.color = "green";

  // clear inputs
  ref.newQuoteTextInput.value = '';
  ref.newQuoteCategoryInput.value = '';
}

ref.addQuoteBtn.addEventListener('click', addQuote);

function init() {
  loadQuotes();
  ref.quoteDisplay.textContent = 'Click "Show New Quote" to see a quote.';
  ref.newQuote.addEventListener('click', showRandomQuotes);
  ref.addQuoteBtn.addEventListener('click', addQuote);
}

init();
