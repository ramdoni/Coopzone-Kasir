<script>
import axios from 'axios';

export default {
  data(){
    return{
      data:{},
      products:[]
    }
  },
  created () {

  },
  mounted() {
    this.loadData();
  },
  methods:{
    loadData(){
      this.$nextTick(function () {
        axios.post(import.meta.env.VITE_API_URL + 'transaction/detail', {
          token: import.meta.env.VITE_API_TOKEN,
          id: this.$route.params.id
        })
        .then(response => (this.assignData(response.data.data,response.data.products)))
        .catch(function (error) { console.log(error);});
      });
    },
    assignData(data,products){
      this.data = data;
      this.products = data.products;
    }
  }
}
</script>
<template>
    <div class="transaksi mt-2 p-2">
      <div class="row">
        <div class="col-md-4">
            <div class="row">
              <div class="form-group col-md-6">
                <small>No Transaksi</small><br />
                <strong>{{data.no_transaksi}}</strong>
                <hr class="mx-0 px-0" />
              </div>
              <div class="form-group col-md-6">
                <small>Status</small><br />
                <div v-html="data.status"></div>
                <hr class="mx-0 px-0" />
              </div>
            </div>
            <div class="row">
              <div class="form-group col-md-6">
                <small>Jenis Transaksi</small><br />
                <strong>{{data.jenis_transaksi}}</strong>
                <hr class="mx-0 px-0" />
              </div>
              <div class="form-group col-md-6">
                  <small>Tanggal</small><br />
                  <strong>{{data.date}}</strong>
                  <hr class="mx-0 px-0" />
              </div>
            </div>
            <RouterLink to="/kasir-coopzone/transaksi" class="nav-link text-info"> Kembali</RouterLink>

        </div>
        <div class="col-md-8">
            <div class="table-responsive" style="min-height:400px;">
                <table class="table table-hover m-b-0 c_list">
                <thead style="background: #eee;">
                    <tr>
                        <th style="width:50px">No</th>
                        <th>Barcode</th>
                        <th>Produk</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Nominal</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in products" :key="index" :tabindex="index">
                    <td>{{index+1}}</td>
                    <td>{{item.kode_produksi}}</td>
                    <td>{{item.keterangan}}</td>
                    <td>{{item.qty}}</td>
                    <td>{{item.harga}}</td>
                    <td>{{item.total}}</td>
                  </tr>
                </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  </template>
