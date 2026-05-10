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
// 1. Load goals from localStorage or start empty
let goals = JSON.parse(localStorage.getItem("goals")) || [];

// 2. Display goals immediately on page load
document.addEventListener("DOMContentLoaded", () => {
    displayGoals();
});

// 3. Helper function to save to localStorage
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

// --- MAIN FUNCTIONS ---

function addGoal() {
    let name = document.getElementById("goalName").value;
    let target = parseFloat(document.getElementById("targetAmount").value);
    let saved = parseFloat(document.getElementById("savedAmount").value) || 0;
    let deadline = document.getElementById("deadline").value;

    if (name === "" || !target || deadline === "") {
        alert("Please fill all required fields");
        return;
    }

    let goal = {
        id: Date.now(),
        name: name,
        target: target,
        saved: saved,
        deadline: deadline,
        status: saved >= target ? "Completed" : "Pending"
    };

    goals.push(goal);
    saveGoals(); // Save change
    displayGoals();

    // Clear Inputs
    document.getElementById("goalName").value = "";
    document.getElementById("targetAmount").value = "";
    document.getElementById("savedAmount").value = "";
    document.getElementById("deadline").value = "";
}

function displayGoals() {
    let goalList = document.getElementById("goalList");
    let filter = document.getElementById("filterGoals").value;

    goalList.innerHTML = "";

    let filteredGoals = goals.filter(function(goal) {
        if (filter === "All") return true;
        return goal.status === filter;
    });

    filteredGoals.forEach(function(goal) {
        let progress = ((goal.saved / goal.target) * 100).toFixed(1);
        let remaining = goal.target - goal.saved;
        let today = new Date();
        let dueDate = new Date(goal.deadline);
        let timeDifference = dueDate - today;
        let daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        let alertMessage = "";
        if (goal.status === "Pending") {
            if (daysLeft === 0) alertMessage = "Goal deadline is today!";
            else if (daysLeft > 0 && daysLeft <= 7) alertMessage = `Only ${daysLeft} day(s) left!`;
            else if (daysLeft < 0) alertMessage = "Goal deadline passed!";
        }

        let statusClass = goal.status === "Completed" ? "completed" : "pending";

        goalList.innerHTML += `
            <div class="card">
                <h2>${goal.name}</h2>
                <p><strong>Target Amount:</strong> ₹${goal.target.toLocaleString()}</p>
                <p><strong>Saved Amount:</strong> ₹${goal.saved.toLocaleString()}</p>
                <p><strong>Remaining Amount:</strong> ₹${remaining > 0 ? remaining.toLocaleString() : 0}</p>
                <p><strong>Deadline:</strong> ${goal.deadline}</p>
                <p><strong>Status:</strong> <span class="${statusClass}">${goal.status}</span></p>

                <div class="progress-bar" style="background:#eee; border-radius:10px; height:15px; margin:10px 0;">
                    <div class="progress" style="width:${progress}%; background:#27ae60; height:100%; border-radius:10px; transition:width 0.5s;"></div>
                </div>
                <p>${progress}% Completed</p>

                <div class="plant-container" style="text-align:center; padding:15px; background:#f9f9f9; border-radius:8px; margin:10px 0;">
                    <div class="plant" style="font-size:2rem;">${getPlant(progress)}</div>
                    <p style="font-size:0.85rem; color:#555;">${getPlantMessage(progress)}</p>
                </div>

                <p class="goal-alert" style="color:#ac3c45; font-weight:bold;">${alertMessage}</p>

                <input type="number" id="save-${goal.id}" placeholder="Add savings" style="margin-top:10px;">
                <div class="goal-buttons" style="display:flex; gap:10px; margin-top:10px;">
                    <button onclick="addSavings(${goal.id})" style="flex:1;">Add Savings</button>
                    <button onclick="deleteGoal(${goal.id})" style="flex:1; background:#666;">Delete</button>
                </div>
            </div>
        `;
    });
}

function addSavings(id) {
    let amountInput = document.getElementById(`save-${id}`);
    let amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
        alert("Enter a valid amount");
        return;
    }

    let goal = goals.find(g => g.id === id);
    if (goal) {
        goal.saved += amount;
        if (goal.saved >= goal.target) {
            goal.status = "Completed";
            alert("Congratulations! Goal Achieved 🌸");
        }
        saveGoals(); // Save change
        displayGoals();
    }
}

function deleteGoal(id) {
    if (confirm("Remove this goal?")) {
        goals = goals.filter(g => g.id !== id);
        saveGoals(); // Save change
        displayGoals();
    }
}

// --- UTILITY FUNCTIONS ---

function getPlant(progress) {
    progress = Number(progress);
    if (progress < 25) return "🌱";
    if (progress < 50) return "🪴";
    if (progress < 75) return "🌿";
    if (progress < 100) return "🌳";
    return "🌸";
}

function getPlantMessage(progress) {
    progress = Number(progress);
    if (progress < 25) return "Your savings journey has started!";
    if (progress < 50) return "Your plant is growing!";
    if (progress < 75) return "Great progress!";
    if (progress < 100) return "Almost fully grown!";
    return "Goal achieved! Your plant bloomed 🌸";
}