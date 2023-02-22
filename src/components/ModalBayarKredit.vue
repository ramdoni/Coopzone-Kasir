<script>
import axios from 'axios';
export default ({
  data(){
    return {
      no_anggota:'',
      listAnggota:[],
      anggota:null,
      error:'',
      focusKeyboard:null,
    };
  },
  props: {
    total: Number,
    products: Array,
    modal: Object
  },
  created () {
    this.loadAnggota();
  },
  mounted(){
    document.addEventListener("keydown", this.onKeydown);
    document.getElementById("no_anggota").focus();
  },
  methods:{
    onKeydown(e){
      if(e.key=='F8'){
        this.onFocus();
      }
      if(e.key=='Enter' && this.focusKeyboard==null && this.total>0){
        this.submit();
      }
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
    onFocus(){
      this.no_anggota=null;this.anggota=null;this.focusKeyboard='F8';
      setTimeout(function(){
        document.getElementById("no_anggota").value="";
      },500);
    },
    submit(){
      if(this.anggota==null){
        this.error = "Anggota harus diisi.";
        return;
      }
      if(this.total==0){
        this.error = "Produk harus diisi.";
        return;
      }
      if(this.total>this.anggota.saldo){
        this.error = "Saldo tidak mencukupi.";
        return;
      }

      axios.post(import.meta.env.VITE_API_URL + 'store-transaction', {
          token: import.meta.env.VITE_API_TOKEN,
          items: this.products,
          metode_pembayaran: 3, // Kredit atau Bayar Nanti
          total: this.total,
          anggota_id: this.anggota.id
        })
        .then(response => (this.transactionSuccess(response.data)))
        .catch(function (error) { console.log(error);});
    },
    selectItem(item){
      this.anggota = item;
      setTimeout(()=>{
        this.focusKeyboard=null;
      },500);
    },
    transactionSuccess(data){
      if(data.status=='failed'){
        this.error = data.message;
        return;
      }
      this.anggota=null;this.no_anggota=null;
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
            <label>Nomor / Nama Anggota (F8)</label>
            <vue3-simple-typeahead
              v-model="no_anggota"
              id="no_anggota"
              placeholder=""
              :items="listAnggota"
              :minInputLength="1"
              @focus="onFocus"
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
        <div class="col-md-12 row" v-if="anggota!==null">
          <div class="form-group col-md-8"> 
            <small>No / Nama  Anggota</small><br />
            <h5>{{anggota.no_anggota}} / {{anggota.nama}}</h5>
            <hr />
          </div>
          <div class="form-group col-md-4">
            <small>Sisa Saldo </small><br />
            <h5>Rp. {{$filters.formatNumber(anggota.saldo)}}</h5>
            <hr />
          </div>
        </div>
        
      </div>
      <div class="clearfix"></div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary" style="width: 200px">Bayar (Enter)</button>
      </div>
    </div>
  </template>