<script setup>
import { ref, onMounted, onUpdated, defineProps } from 'vue';
import ContatoService from '../service/ContatoService';

const props = defineProps(["selected", "CodEnt"]);
const service = new ContatoService();

const CodEnt = ref();
const contato = ref();
const contatos = ref([]);
const loading = ref(false);

const load = (term) => {
  if (!CodEnt.value) return;

  service.searchFromEntidade(CodEnt.value.value, term)
  .then(response => {
    contatos.value = [];
    const data = [];

    response.map(
      (entry) => data.push({label : entry.NOMCON, value : entry.CODCON})
    );

    contatos.value = data;
  })
  .finally(() => {
    loading.value = false
  });
}

const filtering = (evt) => {
  loading.value = true;

  load(evt.value)
}

onMounted(() => {
  CodEnt.value = props.CodEnt;
  contato.value = props.selected;
});

onUpdated(() => {
  CodEnt.value = props.CodEnt;
  contato.value = props.selected;
});
</script>

<template>
  <Dropdown 
    class="flex"
    v-model="contato" 
    :options="contatos" 
    optionLabel="label" 
    placeholder="Selecione" 
    :filter="true" 
    :showClear="true" 
    :loading="loading" 
    @filter="filtering"
    emptyFilterMessage="Nenhum registro encontrado"
    emptyMessage="Nenhuma opção disponível"
  >
    <template #value="slotProps">
      <div v-if="slotProps.value">
        <span :class="'product-badge status-' +slotProps.value">{{ slotProps.value.label }}</span>
      </div>
      <span v-else>
        {{slotProps.placeholder}}
      </span>
    </template>
  </Dropdown>
</template>