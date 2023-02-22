<script>
import axios from 'axios';
export default ({
  data(){
    return {
      no_anggota:'',
      listAnggota:[],
      uang_tunai:0,
      uang_kembali:0,
      error:'',
    };
  },
  // emits:["finishTransaction"],
  props: {
    total: Number,
    products: Array,
    modal: Object
  },
  created () {
    this.loadAnggota();
  },
  methods:{
    loadAnggota(){
      this.$nextTick(function () {
        axios.post(import.meta.env.VITE_API_URL + 'get-anggota', {
          token: import.meta.env.VITE_API_TOKEN,
          all_data:1
        })
        .then(response => (this.listAnggota = response.data.items))
        .catch(function (error) { console.log(error);});
      });
    },
    submit(){
      if(this.uang_tunai==0){
        this.error = "Uang tunai masih kosong";
        return;
      }
      axios.post(import.meta.env.VITE_API_URL + 'store-transaction', {
          token: import.meta.env.VITE_API_TOKEN,
          items: this.products,
          metode_pembayaran: 4, // Tunai
          uang_tunai: this.uang_tunai,
          uang_kembali: this.uang_kembali,
          total: this.total
        })
        .then(response => (this.transactionSuccess()))
        .catch(function (error) { console.log(error);});
    },
    transactionSuccess(){
      this.emitter.emit("modal-transaksi-done", true);
    }
  },
  watch: {
    uang_tunai(){
      if(this.uang_tunai>0){
        this.uang_kembali = this.uang_tunai - this.total;
      }
    }
  }
});
</script>
<template>
    <div class="modal-tunai">
      <h4>Pembayaran Kredit</h4>
      <hr />
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Anggota</label>
            <vue3-simple-typeahead
              v-model="no_anggota"
              id="no_anggota"
              placeholder=""
              :items="listAnggota"
              :minInputLength="1"
              @selectItem="selectItem"
              class="form-control"
              ref="typeahead"
              :itemProjection="
                  (item) => {
                    return item.text;
                  }">
            </vue3-simple-typeahead>
          </div>
          <hr />
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary" style="width: 200px">Bayar</button>
      </div>
    </div>
  </template>