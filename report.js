// --- SIDEBAR LOGIC ---
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('overlay').classList.add('visible');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('visible');
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
}

// --- MAIN REPORT LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const reportDisplay = document.getElementById("reportDisplay");
    const storyDisplay = document.getElementById("storyDisplay");
    
    // 1. DATA RETRIEVAL
    const budget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    // 2. CALCULATIONS
    const expenses = transactions.filter(t => t.type === "expense");
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpense = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const netSavings = totalIncome - totalExpense;
    const budgetStatus = budget - totalExpense;

    // --- DISCIPLINE CALCULATIONS (Based on Impulse Checkbox) ---
    const needsAmount = expenses
        .filter(t => t.isEssential !== false) // Treat as Need by default
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const wantsAmount = expenses
        .filter(t => t.isEssential === false) // Specifically marked as Impulse
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const disciplineScore = totalExpense > 0 
        ? Math.round((needsAmount / totalExpense) * 100) 
        : 100;

    // Generate Budget Status HTML
    let statusHTML = budget === 0 
        ? `<p class="expense">No budget set for this month.</p>`
        : budgetStatus >= 0 
            ? `<p class="income">Great! ₹${budgetStatus.toLocaleString()} remaining.</p>`
            : `<p class="expense">Alert: Over budget by ₹${Math.abs(budgetStatus).toLocaleString()}.</p>`;

    // Inject Summary into Top Card
    if (reportDisplay) {
        reportDisplay.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-box" style="border-left: 5px solid #ac3c45;">
                    <h4>Cash Flow</h4>
                    <p>Total Income: <span class="income">₹${totalIncome.toLocaleString()}</span></p>
                    <p>Total Spent: <span class="expense">₹${totalExpense.toLocaleString()}</span></p>
                    <p>Discipline Score: <strong style="font-size: 1.2rem;">${disciplineScore}%</strong></p>
                </div>
                <div class="form-box" style="border-left: 5px solid #3498db;">
                    <h4>Budget Tracking</h4>
                    <p>Monthly Limit: ₹${budget.toLocaleString()}</p>
                    ${statusHTML}
                </div>
            </div>
        `;
    }

    // 3. STORY SCROLL LOGIC (The Milestone System)
    let milestones = [];

    if (transactions.length > 0) {
        // Milestone 1: The First Step
        milestones.push({
            title: "The First Move",
            text: `Your journey began on ${transactions[0].date}. Taking that first step to track your money is the hardest part!`
        });

        // Milestone 2: Discipline Insight (Needs vs. Wants)
        if (expenses.length > 0) {
            milestones.push({
                title: "Needs vs. Impulses",
                text: `This month, you spent ₹${needsAmount.toLocaleString()} on essentials. Meanwhile, ₹${wantsAmount.toLocaleString()} went toward impulse wants.`
            });
        }

        // Milestone 3: Biggest Spending
        if (expenses.length > 0) {
            const biggest = expenses.reduce((prev, curr) => (parseFloat(prev.amount) > parseFloat(curr.amount)) ? prev : curr);
            milestones.push({
                title: "The Largest Transaction",
                text: `Your biggest single expense was ₹${biggest.amount.toLocaleString()} for "${biggest.desc}".`
            });
        }

        // Milestone 4: Savings Health
        if (netSavings > 0) {
            milestones.push({
                title: "Wealth Builder",
                text: `You finished the period with ₹${netSavings.toLocaleString()} in net savings. That's money building your future!`
            });
        } else if (netSavings < 0) {
            milestones.push({
                title: "Recovery Mode",
                text: `You spent more than you earned this month. Let's aim to flip that "Discipline Score" higher next month!`
            });
        }
    }

    // Conclusion Milestone
    milestones.push({
        title: "Journey Complete",
        text: "You've successfully reviewed your monthly habits. Ready to do it again?"
    });

    // Inject Milestones into the Timeline
    if (storyDisplay) {
        storyDisplay.innerHTML = ""; // Clear placeholders
        milestones.forEach(m => {
            const div = document.createElement("div");
            div.className = "story-point";
            div.innerHTML = `<h3>${m.title}</h3><p>${m.text}</p>`;
            storyDisplay.appendChild(div);
        });
    }

    // 4. INTERSECTION OBSERVER (Scroll Animations)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.story-point').forEach(point => {
        observer.observe(point);
    });
});

// --- UTILITY: RESET DATA ---
function resetData() {
    if (confirm("Are you sure? This will permanently delete all ExpenseFlow records.")) {
        localStorage.clear();
        window.location.href = 'index.html'; // Redirect to home after reset
    }
}