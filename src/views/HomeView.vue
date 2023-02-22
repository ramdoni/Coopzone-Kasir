<script>
import ModalBayarTunai from "../components/ModalBayarTunai.vue";
import ModalBayarKredit from "../components/ModalBayarKredit.vue";
import {openModal,closeModal} from "jenesius-vue-modal";
import axios from 'axios';

export default {
  components:{
    ModalBayarTunai,
    ModalBayarKredit
  },
  data(){
    return {
      barcode: "",
      showModalKredit:false,
      showModalTunai:false,
      qty: 1,
      tabIndex: 0,
      listProduct:[],
      dataProduct:[],
      data: {
				input: '',
				selection: null,
			},
      listFiltered: [],
      total:0,
      total_qty:0,
      focusKeyboard:null
    }
  },
  mounted(){
    document.addEventListener("keydown", this.onKeydown);
    this.emitter.on("modal-transaksi-done", isDone => {
      if(isDone){
        this.dataProduct = [];this.total=0;this.total_qty=0;
        closeModal();
      }
    });
  },
  created () {
    this.loadProduct();
  },

  methods:{
    clearInput() {
      this.barcode = '';
    },
    modalTunai(){
      openModal(ModalBayarTunai,{title: 'Tunai',total: this.total,products:this.dataProduct});
      setTimeout(function(){
        document.getElementById("uang_tunai").focus();
      });
    },
    modalKredit(){
      openModal(ModalBayarKredit,{title: 'Kredit',total: this.total,products:this.dataProduct});
      setTimeout(function(){
        document.getElementById("no_anggota").focus();
      });
    },
    onKeydown(e){
      if(e.key=='F4'){
        this.barcode = "";
        var barcodeId = document.getElementById("barcode");
        barcodeId.focus();
        setTimeout(function(){
          barcodeId.value = "";
        });
      }
      if (document.activeElement && e.code === "ArrowDown" && this.focusKeyboard=='') {
        let e = [...document.querySelectorAll('[tabindex]')],
            i = e.indexOf(document.activeElement) + 1;
        i = i === e.length ? i = 0 : i;
        e[i].focus()
        this.tabIndex = i;
      }

      if(e.key=='Enter'){
        
      }

      if(e.key=='F8'){
        this.modalKredit();
      }
      if(e.key=='F10'){
        this.modalTunai();
        setTimeout(function(){
          document.getElementById("uang_tunai").focus();
        });
      }
    },
    loadProduct(){
      this.$nextTick(function () {
        axios.post(import.meta.env.VITE_API_URL + 'get-product', {
          token: import.meta.env.VITE_API_TOKEN,
          all_data: 1
        })
        .then(response => (this.listProduct = response.data.items))
        .catch(function (error) { console.log(error);});
      });
    },
    selectedItem(item) {
      item['qty_beli'] = this.qty;
      
      var skipThis=false;
      for(let i=0; i<this.dataProduct.length; i++){
        if(this.dataProduct[i]['id']==item['id']){
          this.dataProduct[i]['qty_beli'] = this.dataProduct[i]['qty_beli'] + this.qty;
          skipThis=true;
        }
      }

      if(skipThis==false) this.dataProduct.push(item);
      
      this.qty = 1; this.focusKeyboard='';this.barcode='';
      setTimeout(function(){
        document.getElementById("barcode").value='';
      });
      
      this.barcode = "";
      var barcodeId = document.getElementById("barcode");
      barcodeId.focus();
      setTimeout(function(){
        barcodeId.value = "";
      });
      this.total_qty = 0; this.total = 0;
      for(let i=0; i<this.dataProduct.length; i++){
        this.total_qty += this.dataProduct[i]['qty_beli'];
        this.total += this.dataProduct[i]['qty_beli'] * this.dataProduct[i]['harga_number'];
      }
		},
    onFocus(){
      setTimeout(function(){
        document.getElementById("barcode").value='';this.focusKeyboard='F4';
      });
    }
  }
};
</script>
<template>
  <main class="mt-3">
    <div class="row">
      <div class="col-md-8">
        <div class="card">
          <div class="body">
            <div class="row">
              <div class="form-group col-md-10">
                <label>Barcode / Produk <strong class="text-danger">(F4)</strong></label>
                <vue3-simple-typeahead
                    v-model="barcode"
                    id="barcode"
                    placeholder="(F4)"
                    :items="listProduct"
                    :minInputLength="1"
                    @focus="onFocus" 
                    @selectItem="selectedItem"
                    class="form-control"
                    ref="typeahead"
                    :itemProjection="
                        (item) => {
                          return item.text;
                        }">
                  </vue3-simple-typeahead>
              </div>
              <div class="col-md-2 text-center">
                <label>QTY</label>
                <input type="number" v-model="qty" placeholder="QTY" class="form-control text-center" />
              </div>
            </div>

            <div class="table-responsive mt-3">
              <table class="table table-bordered">
                <thead class="table-primary">
                  <tr>
                  <th><b>NO</b></th>
                  <th><strong>BARCODE</strong></th>
                  <th><strong>PRODUK</strong></th>
                  <th class="text-center"><strong>QTY</strong></th>
                  <th class="text-center"><strong>SISA STOK</strong></th>
                  <th  class="text-right"><strong>HARGA</strong></th>
                  <th class="text-right"><strong>TOTAL</strong></th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in dataProduct" :key="index" :tabindex="index">
                    <td>{{index+1}}</td>
                    <td>{{item.barcode}}</td>
                    <td>{{item.keterangan}}</td>
                    <td class="text-center">{{item.qty_beli}}</td>
                    <td class="text-center">{{item.qty}}</td>
                    <td class="text-right">{{item.harga}}</td>
                    <td class="text-right">{{$filters.formatNumber(item.qty_beli*item.harga_number)}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="body">
            <div class="form-group">
              <label>QTY</label>
              <h5>{{$filters.formatNumber(total_qty)}}</h5>
              <hr />
            </div>
            <div class="form-group">
              <label>Total</label>
              <h5>Rp. {{$filters.formatNumber(total)}}</h5>
              <hr />
            </div>
            <div class="row">
              <div class="col-md-6 d-grid gap-2">
                <button type="button" class="btn btn-primary" @click="modalTunai">Tunai (F10)</button>
              </div>
              <div class="col-md-6 d-grid gap-2">
                <button type="button" class="btn btn-warning" @click="modalKredit">Kredit (F8)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
