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
    // 1. FETCH DATA FROM LOCALSTORAGE
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    // 2. CALCULATE SUMMARY TOTALS
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        const amt = parseFloat(t.amount) || 0;
        if (t.type === "income") {
            totalIncome += amt;
        } else {
            totalExpense += amt;
        }
    });

    const balance = totalIncome - totalExpense;

    // 3. UPDATE DOM ELEMENTS (With Color Coding)
    const incomeEl = document.getElementById("income");
    const expenseEl = document.getElementById("expense");
    const balanceEl = document.getElementById("balance");

    if(incomeEl) incomeEl.innerText = `₹${totalIncome.toLocaleString()}`;
    if(expenseEl) expenseEl.innerText = `₹${totalExpense.toLocaleString()}`;
    
    if(balanceEl) {
        balanceEl.innerText = `₹${balance.toLocaleString()}`;
        // UID Feature: Red for negative, Green for positive
        balanceEl.style.color = balance < 0 ? "#ac3c45" : "#27ae60";
    }

    // 4. PIE CHART: EXPENSES BY CATEGORY
    const categoryData = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
        categoryData[t.category] = (categoryData[t.category] || 0) + parseFloat(t.amount);
    });

    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });

    // 5. LINE CHART: DAILY EXPENSE TREND (Ignores Income)
    const dailyExpenses = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
        dailyExpenses[t.date] = (dailyExpenses[t.date] || 0) + parseFloat(t.amount);
    });

    const ctxLine = document.getElementById('lineChart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: Object.keys(dailyExpenses),
            datasets: [{
                label: 'Daily Expenses (₹)',
                data: Object.values(dailyExpenses),
                borderColor: '#ac3c45',
                backgroundColor: 'rgba(172, 60, 69, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true,
                    ticks: { callback: (value) => '₹' + value.toLocaleString() }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `Expense: ₹${context.raw.toLocaleString()}`
                    }
                }
            }
        }
    });
});