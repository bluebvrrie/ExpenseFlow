//sidebar
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('visible');
  //document.getElementById('menuBtn').style.display = 'none';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('visible');
  //document.getElementById('menuBtn').style.display = 'block';
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar.classList.contains('open')) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

document.addEventListener("DOMContentLoaded", () => {
    const budgetInput = document.getElementById("budgetInput");
    const setBudgetBtn = document.getElementById("setBudgetBtn");
    
    // 1. INITIALIZE UI ON LOAD
    updateBudgetDisplay();

    // 2. EVENT HANDLING FOR SETTING BUDGET
    setBudgetBtn.addEventListener("click", () => {
        const amount = parseFloat(budgetInput.value);

        // 3. FORM VALIDATION[cite: 3, 11]
        if (isNaN(amount) || amount <= 0) {
            alert("Please enter a valid monthly budget amount.");
            return;
        }

        // SAVE TO LOCAL STORAGE
        localStorage.setItem("monthlyBudget", amount);
        
        // CLEAR INPUT AND REFRESH DISPLAY
        budgetInput.value = "";
        updateBudgetDisplay();
        alert("Monthly budget updated successfully!");
    });
});

function updateBudgetDisplay() {
    // FETCH DATA[cite: 6, 7]
    const budget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    // CALCULATE TOTAL SPENT (Filtering only expenses)[cite: 6, 7]
    const spent = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const remaining = budget - spent;
    const percent = budget > 0 ? (spent / budget) * 100 : 0;

    // 4. DOM MANIPULATION[cite: 3, 11]
    const displayLimit = document.getElementById("displayLimit");
    const progress = document.getElementById("progress");
    const statusMsg = document.getElementById("statusMsg");

    if (displayLimit) displayLimit.innerText = `₹${budget.toLocaleString()}`;
    
    if (progress) {
        progress.style.width = Math.min(percent, 100) + "%";
        
        // VISUAL FEEDBACK BASED ON BUDGET STATUS
        if (percent >= 100) {
            progress.style.background = "#e74c3c"; // Red
            statusMsg.innerHTML = "⚠ <strong>Budget Exceeded!</strong> You have overspent.";
            statusMsg.style.color = "#e74c3c";
        } else if (percent >= 80) {
            progress.style.background = "#f39c12"; // Orange
            statusMsg.innerHTML = "⚠ <strong>Warning:</strong> You have used over 80% of your budget.";
            statusMsg.style.color = "#f39c12";
        } else {
            progress.style.background = "#27ae60"; // Green
            statusMsg.innerHTML = "✔ Your spending is within the healthy range.";
            statusMsg.style.color = "#27ae60";
        }
    }

    // Update individual labels if they exist in your HTML[cite: 3]
    if(document.getElementById("spent")) document.getElementById("spent").innerText = spent;
    if(document.getElementById("remaining")) document.getElementById("remaining").innerText = remaining;
}