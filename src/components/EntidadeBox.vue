<script setup>
import { ref, onMounted, onUpdated, defineProps, defineEmits } from 'vue';

import EntidadeService from '@/service/EntidadeService';

const props = defineProps(["multiple", "modelValue", 'update:modelValue']);
const emit = defineEmits(['update:modelValue']);

const service = new EntidadeService();

const entidades = ref([]);
const entidade = ref();
const loading = ref(false);

const filtering = (evt) => {
  loading.value = true;      

  load(evt.value);
}

const load = (term) => {
  service.search(term)
  .then(response => {
    const data = [];
    response.map(
      (entry) => data.push({label : entry.NOMENT, value : entry.CODENT})
    );

    entidades.value = data;
  })
  .finally(() => {
    loading.value = false
  });
}

onUpdated(() => {
  entidade.value = props.modelValue;
});
</script>

<template>
  <Dropdown 
    class="flex"
    v-model="entidade" 
    :options="entidades" 
    optionLabel="label" 
    placeholder="Selecione" 
    :filter="true" 
    :showClear="true" 
    :loading="loading" 
    @filter="filtering"
    @change="(event) => emit('update:modelValue', event.value)"
    emptyFilterMessage="Nenhum registro encontrado"
    emptyMessage="Nenhuma opção disponível"
    v-if="!props.multiple"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value">
        <span :class="'product-badge status-' +slotProps.value">{{slotProps.value.label}}</span>
      </div>
      <span v-else>
        {{slotProps.placeholder}}
      </span>
    </template>
  </Dropdown>

  <MultiSelect
    placeholder="Selecionoe" 
    v-model="entidade" 
    :options="entidades" 
    :loading="loading"
    :filter="true" 
    :showClear="true" 
    @filter="filtering"
    @change="(event) => emit('update:modelValue', event.value)"
    emptyFilterMessage="Nenhum registro encontrado"
    emptyMessage="Nenhuma opção disponível"
    v-if="props.multiple"
  >
    <template #option="slotProps">
      <div class="flex align-items-center">
          <div v-if="slotProps.option">{{ slotProps.option.label }}</div>
      </div>
    </template>
    <template #header="slotProps">
      <div class="flex align-items-center" v-if="slotProps.options">
        <div></div>
      </div>
      <div v-else>
        <div>{{slotProps.placeholder}}</div>
      </div>
    </template>
  </MultiSelect>
</template>