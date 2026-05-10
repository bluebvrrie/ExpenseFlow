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
    const heroTitle = document.querySelector(".hero-title");
    const subtitle = document.querySelector(".hero-subtitle");

    // Simple animation effect on load
    heroTitle.style.opacity = "0";
    heroTitle.style.transition = "opacity 1.5s ease-in, transform 1s ease-out";
    heroTitle.style.transform = "translateY(-20px)";

    setTimeout(() => {
        heroTitle.style.opacity = "1";
        heroTitle.style.transform = "translateY(0)";
    }, 100);

    // Dynamic Welcome Message based on existing data
    const budget = localStorage.getItem("monthlyBudget");
    if (budget) {
        subtitle.innerText = "Welcome back! Ready to check your progress?";
        const cta = document.querySelector(".cta-button");
        cta.innerText = "View Dashboard";
        cta.href = "dashboard.html";
    }
});

