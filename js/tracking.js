function cariTracking() {
  const input = document.getElementById("nomorDOInput").value.trim();
  const hasilDiv = document.getElementById("hasilTracking");
  if (!input) {
    hasilDiv.innerHTML = "<p style='color:red;'>Masukkan nomor DO terlebih dahulu.</p>";
    return;
  }

  const data = dataTracking[input];
  if (!data) {
    hasilDiv.innerHTML = "<p style='color:red;'>Nomor DO tidak ditemukan.</p>";
    return;
  }


  let html = `
    <h2>Detail Pengiriman</h2>
    <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
    <p><strong>Nama Penerima:</strong> ${data.nama}</p>
    <p><strong>Status:</strong> ${data.status}</p>
    <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
    <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
    <p><strong>Kode Paket:</strong> ${data.paket}</p>
    <p><strong>Total:</strong> ${data.total}</p>
    <h3>Riwayat Perjalanan</h3>
    <div class="timeline">
  `;

  data.perjalanan.forEach(item => {
    html += `
      <div class="timeline-item">
        <div class="timeline-time">${item.waktu}</div>
        <div class="timeline-text">${item.keterangan}</div>
      </div>
    `;
  });

  html += `</div>`;
  hasilDiv.innerHTML = html;
}

// Optional: bind Enter key
document.addEventListener('DOMContentLoaded', function(){
  const inp = document.getElementById('nomorDOInput');
  inp.addEventListener('keydown', function(e){
    if (e.key === 'Enter') cariTracking();
  });
});
