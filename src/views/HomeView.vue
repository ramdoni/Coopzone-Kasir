<script>
import ModalBayarTunai from "../components/ModalBayarTunai.vue";
import ModalBayarKredit from "../components/ModalBayarKredit.vue";
import ModalBayarSimpanan from "../components/ModalBayarSimpanan.vue";
import ModalEditProduct from "../components/Kasir/ModalEditProduct.vue";
import {openModal} from "jenesius-vue-modal";
import axios from 'axios';
import { useStorage } from "vue3-storage";

export default {
  components:{
    ModalBayarTunai,
    ModalBayarKredit,
    ModalBayarSimpanan
  },
  data(){
    return {
      barcode: "",
      qty: 1,
      tabIndex: null,
      listProduct:[],
      dataProduct:[],
      data: {
				input: '',
				selection: null,
			},
      listFiltered: [],
      total:0,
      total_qty:0,
      focusKeyboard:null,
      showBayarTunai:false,
      showBayarKredit:false,
      showBayarSimpanan:false
    }
  },
  mounted(){
    document.addEventListener("keydown", this.onKeydown);
    this.emitter.on("modal-transaksi-done", isDone => {
      if(isDone){
        this.dataProduct = [];this.total=0;this.total_qty=0;
        this.onFocusProduct();
        this.$notify({
          title: "Notifikasi",
          text: "Transaksi berhasil",
          type: 'success',
        });
      }
    });

    /**
     * ketika ada perubahan product qty
     */
    this.emitter.on("modal-edit-product", data => {
      console.log(data);
      for(let i=0; i<this.dataProduct.length; i++){
        if(this.dataProduct[i]['id']==data.id){
          this.dataProduct[i]['qty_beli'] = data.qty_beli;
        }
      }
      this.focusKeyboard = null;
    })
  },
  created () {
    this.loadProduct();
    setTimeout(()=>{this.onFocusProduct()},1000);
  },
  beforeCreate: function () {
    const storage = useStorage("test_");

    storage
      .getStorage({
        key: "pin",
        success: result => {
          // console.log("result.data ", result.data);
        },
        fail: res => {
          // console.log("------", res);
          console.log(res);
        }
      })
      .catch(reason => {
        // console.log("reason------", reason);
      });
  },
  methods:{
    clearTransaksi(){
      this.showBayarKredit=false;this.showBayarTunai=false;
      this.barcode='';this.dataProduct=[];this.onFocusProduct();
    },
    calculate(){
      this.total_qty = 0; this.total = 0;
      for(let i=0; i<this.dataProduct.length; i++){
        this.total_qty += this.dataProduct[i]['qty_beli'];
        this.total += this.dataProduct[i]['qty_beli'] * this.dataProduct[i]['harga_number'];
      }
    },
    modalTunai(){
      this.showBayarKredit=false;this.showBayarTunai=true;
      document.getElementById("uang_tunai").value="";
      setTimeout(function(){
        document.getElementById("uang_tunai").focus();
      },500)
    },
    modalSimpanan(){
      this.showBayarTunai=false;this.showBayarKredit=false;this.showBayarSimpanan=true;
    },
    modalKredit(){
      this.showBayarTunai=false;this.showBayarKredit=true;
      document.getElementById("no_anggota").value="";
      setTimeout(function(){
        document.getElementById("no_anggota").focus();
      },500)
    },
    onFocusProduct(){
      this.barcode = "";
      var barcodeId = document.getElementById("barcode");
      barcodeId.focus();
      setTimeout(function(){
        barcodeId.value = "";
      });
      this.focusKeyboard='F4';
    },
    onKeydown(e){
      console.log(e.key);
      if(e.key=='Escape' && this.focusKeyboard=='F4'){
        let e = [...document.querySelectorAll('[tabindex]')];
        if(e.length>0) e[0].focus();
        this.focusKeyboard=null;this.tabIndex=0;
      }

      /**
       * Close semua modal
       */
      if(e.key=='Escape'){
        this.showBayarTunai=false;this.showBayarKredit=false;
      }
      
      if(e.key=='F4'){ this.onFocusProduct();}
      
      let el = [...document.querySelectorAll('[tabindex]')];
    
      if (document.activeElement && e.code === "ArrowDown" && this.focusKeyboard==null) {
        let i = el.indexOf(document.activeElement) + 1;
        i = i === el.length ? i = 0 : i;
        el[i].focus()
        this.tabIndex = i;
      }else if (document.activeElement && e.code === "ArrowUp" && this.focusKeyboard==null) {
        let  k = el.indexOf(document.activeElement) - 1;
        k = k == -1 ? k = 0 : k;
        if(el[k]!="") el[k].focus()
        this.tabIndex = k;
      }

      if(this.focusKeyboard != 'F8' && e.key=='F8'){
        this.focusKeyboard='F8';
        document.getElementById("btn_bayar_kredit").click();
      }
      if(this.focusKeyboard != 'F9' && e.key=='F9'){
        this.focusKeyboard='F9';
        this.isFocusUangTunai = setInterval(()=>{this.setFocusUangTunai});
        document.getElementById("btn_bayar_tunai").click();
      }

      /**
       * Untuk edit produk menggunakan keybord arah panah atau bawah dan enter 
       */
      if(e.key=='Enter' && this.focusKeyboard==null && this.tabIndex!=null){
        this.focusKeyboard = 'EditProduct';
        openModal(ModalEditProduct,{product:this.dataProduct[this.tabIndex]});
      }
      this.focusKeyboard = e.key;
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
    hapus(index){
      this.dataProduct.splice(index, 1);
      this.calculate();
    },
    selectedItem(item) {
      var skipThis=false;
      for(let i=0; i<this.dataProduct.length; i++){
        if(this.dataProduct[i]['id']==item['id']){
          this.dataProduct[i]['qty_beli'] = this.dataProduct[i]['qty_beli'] + this.qty;
          skipThis=true;
        }
      }

      if(skipThis==false) {
        item['qty_beli'] = this.qty;
        this.dataProduct.push(item);
      }
      
      this.qty = 1; this.focusKeyboard=null;this.barcode='';
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
                    @focus="onFocusProduct" 
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
                  <th></th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in dataProduct" :key="index" :tabindex="index">
                    <td>{{index+1}}</td>
                    <td>{{item.barcode}}</td>
                    <td>{{item.keterangan}}</td>
                    <td class="text-center">
                      <input type="number" class="form-control" @change="calculate" min="1" v-model="item.qty_beli" :key="index" style="width:80px;text-align:center;margin:auto;" />
                    </td>
                    <td class="text-center">{{item.qty}}</td>
                    <td class="text-right">{{item.harga}}</td>
                    <td class="text-right">{{$filters.formatNumber(item.qty_beli*item.harga_number)}}</td>
                    <td><font-awesome-icon class="btn btn-danger" icon="close" style="cursor:pointer" @click="hapus(index)" /></td>
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
            <!-- <div class="row">
              <div class="col-md-6 d-grid gap-2">
                <button type="button" class="btn btn-primary" id="btn_bayar_tunai" @click="modalSimpanan">Bayar Simpanan</button>
              </div>
            </div> -->
            <div class="row" v-if="total>0">
              <div class="col-md-6 d-grid gap-2">
                <button type="button" class="btn btn-primary" id="btn_bayar_tunai" @click="modalTunai">Tunai (F9)</button>
              </div>
              <div class="col-md-6 d-grid gap-2">
                <button type="button" class="btn btn-warning" id="btn_bayar_kredit" @click="modalKredit">Kredit (F8)</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalBayarTunai v-show="showBayarTunai"
    :total="total"
    :products="dataProduct"
    @clear-transaksi="clearTransaksi"
    @close-modal="showBayarTunai = false" />
    
    <ModalBayarKredit v-show="showBayarKredit"
    :total="total"
    :products="dataProduct"
    @clear-transaksi="clearTransaksi"
    @close-modal="showBayarKredit = false" />

    <ModalBayarSimpanan v-show="showBayarSimpanan"
    @close-modal="showBayarSimpanan = false" />
  </main>
</template>
