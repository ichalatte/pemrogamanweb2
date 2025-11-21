const { createApp } = Vue;

createApp({
  data() {
    return {
      dataStok: dummyData.stok,
      upbjjList: dummyData.upbjjList,
      kategoriList: dummyData.kategoriList,

      form: {
        kodeLokasi: "",
        kodeBarang: "",
        namaBarang: "",
        jenisBarang: "",
        edisi: "",
        stok: "",
        cover: ""
      }
    };
  },

  methods: {
    hapusData(index) {
      this.dataStok.splice(index, 1);
    }
  }
}).mount("#app");
