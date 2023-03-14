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
      isPrint:false,
      isFocus:"",
      isSubmit:false
    };
  },
  props: {
    total: Number,
    products: Array,
    modal: Object
  },
  created () {
    document.addEventListener("keydown", this.onKeydown);
  },
  mounted(){
    this.loadAnggota();
    document.addEventListener("keydown", this.onKeydown);
  },
  methods:{
    setFocus(){
      this.no_anggota=null;this.anggota=null;this.focusKeyboard='F8';
      document.getElementById("no_anggota").value="";
      setTimeout(function(){
        document.getElementById("no_anggota").focus();
      },500)
    },
    onKeydown(e){
      if(e.key=='F8'){
        this.setFocus();
      }
      if(e.key=='Enter' && this.focusKeyboard==null && this.total>0){
        this.submit();
      }
      this.focusKeyboard = e.key;
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
    submitAndPrint(){
      this.isPrint = true;
      this.submit();
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
      this.isSubmit=true;
      axios.post(import.meta.env.VITE_API_URL + 'store-transaction', {
          token: import.meta.env.VITE_API_TOKEN,
          items: this.products,
          metode_pembayaran: 3, //Kredit atau Bayar Nanti
          total: this.total,
          anggota_id: this.anggota.id
        })
        .then(response => (this.transactionSuccess(response.data)))
        .catch(error=> { });
    },
    transactionFailed(error){
      this.isSubmit=false;
      this.error = error;
    },
    selectItem(item){
      this.anggota = item;
      setTimeout(()=>{
        this.focusKeyboard=null;
      },500);
    },
    transactionSuccess(data){
      this.isSubmit=false;
      if(data.status=='failed'){
        this.error = data.message;
        return;
      }
      this.anggota=null;this.no_anggota=null;this.focusKeyboard='F4';
      this.emitter.emit("modal-transaksi-done", true);
      // this.$emit('close-modal');
      // this.$emit('clear-transaksi');
      window.location.href = '/kasir-coopzone';
    }
  }
});
</script>
<template>
  <div class="widget__modal-container__item modal-container">
    <div class="modal-tunai"  style="z-index:9999">
      <h4>Pembayaran Kredit</h4>
      <hr />
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Nomor / Nama Anggota (F8)</label>
            <vue3-simple-typeahead
              autofocus
              v-model="no_anggota"
              id="no_anggota"
              placeholder=""
              :items="listAnggota"
              :minInputLength="1"
              @focus="setFocus"
              @selectItem="selectItem"
              class="form-control"
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
      <div class="form-group row">
        <div v-if="isSubmit">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          Submit Data
        </div>
        <div class="col-md-6">
          <button type="submit" v-if="isSubmit==false" @click="submit" class="btn btn-success col-md-12">Bayar (Enter)</button>
        </div>
        <div class="col-md-6">
          <button type="button" v-if="isSubmit==false" @click="$emit('close-modal')" class="btn btn-danger col-md-12">Batal</button>
        </div>

        <!-- <div class="col-md-6 text-right">
          <button type="submit" @click="submitAndPrint" class="btn btn-info float-end" style="width: 200px">Bayar & Print</button>
        </div> -->
      </div>
    </div>
  </div>
</template>