// =========================
// DASHBOARD MAIN SCRIPT
// =========================

// Saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

function initDashboard() {
    updateDateTime();
    setInterval(updateDateTime, 1000); // update setiap detik
    updateGreeting();
    loadUserData();
}

// =========================
// FUNGSI UTAMA
// =========================

// Menampilkan waktu dan tanggal
function updateDateTime() {
    const dateTimeElement = document.getElementById("currentDateTime");
    if (!dateTimeElement) return;

    const now = new Date();
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    };

    dateTimeElement.textContent = now.toLocaleString("en-US", options);
}

// Menampilkan sapaan berdasarkan waktu
function updateGreeting() {
    const userWelcomeName = document.getElementById("userWelcomeName");
    const userName = localStorage.getItem("userName") || "Guest";

    const hour = new Date().getHours();
    let greeting;

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    const greetingTitle = document.getElementById("welcome-title");
    if (greetingTitle && userWelcomeName) {
        userWelcomeName.textContent = userName;
        greetingTitle.textContent = `${greeting}, ${userName}! ✨`;
    }
}

// =========================
// Memuat data user dari localStorage (utama)
// =========================
function loadUserData() {
    // 🔹 Ambil data pengguna dari localStorage
    function loadUserData() {
    // 🔹 Ambil data pengguna dari localStorage
    const penggunaData = localStorage.getItem("penggunaLogin");
    const pengguna = penggunaData ? JSON.parse(penggunaData) : null;

    // 🔹 Masukkan ke elemen dashboard (nama, role, avatar) dengan default
    const userName = document.getElementById("userName");
    const userRole = document.getElementById("userRole");
    const userAvatar = document.getElementById("userAvatar");

    if (userName) userName.textContent = pengguna?.nama || "Guest";
    if (userRole) userRole.textContent = pengguna?.role || "Visitor";
    if (userAvatar) userAvatar.textContent = pengguna?.nama?.charAt(0).toUpperCase() || "G";

    // 🔹 Ganti sapaan di dashboard (biar <span> tetap ada)
    const welcomeTitle = document.querySelector(".welcome-title");
    if (welcomeTitle) {
        const hours = new Date().getHours();
        const greeting =
            hours < 12 ? "Good morning" :
            hours < 18 ? "Good afternoon" :
            "Good evening";

        welcomeTitle.innerHTML = `${greeting}, <span id="userWelcomeName">${pengguna?.nama || "Guest"}</span>! ✨`;
    }
}
}

// =========================
// FITUR TAMBAHAN (opsional)
// =========================

// Toggle sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar?.classList.toggle("open");
}

// Ganti tema light/dark
function setMode(mode) {
    document.body.setAttribute("data-mode", mode);
    localStorage.setItem("themeMode", mode); // simpan preferensi user

    const buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(btn => {
        btn.classList.toggle("active", btn.textContent.toLowerCase().includes(mode));
    });
}

// Saat halaman dimuat, ambil preferensi terakhir dari localStorage
document.addEventListener("DOMContentLoaded", () => {
    const savedMode = localStorage.getItem("themeMode") || "light"; // default: light
    document.body.setAttribute("data-mode", savedMode);

    // Tandai tombol aktif sesuai mode yang disimpan
    const buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(btn => {
        btn.classList.toggle("active", btn.textContent.toLowerCase().includes(savedMode));
    });
});

// Tampilkan dropdown tema
function toggleThemeDropdown() {
    const dropdown = document.getElementById("themeDropdown");
    dropdown?.classList.toggle("show");
}

// Berpindah antar mode (tab dashboard/focus/learning/play)
function switchMode(mode) {
    const tabs = document.querySelectorAll(".mode-tab");
    const contents = document.querySelectorAll(".mode-content");

    tabs.forEach(tab => tab.classList.toggle("active", tab.id.includes(mode)));
    contents.forEach(content => content.classList.toggle("active", content.id.includes(mode)));
}

// Aksi Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      window.location.href = "index.html"; // arahkan ke halaman login
    }
  });