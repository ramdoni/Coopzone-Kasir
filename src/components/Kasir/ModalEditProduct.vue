<script>
import axios from 'axios';
export default ({
  data(){
    return {
      error:'',
      productChange:this.product,
      qty: this.product.qty_beli,
    };
  },
  props: {
    product: Object,
    modal: Object
  },
  mounted(){
    setTimeout(function(){
        document.getElementById("edit_qty").focus();
    },500);
  },
  methods:{
    onEnterQty(){
        this.productChange.qty_beli = this.qty;
        this.emitter.emit("modal-edit-product", this.productChange);
        document.getElementById("barcode").focus();
    },
  },
});
</script>
<template>
    <div class="modal-tunai">
      <div class="alert alert-danger" v-if="error!=''">{{error}}</div>
      <div class="row">
        <div class="col-12">
            <div class="form-group">
                <small>Barcode</small>
                <h6>{{product.barcode}}</h6>
            </div>
            <hr />
            <div class="form-group">
                <small>Product</small>
                <h6>{{product.keterangan}}</h6>
            </div>
            <hr />
            <div class="form-group">
                <small>Harga</small>
                <h6>{{product.harga}}</h6>
            </div>
            <hr />
            <div class="form-group col-md-6">
                <small>QTY</small>
                <input type="number" class="form-control" @keyup.enter="onEnterQty" id="edit_qty" style="width: 150px" v-model="qty" />
            </div>
            <hr />
        </div>
      </div>
    </div>
  </template>