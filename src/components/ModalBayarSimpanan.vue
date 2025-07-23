<script>
import axios from 'axios';
export default ({
  data(){
    return {
      jenisSimpanan:'',
      userMemberId: '',
      listAnggota:[],
      error:'',
      isSubmit:false,
      isFocus:"",
      totalWatch:0,
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
  },
  created () {
  },
  mounted(){
    this.loadAnggota();
  },
  methods:{
    submit(){
      if(this.uang_tunai==0){
        this.error = "Uang tunai masih kosong";
        return;
      }
      if(this.uang_tunai<this.total){
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
    responseError(){
      alert(error);
      this.isSubmit = false;
    },
    transactionSuccess(){
      this.isSubmit = false;
      this.emitter.emit("modal-transaksi-done", true);
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
      <h4>Pembayaran Simpanan</h4>
      <hr />
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-6">
          <div class="form-group">
              <label>Anggota</label>
              <select class="form-control" v-model="userMemberId">
                <option value=""> -- Pilih -- </option>
              </select>
          </div>
          <hr />
        </div>
        <div class="col-6">
          <div class="form-group">
              <label>Jenis Simpanan</label>
              <select class="form-control" v-model="jenisSimpanan">
                <option value=""> -- Pilih -- </option>
                <option value="simpanan_pokok">Simpanan Pokok</option>
                <option value="simpanan_wajib">Simpanan Wajib</option>
                <option value="simpanan_sukarela">Simpanan Sukarela</option>
              </select>
          </div>
          <hr />
        </div>
        <div class="col-6">
          <div class="form-group">
              <label>Nominal</label>
              <input type="number" class="form-control" />
          </div>
          <hr />
        </div>
        <div v-if="jenisSimpanan=='simpanan_pokok'" class="col-md-12 alert alert-info" role="alert">
          <small>Adalah simpanan yang disertakan anggota pada awal anggota tersebut masuk menjadi anggota. Simpanan pokok ini dibayarkan satu kali dan dapat diambil saat keluar dari anggota</small>
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
              <button type="button" v-if="isSubmit==false" class="btn btn-success col-md-12" @click="submit">Tambah</button>
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