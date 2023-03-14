<script>
import axios from 'axios';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
library.add(faPrint);
import * as JSPM from 'jsprintmanager'

export default {
  data(){
    return{
      dataTransaksi:[],
      isLoadData:true,
      printers: [],
      selected_printer:''
    }
  },
  created () {
    this.loadTransaksi();
  },
  mounted: function() {
    this.onInit();
  },
  methods:{
    printStruk(url){
      var ifrm = document.createElement("iframe");
      ifrm.setAttribute("src", url);
      ifrm.setAttribute('id','printf_struk');
      ifrm.style.width = "640px";
      ifrm.style.height = "480px";
      ifrm.style.display = "none";
      document.body.appendChild(ifrm);
      document.getElementById("printf_struk").contentWindow.print();
    },
    loadTransaksi(){
      this.$nextTick(function () {
        axios.post(import.meta.env.VITE_API_URL + 'transaction/data', {
          token: import.meta.env.VITE_API_TOKEN
        })
        .then(response => (this.assignData(response.data.data)))
        .catch(function (error) { console.log(error);});
      });
    },
    assignData(data){
      this.dataTransaksi = data;
      this.isLoadData = false;
    },
    onInit: function() {
      var _this = this;
      JSPM.JSPrintManager.auto_reconnect = true;
      JSPM.JSPrintManager.start();
      JSPM.JSPrintManager.WS.onStatusChanged = function () {
        _this.getPrinters().then((p)=>{
          _this.printers = p;
          _this.$nextTick();
        });
      };
    },
    doPrintPDF: function(urlPdf){
      if(this.selected_printer === '' && !this.print2default) {
        alert("You must select a printer");
        return;
      }
      let cpj = new JSPM.ClientPrintJob();
      if (this.print2default) {
        cpj.clientPrinter = new JSPM.DefaultPrinter();
      } else {
        cpj.clientPrinter = new JSPM.InstalledPrinter(this.selected_printer);
      }
      var my_file = new JSPM.PrintFilePDF(
        urlPdf, 
        JSPM.FileSourceType.URL, 
        'transaksi.pdf', 
        1);
      cpj.files.push(my_file);
      cpj.sendToClient();
    }, 
    getPrinters: function() {   
      return new Promise((ok, err) => {
        let printers = [];
        if(JSPM.JSPrintManager.websocket_status == JSPM.WSStatus.Open) {
          JSPM.JSPrintManager.getPrinters().then(function (myPrinters) {
            printers = myPrinters;
            console.log(printers);
            ok(printers);
          }).catch((e)=>err(e));
        } else { console.warn("JSPM WS not open"); ok(printers); }
      });       
    }
  }
}
</script>
<template>
    <div class="transaksi mt-2">
      <h4 class="p-2">Transaksi</h4>
      <!-- <div>
        <label for="installedPrinterName">Select an installed Printer: </label>
        <select name="printer" id="printer" v-model="selected_printer">
            <option disabled n-bind:key="undefined">Select printer</option>
            <option v-for="printer in printers" v-bind:key="printer">{{ printer }}</option>
        </select>
      </div> -->
      <div class="table-responsive" style="min-height:400px;">
        <table class="table table-hover m-b-0 c_list">
          <thead style="background: #eee;">
            <tr>
              <th class="text-center" style="font-weight: bold;">No</th>
              <th style="font-weight: bold;">Status</th>
              <th style="font-weight: bold;">Jenis Transaksi</th>
              <th style="font-weight: bold;">No Anggota</th>
              <th style="font-weight: bold;">Nama Anggota</th>
              <th style="font-weight: bold;">No Transaksi</th>
              <th class="text-center" style="font-weight: bold;">Metode Pembayaran</th>
              <th style="font-weight: bold;">Tanggal Transaksi</th>
              <th style="font-weight: bold;">Status Pembayaran</th>
              <th style="font-weight: bold;" class="text-center">Tanggal Pembayaran</th>
              <th style="font-weight: bold;" class="text-right">Nominal</th>
              <th style="font-weight: bold;" class="text-right">PPN</th>
              <th style="font-weight: bold;" class="text-right">Total<br /></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoadData">
              <td colspan="14" class="text-center">
                <div>
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  Load Data
                </div>
              </td>
            </tr>
            <tr v-for="(item,index) in dataTransaksi" :key="index" :tabindex="index">
              <td>{{index+1}}</td>
              <td>
                <span v-if="item.status==1" class="badge bg-success">SUKSES</span>
                <span v-if="item.status==2 || item.status==0" class="badge bg-danger">BATAL</span>
                <span v-if="item.status==4" class="badge bg-danger">VOID</span>
              </td>
              <td>
                <span v-if="item.jenis_transaksi==1" class="text-info">Anggota</span>
                <span v-if="item.jenis_transaksi==2" class="text-warning">Non Anggota</span>
              </td>
              <td>{{item.no_anggota}}</td>
              <td>{{item.nama_anggota}}</td>
              <td>
                <RouterLink :to="{ name: 'transaksi-detail', params: { id: item.id }}"  class="nav-link text-success">{{item.no_transaksi}}</RouterLink>
              </td>
              <td class="text-center">{{item.metode_pembayaran}}</td>
              <td>{{item.created_at}}</td>
              <td>{{item.status_pembayaran}}</td>
              <td>{{item.payment_date}}</td>
              <td>{{item.sub_total}}</td>
              <td>{{item.ppn}}</td>
              <td>{{item.total}}</td>
              <td>
                <font-awesome-icon @click="printStruk(item.struk)" icon="print" style="cursor:pointer" title="Struk Pembayaran" />
                <!-- <font-awesome-icon @click="doPrintPDF(item.struk)" icon="print" style="cursor:pointer" title="Struk Pembayaran" /> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
