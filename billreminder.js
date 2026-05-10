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

// --- DATA PERSISTENCE ---
// Load existing bills from local storage on page load
let bills = JSON.parse(localStorage.getItem("bills")) || [];

// Initial display call to show saved bills immediately
document.addEventListener("DOMContentLoaded", () => {
    displayBills();
});

// --- MAIN FUNCTIONS ---

function addBill() {
    let name = document.getElementById("billName").value.trim();
    let amount = document.getElementById("billAmount").value;
    let category = document.getElementById("billCategory").value;
    let dueDate = document.getElementById("dueDate").value;
    let recurring = document.getElementById("recurring").value;

    if (name === "" || amount === "" || dueDate === "") {
        alert("Please fill all fields");
        return;
    }

    let bill = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        dueDate: dueDate,
        recurring: recurring,
        status: "Pending"
    };

    bills.push(bill);
    saveToStorage();
    displayBills();

    // Clear fields
    document.getElementById("billName").value = "";
    document.getElementById("billAmount").value = "";
    document.getElementById("dueDate").value = "";
}

function displayBills() {
    let billList = document.getElementById("billList");
    let filter = document.getElementById("filterStatus").value;

    billList.innerHTML = "";

    let filteredBills = bills.filter(function(bill) {
        if (filter === "All") return true;
        return bill.status === filter;
    });

    if (filteredBills.length === 0) {
        billList.innerHTML = `<p style="text-align:center; color:#999; margin-top:20px;">No bills found in this category.</p>`;
        return;
    }

    filteredBills.forEach(function(bill) {
        let today = new Date();
        let due = new Date(bill.dueDate);
        let timeDifference = due - today;
        let daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        let reminderMessage = "";
        if (bill.status === "Pending") {
            if (daysLeft === 0) reminderMessage = "Bill is due today!";
            else if (daysLeft > 0 && daysLeft <= 2) reminderMessage = `Due in ${daysLeft} day(s)!`;
            else if (daysLeft < 0) reminderMessage = "Bill is overdue!";
        }

        let statusClass = bill.status === "Paid" ? "status-paid" : "status-pending";

        billList.innerHTML += `
            <div class="card">
                <h2>${bill.name}</h2>
                <p><strong>Amount:</strong> ₹${parseFloat(bill.amount).toLocaleString()}</p>
                <p><strong>Category:</strong> ${bill.category}</p>
                <p><strong>Due Date:</strong> ${bill.dueDate}</p>
                <p><strong>Recurring:</strong> ${bill.recurring}</p>
                <p>
                    <strong>Status:</strong>
                    <span class="${statusClass}">${bill.status}</span>
                </p>
                <p class="alert-text">${reminderMessage}</p>
                <div class="bill-buttons">
                    ${bill.status === "Pending" ? 
                        `<button onclick="markPaid(${bill.id})" style="background:#27ae60; color:white; border:none; border-radius:5px; cursor:pointer;">Mark as Paid</button>` 
                        : ''}
                    <button onclick="deleteBill(${bill.id})" style="background:#666; color:white; border:none; border-radius:5px; cursor:pointer;">Delete</button>
                </div>
            </div>
        `;
    });
}

function markPaid(id) {
    let bill = bills.find(b => b.id === id);

    if (bill) {
        bill.status = "Paid";

        // Create Transaction for ExpenseFlow (Marked as a "Need")
        let newTransaction = {
            id: Date.now(),
            desc: bill.name + " (Bill)",
            amount: parseFloat(bill.amount),
            type: "expense",
            category: bill.category,
            isEssential: true, // Ensuring this counts toward a high Discipline Score
            date: new Date().toLocaleDateString()
        };

        // Save to Transactions
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(transactions));

        saveToStorage();
        displayBills();
        alert(`${bill.name} added to Transaction History as a Need.`);
    }
}

function deleteBill(id) {
    if (confirm("Remove this bill reminder?")) {
        bills = bills.filter(b => b.id !== id);
        saveToStorage();
        displayBills();
    }
}

// Utility to keep localStorage updated
function saveToStorage() {
    localStorage.setItem("bills", JSON.stringify(bills));
}