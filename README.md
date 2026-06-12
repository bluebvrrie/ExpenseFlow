# ExpenseFlow
  A personal finance tracker for managing expenses, income, budgets, and recurring payments — all stored locally in the browser with no backend or account required.

# Pages
 File name & Purpose 
    dashboard.html -- Visual overview — income vs expense totals, charts
    index.html     -- login page
    report.html    -- Monthly Report
    report.js      -- Logic behind monthly reports
    tracker.html   -- Main tracker — add expenses, income, manage budgets and reminders 
    tracker.js     -- All tracker logic and state 
    tracker.css    -- Tracker styles and design tokens 

# Features

  📊 Monthly Budget
      Set a monthly spending budget and watch a live progress bar fill as you add expenses. The bar turns amber above 70% and red above 90%. Navigate between months with the arrow buttons to review past spending.

  ➕ Expense Logging
      Log expenses with an amount, optional note, category, and date. The category breakdown on the same page shows a mini bar chart of spending by category for the current month.

  💰 Income Tracking
      Record income from six sources — Salary, Freelance, Investment, Gift, Refund, or Other. Income entries appear in the recent transactions list with green `+₹` amounts and a source icon.

  🗂 Transaction History
      View the full transaction log with filters by category (including an "Income" filter) and sort by newest, oldest, or highest amount. Entries are grouped by date when sorted chronologically.

  📅 Debts & Reminders
      Track recurring obligations (EMIs, subscriptions, rent, personal debts) with a due day of month. Items due within three days are automatically flagged with a "Due soon" badge.

  🏷 Custom Categories
      Add custom expense categories with a name and emoji icon. Pick from a built-in emoji grid or type any emoji manually. Categories persist across sessions.

  📈 Dashboard
      A separate dashboard page reads the same localStorage data and displays:
      - Total Income — sum of all logged income entries
      - Total Expenses — sum of all logged expenses
      - Current Balance — income minus expenses
      - Pie chart — spending broken down by category
      - Line chart — daily expense history over time

# Data Storage
  All data is saved to `localStorage` under the key `spendbook-v1`. No data ever leaves the device — there is no server, no login, and no network calls.
  
  The data structure:
  {
    "budgets":    { "2025-06": 20000, "2025-07": 18000 },
    "expenses":   [{ "id": "tx-...", "amount": 450, "note": "Lunch", "catId": "food", "date": "2025-06-10" }],
    "incomes":    [{ "id": "inc-...", "amount": 50000, "source": "salary", "note": "June salary", "date": "2025-06-01" }],
    "categories": [{ "id": "food", "name": "Food", "icon": "🍔", "color": 0 }],
    "debts":      [{ "id": "debt-...", "name": "Netflix", "amount": 649, "due": 5, "type": "subscription" }]
  }

To clear all data: open browser DevTools → Application → Local Storage → delete `spendbook-v1`.

# File Structure

├── tracker.html        # Tracker app
├── tracker.js          # Tracker logic
├── tracker.css         # Tracker styles
├── dashboard.html      # Dashboard (self-contained, inline styles + Chart.js)
├── index.html          # Login
├── report.js           # Report logic
├── report.html         # Report 
├── media/
│   ├── homenav.jpg
│   └── dashback.jpg
│   ├── img1.jpeg
│   └── img2.jpeg
│   └── img3.jpeg
│   └── loginback.png
│   └── loginback2.jpg
│   └── reportnav.png
│   └── side.jpg
│   └── trackerback.jpg
└── README.md

# Design
  - Fonts — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (headings, numbers) and [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) (body, labels) via Google Fonts
  - Colour palette — deep crimson (`#8b2635`) as accent, forest green (`#2A7A4B`) for income/positive values, amber (`#B06A00`) for warnings
  - Glassmorphism cards — `backdrop-filter: blur` with semi-transparent backgrounds
  - Modals — bottom-sheet style, slide-up animation, close by tapping the overlay
  - Responsive — single-column layout on screens below 600px; the side-by-side action cards stack vertically on mobile

# Setup
    No build step. Just open the files in a browser or serve them from any static host.
    
  # Quickest local preview
      npx serve .
  
  # Or with Python
      python -m http.server 8000
  
  Then open `http://localhost:8000/tracker.html

# Browser Support
    Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires `localStorage` support — private/incognito browsing will not persist data between sessions.


    Thank You!!!
    Harinandana L
