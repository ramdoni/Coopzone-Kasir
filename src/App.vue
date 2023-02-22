<script>
import {container} from "jenesius-vue-modal";
export default {
    components: {WidgetContainerModal: container},
    name: "App"
}
</script>
<template>
  <div class="container-fluid">
    <header>
      <div class="wrapper">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container-fluid">
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <RouterLink to="/"  class="nav-link active">Kasir</RouterLink>
                </li>
                <!-- <li class="nav-item">
                  <RouterLink class="nav-link" to="/product">Produk</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink to="/Transaksi" class="nav-link">Transaksi</RouterLink>
                </li> -->
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>
    <RouterView />
    <notifications
      position="top center"
      :max="3"
      :width="400"
    />
    <widget-container-modal />
  </div>
</template>