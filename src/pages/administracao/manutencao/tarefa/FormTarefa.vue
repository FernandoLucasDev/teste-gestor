<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";

import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
import TarefaService from '../../../../service/administracao/TarefaService';

import { mapDropdownSearch } from '../../../../defaults/map';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const tarefaService = new TarefaService();
const grupoUsuarioService = new GrupoUsuarioService();

const id = ref();
const tarefa = ref({});
const email = ref();
const loading = ref(false);
const listTipoTarefa = ref([]);
const optionsSimNao =  ref(
  [
    {label : 'Sim', value : "S"},
    {label : 'Não', value : "N"},
  ]);

const formsubmit = (event) => {
  // if (!email.value && !id.value) {
  //   toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe um e-mail', life: 3000 });
  //   return false;
  // }
  // if (!tarefa.value.SENUSU && !id.value) {
  //   toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe uma senha', life: 3000 });
  //   return false;
  // }

  // if (!tarefa.value.NOMUSU) {
  //   toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe um nome', life: 3000 });
  //   return false;
  // }

  return true;
}

const save = async () => {
  if (!formsubmit()) {
    return;
  }

  loading.value = true;

  let response;
  response = await tarefaService.store(tarefa.value);

  if (response) {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Usuário salvo com sucesso', life: 3000 });

    setTimeout(() => back(), 2000);
  }
  else {
    toast.add({severity:'error', summary: 'Erro', detail: 'Usuário não salvo', life: 3000});
    loading.value = false;
  }
};

const back = () => router.push({ path : '/administracao/fmtad05' });

onMounted(async () => {
  loading.value = true;

  id.value = route.params.id;

  // const responseGrupo = await tipoTarefaService.all();
  // listTipoTarefa.value = [];
  // responseGrupo.map(
  //   (entry) => listTipoTarefa.value.push({label : entry.DESGRPUSU, value : entry.CODGRPUSU})
  // );

  // if (id.value) {
  //   const response = await tarefaService.get(id.value)
  //   tarefa.value = response;
  // }

  loading.value = false;
});
</script>
<template>
  <Toast />

  <div v-if="loading">
    <ProgressSpinner style="height: 50px;" />
  </div>

  <div class="p-fluid" v-else>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <form autocomplete="off" @submit.prevent="formsubmit">
            <input autocomplete="false" name="hidden" type="text" style="display:none;">
            <div class="formgrid grid">
              <div class="field md:col-12 col-12">
                  <label for="name">Descrição</label>
                  <InputText v-model="tarefa.DESTAR"/>
              </div>
              <div class="field md:col-12 col-12">
                  <label for="name">Título</label>
                  <InputText v-model="tarefa.TITTAR"/>
              </div>
              <div class="field md:col-12 col-12">
                  <label for="name">Cod. Sistema</label>
                  <InputText v-model="tarefa.CODSIS"/>
              </div>
              <div class="field col-12 md:col-5">
                <label for="estado">Tipo tarefa</label>
                <Dropdown id="estado" v-model="tarefa.CODTIPTAR" :options="listTipoTarefa" optionLabel="label" placeholder="Selecione" @change="onChange" >
                  <template #value="slotProps">
                    <div v-if="slotProps.value && slotProps.value.value">
                      <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                    </div>
                    <span v-else>
                      {{slotProps.placeholder}}
                    </span>
                  </template>
                </Dropdown>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col-6 md:col-2 float-right">
                <Button label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
              </div>

              <div class="field col-6 md:col-2">
                <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>