<script>
import axios from 'axios';
export default ({
  data(){
    return {
      uang_tunai:null,
      uang_kembali:0,
      error:'',
    };
  },
  props: {
    total: Number,
    products: Array,
    modal: Object
  },
  mounted(){
    document.getElementById("uang_tunai").focus();
  },
  methods:{
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
})
</script>
<template>
    <div class="modal-tunai">
      <h4>Pembayaran Tunai</h4>
      <hr />
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
              <label>Uang Tunai</label>
              <input type="number" class="form-control text-right" v-on:keyup.enter="submit" v-model="uang_tunai" style="text-align:right;" id="uang_tunai" />
          </div>
          <hr />
          <div class="form-group">
              <label>Uang Kembali</label>
              <h3>{{$filters.formatNumber(uang_kembali)}}</h3>
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
              <label>Total Belanja</label>
              <h3>{{$filters.formatNumber(total)}}</h3>
          </div>
          <hr />
          
        </div>
      </div>
    </div>
  </template>