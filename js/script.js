// Aksi Home
  document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
  });

  // Aksi Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      window.location.href = "index.html"; // arahkan ke halaman login
    }
  });