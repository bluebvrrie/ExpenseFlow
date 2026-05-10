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

// --- DYNAMIC MESSAGE LOGIC ---
function toggleImpulseMessage() {
    const isWant = document.getElementById("isWant").checked;
    const warning = document.getElementById("impulseWarning");
    warning.style.display = isWant ? "block" : "none";
}

// --- MAIN TRANSACTION LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const txForm = document.getElementById("txForm");
    renderTable();

    txForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const desc = document.getElementById("desc").value.trim();
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;
        const isWant = document.getElementById("isWant").checked;

        if (desc === "" || isNaN(amount) || amount <= 0) {
            alert("Please provide a valid description and a positive amount.");
            return;
        }

        const newTransaction = {
            id: Date.now(),
            desc,
            amount,
            type,
            category,
            // If it is a "Want", it is NOT essential (false). Otherwise, true.
            isEssential: isWant ? false : true, 
            date: new Date().toLocaleDateString()
        };

        saveTransaction(newTransaction);
        
        txForm.reset();
        toggleImpulseMessage(); // Hide warning after reset
        renderTable();
        showTxPopup();
    });
});

function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTable() {
    const tableBody = document.getElementById("tableBody");
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    
    if (transactions.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:#999;">No history found.</td></tr>`;
        return;
    }
    tableBody.innerHTML = "";

    transactions.forEach(t => {
        const row = document.createElement("tr");
        const amountColor = t.type === "income" ? "#27ae60" : "#ac3c45";
        
        // EYE-CATCHING TAGS
        const priorityTag = t.isEssential 
            ? `<span style="color:#27ae60; font-weight:bold;">Need</span>`
            : `<span style="color:#ac3c45; font-weight:bold; border:2px solid #ac3c45; padding:2px 6px; border-radius:4px; font-size:0.75rem;"> IMPULSE</span>`;

        row.innerHTML = `
            <td>${t.desc}</td>
            <td style="color: ${amountColor}; font-weight: bold;">₹${t.amount.toLocaleString()}</td>
            <td style="text-transform: capitalize;">${t.type}</td>
            <td>${t.category}</td>
            <td>${priorityTag}</td>
            <td>
                <button onclick="deleteTransaction(${t.id})" 
                        style="width:auto; padding:5px 10px; background:#666; color:white; border:none; border-radius:4px; cursor:pointer;">
                    Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteTransaction(id) {
    if (confirm("Permanently delete this record?")) {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions = transactions.filter(t => t.id !== id);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        renderTable();
    }
}

// --- POPUP ANIMATIONS ---
function showTxPopup() {
    const overlay = document.getElementById('txOverlay');
    const popup = document.getElementById('txPopup');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
    popup.style.transform = 'scale(1)';
}

function closeTxPopup() {
    const overlay = document.getElementById('txOverlay');
    const popup = document.getElementById('txPopup');
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    popup.style.transform = 'scale(0.88)';
}