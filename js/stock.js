const { createApp } = Vue;

createApp({
  data() {
    return {
      dataStok: dummyData.stok,              // data stok awal
      upbjjList: dummyData.upbjjList,        // daftar UT daerah
      kategoriSemua: dummyData.kategoriList, // semua kategori (fallback)
      toast: {
        show: false,
        message: ""
      },

      confirmModal: {
      show: false,
      message: "",
      indexToDelete: null},

      // FILTERS
      filterDaerah: "",
      filterKategori: "",
      filterStock: "",
      sortBy: "",

      // FORM TAMBAH
      form: {
        upbjj: "",
        kode: "",
        judul: "",
        kategori: "",
        lokasiRak: "",
        qty: "",
        safety: "",
        catatanHTML: ""
      },
      
      editForm: {},      // untuk form edit popup
      editIndex: null,   // baris mana yang sedang diedit
      showEditModal: false // kontrol popup

    };
  },

  computed: {
    // LIST KATEGORI TERGANTUNG UT-DAERAH
    kategoriList() {
      if (!this.filterDaerah) return [];
      const list = this.dataStok
        .filter(i => i.upbjj === this.filterDaerah)
        .map(i => i.kategori);
      return [...new Set(list)];
    },

    // HASIL FILTER + SORT
    filteredItems() {
      let data = [...this.dataStok];

      // FILTER UT DAERAH
      if (this.filterDaerah) {
        data = data.filter(i => i.upbjj === this.filterDaerah);
      }

      // FILTER KATEGORI (dependent)
      if (this.filterKategori) {
        data = data.filter(i => i.kategori === this.filterKategori);
      }

      // FILTER STOCK
      if (this.filterStock === "low") {
        data = data.filter(i => i.qty < i.safety && i.qty > 0);
      }

      if (this.filterStock === "zero") {
        data = data.filter(i => i.qty === 0);
      }

      // SORT
      if (this.sortBy === "judul") data.sort((a, b) => a.judul.localeCompare(b.judul));
      if (this.sortBy === "stock") data.sort((a, b) => a.qty - b.qty);
      if (this.sortBy === "harga") data.sort((a, b) => (a.harga || 0) - (b.harga || 0));

      return data;
    }
  },

watch: {
  // Watcher 1 — dependent filter
  filterDaerah(newVal) {
  this.filterKategori = "";
  if (newVal) {
    this.showToast(`📍 Filter UT-Daerah diubah menjadi: ${newVal}`);
  } else {
    this.showToast(`📍 Filter UT-Daerah di-reset`);
  }
},

  // Watcher 2 — perubahan sort
  sortBy(newVal) {
  if (newVal) {
    this.showToast(`🔃 Sort diubah menjadi: ${newVal}`);
  } else {
    this.showToast(`🔃 Sort di-reset`);
  }
},

  // Watcher 3 — pantau stok menipis
  dataStok: {
    handler(newVal) {
    const menipis = newVal.filter(i => i.qty < i.safety);

    if (menipis.length > 0) {
      const listKode = menipis.map(i => i.kode).join(", ");
      this.showToast(`⚠ Stok menipis untuk kode: ${listKode}`);
    }
  },
  deep: true
  }
},

  methods: {
    tambahData() {
      if (!this.form.kode || !this.form.judul) {
        alert("Kode dan Nama Barang wajib diisi!");
        return;
      }

      this.dataStok.push({
        kode: this.form.kode,
        judul: this.form.judul,
        kategori: this.form.kategori,
        upbjj: this.form.upbjj,
        lokasiRak: this.form.lokasiRak,
        qty: Number(this.form.qty),
        safety: Number(this.form.safety),
        catatanHTML: this.form.catatanHTML
      });

      // RESET FORM
      this.form = {
        upbjj: "",
        kode: "",
        judul: "",
        kategori: "",
        lokasiRak: "",
        qty: "",
        safety: "",
        catatanHTML: ""
      };
    },

    hapusData(index) {
      this.dataStok.splice(index, 1);
    },

    resetFilter() {
      this.filterDaerah = "";
      this.filterKategori = "";
      this.filterStock = "";
      this.sortBy = "";
    },

    showToast(msg) {
  this.toast.message = msg;
  this.toast.show = true;

  setTimeout(() => {
    this.toast.show = false;
  }, 3000); // hilang setelah 3 detik
  },

    // -------------------------------
    // BUKA POPUP EDIT
    // -------------------------------

    mulaiEdit(index) {
      this.editIndex = index;
      const item = this.dataStok[index];

      this.editForm = { ...item };

      this.showEditModal = true;
    },

    // -------------------------------
    // SIMPAN PERUBAHAN DARI POPUP
    // -------------------------------
    simpanEdit() {
      if (this.editIndex === null) return;

      this.dataStok[this.editIndex] = {
        kode: this.editForm.kode,
        judul: this.editForm.judul,
        kategori: this.editForm.kategori,
        upbjj: this.editForm.upbjj,
        lokasiRak: this.editForm.lokasiRak,
        qty: Number(this.editForm.qty),
        safety: Number(this.editForm.safety),
        catatanHTML: this.editForm.catatanHTML
      };

      this.showEditModal = false;
      this.editIndex = null;
    },

    batalEdit() {
      this.showEditModal = false;
      this.editIndex = null;
    },
      goHome() {
    // Misal arahkan ke halaman utama / index.html
    window.location.href = "index.html";
  },

    // Panggil sebelum hapus
  mintaKonfirmasiHapus(index) {
    const item = this.dataStok[index];
    this.confirmModal.message = `Apakah kamu yakin ingin menghapus "${item.judul}" dengan kode ${item.kode}?`;
    this.confirmModal.show = true;
    this.confirmModal.indexToDelete = index;
  },

  // Eksekusi hapus kalau dikonfirmasi
  konfirmasiHapus() {
    const index = this.confirmModal.indexToDelete;
    if (index !== null) {
      const item = this.dataStok[index];
      this.dataStok.splice(index, 1);
      this.showToast(`🗑️ Data "${item.judul}" berhasil dihapus`);
    }
    this.confirmModal.show = false;
    this.confirmModal.indexToDelete = null;
  },

  batalHapus() {
    this.confirmModal.show = false;
    this.confirmModal.indexToDelete = null;
    this.showToast(`❌ Penghapusan dibatalkan`);
  },


  }

  }).mount("#app");
