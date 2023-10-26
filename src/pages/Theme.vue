<script setup>
import { onMounted, ref, getCurrentInstance } from 'vue';
import { useToast } from "primevue/usetoast";

import UsuarioService from "../service/administracao/UsuarioService";

const instance = getCurrentInstance();

const theme = instance.appContext.config.globalProperties.$appState.theme;

onMounted(() => {

  const themeData = require("../../public/themes/victoria/theme.css");
  

  console.log(theme);
  console.log(themeData);

});
</script>


<template>
  <Toast />

<div class="grid">
  <div class="col-12">
    <div class="card">
        Tema        
    </div>
  </div>
</div>
</template>