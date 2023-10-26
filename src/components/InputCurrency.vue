<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { moneyFormat } from '../mixins/Formatters';

const props = defineProps({
  modelValue : Number
});

const emit = defineEmits(['update:modelValue']);

const input = ref(props.modelValue);

const onChange = (ev) => {
  const value = ev.target.value
    .replace(/\,/g, '')
    .replace(/\./g, '')

  input.value = new Intl.NumberFormat('pt-BR', { style : "decimal", minimumFractionDigits : 2 }).format( value / 100 );

  emit('update:modelValue', input.value);
}

onMounted(() => {
  input.value = props.modelValue ? moneyFormat(props.modelValue) : null;
})
</script>

<template>
  <InputText v-model="input" @keyup="onChange" />
</template>