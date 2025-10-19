const STORAGE_KEY = 'quotes';
let quotes = [];

const el = {
  quoteDisplay: document.getElementById('quoteDisplay'),
  quoteCategory: document.getElementById('quoteCategory'),
  randomBtn: document.getElementById('randomBtn'),
  showAddFormBtn: document.getElementById('showAddFormBtn'),
  addQuoteContainer: document.getElementById('addQuoteContainer'),
  exportBtn: document.getElementById('exportQuotes'),
  fileInput: document.getElementById('file'),
  importBtn: document.getElementById('importQuotes'),
  newQuoteCategory: document.getElementById('newQuoteCategory'),
  newQuoteBtn : document.getElementById('newQuote'),
  categoryFilter : document.getElementById('categoryFilter')

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


function showRandomQuotes() {
  const selectedCategory = ref.categoryFilter.value;

  // Filter quotes based on the selected category
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  // Handle case when there are no quotes in that category
  if (filteredQuotes.length === 0) {
    ref.quoteDisplay.textContent = 'No quotes available in this category.';
    ref.newQuoteCategory.textContent = '';
    return;
  }

  // Choose a random quote
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];

  // Display it
  ref.quoteDisplay.textContent = quote.text;
  ref.newQuoteCategory.textContent = `Category: ${quote.category}`;
}

function filterQuotes() {
  const selected = ref.categoryFilter.value;
  localStorage.setItem('selectedCategory', selected); // Save choice
  showRandomQuotes(); // Immediately show a quote from that category
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


function populateCategories () {

    //reset the dropdoown to include only the 'All categories' option

    el.categoryFilter.innerHTML = '<option value="all">All categories</option>';

     // Get unique categories from your quotes array
  const categories = [...new Set(quotes.map(q => q.category))];

  // Add each category as an option
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    ref.categoryFilter.appendChild(option);
  });

  // Restore saved category filter if it exists
  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    ref.categoryFilter.value = savedFilter;
  }
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


function init() {
  loadQuotes();              // Load quotes from localStorage or defaults
  populateCategories();  // Build the dropdown

  // Show a message initially
  ref.quoteDisplay.textContent = 'Click "Show New Quote" to see a quote.';

  // Add event listeners
  ref.newQuoteBtn.addEventListener('click', showRandomQuotes);
}
init();


const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";
// Simulate fetching quotes from the "server"
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL,
         {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    const data = await response.json();
 
    console.log("Server accepted new quote:", data);

    notifyUser("Quote synced with server!");
    // Simulate server quotes (just take first few and reshape them)
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    console.log("Fetched from server:", serverQuotes);
    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

const newQuote = { text, category };
quotes.push(newQuote);
saveQuotes();

postQuoteToServer(newQuote); // ✅ send new quote to server

async function syncWithServer() {
  console.log("Syncing with server...");

  const serverQuotes = await fetchQuotesFromServer();

  // Simple conflict resolution: server data wins
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);

    if (!exists) {
      quotes.push(serverQuote);
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
    notifyUser("Quotes updated from server!");
  } else {
    console.log("No new quotes found during sync.");
  }
}

// Run sync every 30 seconds
setInterval(syncWithServer, 30000);

if (exists) {
  const localQuote = quotes.find(q => q.text === serverQuote.text);
  if (localQuote.category !== serverQuote.category) {
    // Conflict — resolve by server taking precedence
    localQuote.category = serverQuote.category;
    updated = true;
  }
}

function notifyUser(message) {
  const note = document.getElementById("notification");
  note.textContent = message;

  setTimeout(() => {
    note.textContent = "";
  }, 5000); // clear after 5 seconds
}

document.getElementById("manualSync").addEventListener("click", syncWithServer);
