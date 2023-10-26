<script setup>
import { ref, defineProps, onUpdated } from 'vue';

const props = defineProps(["className", "CodPro", "style"]);

const CodPro = ref(props.CodPro);
const className = ref(props.className);
const style = ref(props.style);

const getImage = () => process.env.VUE_APP_API_URL+"produto/" + CodPro.value + "/image";

onUpdated(() => {
  CodPro.value = props.CodPro;
  className.value = props.className;
  style.value = props.style;
})

</script>
<template>
  <img :class="className" :style="style" :src='getImage(CodPro)' style="max-width : 200px" />
</template>