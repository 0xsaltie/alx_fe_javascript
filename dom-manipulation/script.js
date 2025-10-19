// script.js - full reference

const STORAGE_KEY = 'myQuotes.v1';
let quotes = [];

const el = {
  quoteDisplay: document.getElementById('quoteDisplay'),
  quoteCategory: document.getElementById('quoteCategory'),
  randomBtn: document.getElementById('randomBtn'),
  showAddFormBtn: document.getElementById('showAddFormBtn'),
  addQuoteContainer: document.getElementById('addQuoteContainer'),
  exportBtn: document.getElementById('exportQuotes'),
  fileInput: document.getElementById('file'),
  importBtn: document.getElementById('importQuotes')

};

const defaultQuotes = [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Simplicity is the soul of efficiency.", category: "Productivity" },
  { text: "In the middle of difficulty lies opportunity.", category: "Resilience" }
];

function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Could not save quotes:', e);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      quotes = defaultQuotes.slice();
      saveQuotes();
    } else {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) quotes = parsed;
      else quotes = defaultQuotes.slice();
    }
  } catch (e) {
    console.error('Could not load quotes:', e);
    quotes = defaultQuotes.slice();
  }
}

function randomIndex(n) {
  return Math.floor(Math.random() * n);
}

function showRandomQuote() {
  if (!Array.isArray(quotes) || quotes.length === 0) {
    el.quoteDisplay.textContent = 'No quotes available. Add one below!';
    el.quoteCategory.textContent = '';
    return;
  }

  const idx = randomIndex(quotes.length);
  const q = quotes[idx];

  el.quoteCategory.textContent = q.category ? `Category: ${q.category}` : '';
  el.quoteDisplay.textContent = q.text;
}

function createAddQuoteForm(container) {
  container.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'add-quote-form';
  form.setAttribute('aria-label', 'Add Quote');

  const labelText = document.createElement('label');
  labelText.textContent = 'Quote text';
  labelText.htmlFor = 'quoteText';

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'quoteText';
  inputText.placeholder = "Type the quote here";
  inputText.required = true;

  const labelCat = document.createElement('label');
  labelCat.textContent = 'Category';
  labelCat.htmlFor = 'quoteCategory';

  const inputCat = document.createElement('input');
  inputCat.type = 'text';
  inputCat.id = 'quoteCategory';
  inputCat.placeholder = "e.g. Inspiration";
  inputCat.required = true;

  const controls = document.createElement('div');
  controls.style.marginTop = '8px';

  const addBtn = document.createElement('button');
  addBtn.type = 'submit';
  addBtn.textContent = 'Add Quote';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Cancel';

  const err = document.createElement('div');
  err.className = 'error';

  controls.appendChild(addBtn);
  controls.appendChild(cancelBtn);

  form.appendChild(labelText);
  form.appendChild(inputText);
  form.appendChild(labelCat);
  form.appendChild(inputCat);
  form.appendChild(controls);
  form.appendChild(err);

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    err.textContent = '';

    const text = (inputText.value || '').trim();
    const category = (inputCat.value || '').trim();

    if (text.length < 3) {
      err.textContent = 'Quote must be at least 3 characters.';
      return;
    }
    if (category.length < 2) {
      err.textContent = 'Category must be at least 2 characters.';
      return;
    }

    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();

    el.quoteCategory.textContent = `Category: ${newQuote.category}`;
    el.quoteDisplay.textContent = newQuote.text;

    container.innerHTML = '';
  });

  cancelBtn.addEventListener('click', function () {
    container.innerHTML = '';
  });

  container.appendChild(form);
  inputText.focus();

  return form;
}

function init() {
  loadQuotes();
  el.quoteDisplay.textContent = 'Click "Show Random" to see a quote.';
  el.quoteCategory.textContent = '';

  el.randomBtn.addEventListener('click', showRandomQuote);
  el.exportBtn.addEventListener('click', exportQuotes);
  el.importBtn.addEventListener('click', importQuotes);
  el.showAddFormBtn.addEventListener('click', function () {
    if (el.addQuoteContainer.children.length > 0) {
      el.addQuoteContainer.innerHTML = '';
    } else {
      createAddQuoteForm(el.addQuoteContainer);
    }
  });
}

function exportQuotes() {
  // convert quotes array to text
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  // create a hidden download link
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'quotes.json';

  // simulate a click to start download
  link.click();
}

function importQuotes() {
  const file = ref.fileInput.files[0];
  if (!file) {
    alert("Please select a file first!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid file format.");
      }
    } catch (err) {
      alert("Error reading file: " + err.message);
    }
  };

  reader.readAsText(file);
}


init();

// expose for easy testing
window.quoteManager = {
  showRandomQuote,
  createAddQuoteForm,
  getQuotes: () => quotes.slice(),
  addQuote: (text, category) => {
    const t = String(text || '').trim();
    const c = String(category || '').trim();
    if (!t || !c) return false;
    quotes.push({ text: t, category: c });
    saveQuotes();
    return true;
  }
};
