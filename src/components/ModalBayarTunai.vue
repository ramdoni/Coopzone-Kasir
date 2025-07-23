<script>
import axios from 'axios';
export default ({
  data(){
    return {
      uang_tunai:'',
      uang_kembali:0,
      error:'',
      isSubmit:false,
      isFocus:"",
      totalWatch:0,
      isFocus:'',
      number: {
          decimal: '.',
          separator: ',',
          prefix: '',
          precision: 0,
          reverseFill: true
        },
    };
  },
  props: {
    total: Number,
    products: Array,
    modal: Object
  },
  created () {
    document.addEventListener("keydown", this.onKeydown);
    this.setFocus();
  },
  mounted(){
    document.addEventListener("keydown", this.onKeydown);
  },
  methods:{
    setFocus(){
      var uang_tunai = this.$refs.uang_tunai;
      if(uang_tunai){
        uang_tunai.focus();
        uang_tunai.value="";
        uang_tunai.focus();
      }else{
        console.log("Empty element uang_tunai");
      }
    },
    onKeydown(e){
      if(e.key=='F9'){
        this.setFocus();
      }
    },
    submit(){
      var uang_tunai_ = this.uang_tunai.replace(",", "");

      if(this.uang_tunai==0){
        this.error = "Uang tunai masih kosong";
        return;
      }
      if(uang_tunai_<this.total){
        this.error = "Uang tunai kurang";
        return;
      }
      this.isSubmit = true;
      axios.post(import.meta.env.VITE_API_URL + 'store-transaction', {
          token: import.meta.env.VITE_API_TOKEN,
          items: this.products,
          metode_pembayaran: 4, // Tunai
          uang_tunai: this.uang_tunai,
          uang_kembali: this.uang_kembali,
          total: this.total
        })
        .then(response => (this.transactionSuccess()))
        .catch(error=>{this.responseError(error)});
    },
    responseError(){
      alert(error);
      this.isSubmit = false;
    },
    transactionSuccess(){
      this.isSubmit = false;
      this.emitter.emit("modal-transaksi-done", true);
      this.$emit('clear-transaksi');
      // this.$emit('close-modal');
      window.location.href = '/kasir-coopzone';
    },
  },

  watch:{
    uang_tunai: function() {
      var uang_tunai_ = this.uang_tunai.replace(",", "");
      if(this.uang_tunai!=""){
        this.uang_kembali = uang_tunai_ - this.total;
      }
    }
  }
})
</script>
<template>
  <div class="widget__modal-container__item modal-container">
    <div class="modal-tunai" style="z-index:9999">
      <h4>Pembayaran Tunai</h4>
      <hr />
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
              <label>Uang Tunai</label>
              <input v-model="uang_tunai" v-number="number" id="uang_tunai" ref="uang_tunai" v-on:keyup.enter="submit" class="form-control" style="text-align:right;" />
              <!-- <vue-number v-model="uang_tunai" v-bind="number" id="uang_tunai" v-on:keyup.enter="submit" class="form-control" style="text-align:right;"></vue-number> -->
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
        </div>
        <hr />
        <div class="col-md-12">
          <div v-if="isSubmit">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            Submit Data
          </div>
          <div class="row">
            <div class="col-md-6">
              <button type="button" v-if="isSubmit==false" class="btn btn-success col-md-12" @click="submit">Submit</button>
            </div>
            <div class="col-md-6">
              <button type="button" v-if="isSubmit==false" @click="$emit('close-modal')" class="btn btn-danger col-md-12">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </template>