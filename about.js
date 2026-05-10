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
    const memberNames = document.querySelectorAll(".member-name");

    memberNames.forEach(name => {
        // When mouse enters the name
        name.addEventListener("mouseenter", () => {
            name.style.transition = "all 0.3s ease";
            name.style.transform = "scale(1.1)"; // Slightly enlarges the name
            name.style.textShadow = "2px 2px 10px rgba(172, 60, 69, 0.4)"; // Adds a glow
            name.style.cursor = "pointer";
        });

        // When mouse leaves the name
        name.addEventListener("mouseleave", () => {
            name.style.transform = "scale(1)";
            name.style.textShadow = "none";
        });
    });
});