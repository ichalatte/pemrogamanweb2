const { createApp } = Vue;

createApp({
  data() {
    return {
      // Ambil semua data dari dummyData
      upbjjList: dummyData.upbjjList,
      paketList: dummyData.paket,
      ekspedisiList: dummyData.pengirimanList.map(x => x.nama),

      // Gabungkan DO lama dari dummyData.tracking + DO baru dari localStorage
      daftarDO: (() => {
        const localDO = JSON.parse(localStorage.getItem("doList") || "[]");

        const defaultDO = Object.entries(dummyData.tracking).map(([nomor, d]) => ({
          nomor: nomor,
          nim: d.nim,
          nama: d.nama,
          ekspedisi: d.ekspedisi,
          upbjj: "",
          paketKode: d.paket,
          paketNama: dummyData.paket.find(p => p.kode === d.paket)?.nama || "-",
          tanggalKirim: d.tanggalKirim,
          totalHarga: d.total,
          status: d.status,
          perjalanan: d.perjalanan
        }));

        return [...defaultDO, ...localDO];
      })(),

      // FORM
      form: {
        nim: "",
        nama: "",
        upbjj: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: ""
      },

      // UI states
      toast: { show: false, message: "", type: "" },

confirmModal: {
  show: false,
  message: '',
  index: null
},

      search: "",
      filterUpbjj: "",
      filterStatus: "",
      sortBy: "",
      detailOpen: false,
      detail: null
    };
  },

  computed: {
    generatedDO() {
      const year = new Date().getFullYear();
      const seq = (this.daftarDO.filter(d => d.nomor.includes(year)).length + 1)
        .toString()
        .padStart(4, "0");

      return `DO${year}-${seq}`;
    },

    selectedPaket() {
      return this.paketList.find(p => p.kode === this.form.paketKode) || null;
    },

    displayHarga() {
      return this.selectedPaket
        ? this.formatRupiah(this.selectedPaket.harga)
        : "-";
    },

    filteredDOs() {
      let data = [...this.daftarDO];

      if (this.filterUpbjj)
        data = data.filter(d => d.upbjj === this.filterUpbjj);

      if (this.filterStatus)
        data = data.filter(d => d.status === this.filterStatus);

      if (this.search) {
        const q = this.search.toLowerCase();
        data = data.filter(
          d =>
            d.nomor.toLowerCase().includes(q) ||
            d.nama.toLowerCase().includes(q) ||
            d.nim.toLowerCase().includes(q)
        );
      }

      if (this.sortBy === "nomor")
        data.sort((a, b) => a.nomor.localeCompare(b.nomor));

      if (this.sortBy === "tanggal")
        data.sort((a, b) => new Date(a.tanggalKirim) - new Date(b.tanggalKirim));

      if (this.sortBy === "harga")
        data.sort((a, b) => a.totalHarga - b.totalHarga);

      return data;
    },

    displayedDOs() {
      return this.filteredDOs;
    }
  },

  watch: {
    daftarDO: {
      handler(newVal) {
        // HANYA simpan DO baru, bukan DO bawaan dummyData
        const newDO = newVal.filter(
          d => !dummyData.tracking[d.nomor]
        );
        localStorage.setItem("doList", JSON.stringify(newDO));
      },
      deep: true
    }
  },

  methods: {
    formatRupiah(v) {
      if (typeof v !== "number") return v;
      return "Rp " + v.toLocaleString("id-ID");
    },

    setToday() {
      const today = new Date().toISOString().slice(0, 10);
      this.form.tanggalKirim = today;
      this.showToast("Tanggal kirim otomatis diatur ke hari ini", "info");
    },

    validateForm() {
      if (!this.form.nim || !this.form.nama || !this.form.ekspedisi || !this.form.paketKode) {
        this.showToast("Isi semua field wajib!", "warn");
        return false;
      }
      return true;
    },

    statusClass(s) {
      if (s === 'Diproses') return 'diproses';
      if (s === 'Dikirim') return 'dikirim';
      if (s === 'Diterima') return 'diterima';
      return '';
    },

    tambahDO() {
      if (!this.validateForm()) return;

      if (!this.form.tanggalKirim) this.setToday();

      const paket = this.selectedPaket;

      const newDO = {
        nomor: this.generatedDO,
        nim: this.form.nim,
        nama: this.form.nama,
        upbjj: this.form.upbjj || "",
        ekspedisi: this.form.ekspedisi,
        paketKode: paket?.kode || this.form.paketKode,
        paketNama: paket?.nama || "-",
        tanggalKirim: this.form.tanggalKirim,
        totalHarga: paket?.harga || 0,
        status: "Diproses",
        perjalanan: [
          { waktu: this.form.tanggalKirim, keterangan: "Order diterima" },
          { waktu: this.form.tanggalKirim, keterangan: "Diproses di gudang" }
        ]
      };

      this.daftarDO.push(newDO);
      this.showToast(`DO ${newDO.nomor} berhasil ditambahkan`, "success");
      this.resetForm();
    },

    resetForm() {
      this.form = {
        nim: "",
        nama: "",
        upbjj: "",
        ekspedisi: "",
        paketKode: "",
        tanggalKirim: ""
      };
    },

    hapusDO(i) {
      const no = this.daftarDO[i].nomor;
      this.daftarDO.splice(i, 1);
      this.showToast(`DO ${no} berhasil dihapus`, "warn");
    },

    nextStatus(i) {
      const d = this.daftarDO[i];
      if (!d) return;

      const today = new Date().toISOString().slice(0, 10);

      if (d.status === "Diproses") {
        d.status = "Dikirim";
        d.perjalanan.push({ waktu: today, keterangan: "Paket dikirim" });
      } else if (d.status === "Dikirim") {
        d.status = "Diterima";
        d.perjalanan.push({ waktu: today, keterangan: "Paket diterima" });
      }

      this.showToast(`Status DO berubah: ${d.status}`, "info");
    },

    openDetail(d) {
      this.detail = d;
      this.detailOpen = true;
    },

    closeDetail() {
      this.detail = null;
      this.detailOpen = false;
    },

    defaultPerjalanan(d) {
      return d.perjalanan?.length
        ? d.perjalanan
        : [{ waktu: d.tanggalKirim, keterangan: "Order masuk" }];
    },

    showToast(message, type = "info") {
      this.toast.message = message;
      this.toast.type = type;
      this.toast.show = true;

      clearTimeout(this._timeout);
      this._timeout = setTimeout(() => (this.toast.show = false), 3000);
    },

    goHome() {
    // Misal arahkan ke halaman utama / index.html
    window.location.href = "index.html";
  },

  // --- MINTA KONFIRMASI ---
mintaKonfirmasiHapus(index) {
  const d = this.displayedDOs[index];
  this.confirmModal.message = `Apakah kamu yakin ingin menghapus DO ${d.nomor} atas nama ${d.nama}?`;
  this.confirmModal.index = index;
  this.confirmModal.show = true;
},
konfirmasiHapus() {
  this.hapusDO(this.confirmModal.index);
  this.confirmModal.show = false;
},
batalHapus() {
  this.confirmModal.show = false;
},

// --- BATAL ---
batalHapus() {
  this.confirmModal.show = false;
  this.confirmModal.indexToDelete = null;
  this.showToast(`Penghapusan dibatalkan`, "info");
},

  }
}).mount("#app");
