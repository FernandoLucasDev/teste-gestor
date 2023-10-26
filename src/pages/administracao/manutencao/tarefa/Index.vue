<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import {FilterMatchMode} from 'primevue/api';

import TarefaService from '../../../../service/administracao/TarefaService';

const router = useRouter();
const toast = useToast();

const tarefaService = new TarefaService();

const tabela = ref(null);
const loading = ref(false);
const tarefas = ref([]);
const totalRecords = ref();
const deleteDialog = ref(false);
const tarefa = ref();
const filters = ref({
  'global': {campo: "DESTAR", value: null, matchMode: FilterMatchMode.CONTAINS},
});

const load = (options) => {
  console.log(options);
  loading.value = true;
  tarefaService.all(options).then((response) => {
    console.log("responseresponseresponse",response);
      if (response.data.length) {
        totalRecords.value = response.totalRecords;
        tarefas.value = response.data;
      }
    }
  ).finally(()=>{
    loading.value = false;
  });
}

const onPage = (event) => load(event);

const onFilter = (event) => load(event);

const novo = () => router.push({ path : '/administracao/fmtad05/novo' });

const edit = (id) => router.push({ path : '/administracao/fmtad05/' + id });

const confirmDeleteProduct = (data) => {
  tarefa.value = data;
  deleteDialog.value = true;
}

const log = (event) => {
  console.log("event", event);
  console.log("tabela", tabela);
  console.log("tabela222", tabela.value.filters);
}

const remove = () => {
  deleteDialog.value = false;
  loading.value = true;
  tarefaService.delete(tarefa.value.CODUSU)
  .then(response => {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Usuário removido com sucesso', life: 3000 });
    load();
  })
  .finally(() => {
    loading.value = false
  });
}

onMounted(() => {
  load();
})
</script>

<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <h5>Tarefa</h5>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" class="p-button-success" @click="novo" />
              </div>
            </template>
          </Toolbar>
          <DataTable 
            paginator
            lazy
            responsiveLayout="scroll"
            v-model:filters="filters"
            :value="tarefas"
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            ref="tabela"
          >      
                <template #header>
                  <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="filters['global'].value" @keydown.enter="log($event)" placeholder="Procurar..." />
                    </span>
                  </div>
                </template>
                <template #empty v-if="!loading">
                    Nenhum registro encontrado
                </template>
                <template #loading>
                    Carregando registros. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords }}
                </template>
                <Column field="CODTAR" header="Código" :sortable="true" style="max-width:3rem">
                    <template #body="{data}">
                        {{data.CODTAR}}
                    </template>
                </Column>
                <Column field="CODTIPTAR" header="Tipo" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODTIPTAR}}
                    </template>
                </Column>
                <Column field="DESTAR" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESTAR}}
                    </template>
                </Column>
                <Column headerStyle="min-width:10rem; width:10rem;">
                  <template #body="props">
                      <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data.CODUSU)" />
                      <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(props.data)" />
                  </template>
                </Column>            
          </DataTable>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
      <div class="flex align-items-center justify-content-center">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          Deseja realmente excluir este usuário <b>{{tarefa.NOMUSU}}</b>?
      </div>
      <template #footer>
          <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
          <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove" />
      </template>
		</Dialog>
</template>