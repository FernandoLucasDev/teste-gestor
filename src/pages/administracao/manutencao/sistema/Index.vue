<script setup>
import { ref, onMounted, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import {FilterMatchMode} from 'primevue/api';

import SistemaService from '../../../../service/administracao/SistemaService';

const router = useRouter();
const toast = useToast();

const sistemaService = new SistemaService();

const loading = ref(false);
const sistemas = ref([]);
const totalRecords = ref();
const deleteDialog = ref(false);
const sistema = ref();
// const filters = reactive({});
const descricao = ref();
const filters = ref({
 'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const load = (options, nomusu = "") => {
  loading.value = true;

  options = { ...options, filters: filters.value};
  if (descricao.value) {
    options.query = {};
    options.query.nomusu = descricao.value;
  }
  // nomusu = filters.value;
  // nomusu = {filters: filters.value};

  if (nomusu == "") {
    sistemaService.all(options).then((response) => {
      if (response) {
        totalRecords.value = response.length;
        sistemas.value = response;
      }
      loading.value = false;
    }).finally(()=>{
    });
  }
  else {
    sistemaService.procuraByUsuario(nomusu).then((response) => {
      sistemas.value = response.data
      loading.value = false;
    }).finally(()=>{
    });
  }
}

const onPage = (event) => load(event);

const onSort = (event) => load(event);

const novo = () => router.push({ path : '/administracao/fmtad04/novo' });

const edit = (id) => router.push({ path : '/administracao/fmtad04/' + id });

const confirmDeleteProduct = (data) => {
  sistema.value = data;
  deleteDialog.value = true;
}

const remove = () => {
  deleteDialog.value = false;
  loading.value = true;
  sistemaService.delete(sistema.value.CODSIS)
  .then(response => {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Sistema removido com sucesso', life: 3000 });
    load();
  })
}


  const applyFilter = () => {
    load();
  }

  const initFilters = () => {
    filters.value = {
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    }
  }
onBeforeMount(() => {
  // initFilters();
  initFilters();
  // filtraUsuario();
  load();
})
</script>

<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <h4><Translate text="Sistema" /></h4>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="novo" />
              </div>
            </template>
          </Toolbar>
          <DataTable 
            :value="sistemas" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            responsiveLayout="scroll"
            dataKey="CODSIS"
            :filters="filters"
            >      

                <template #header>
                  <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <!-- <InputText v-model="descricao" placeholder="Procurar..." @input="applyFilter" /> -->
                        <InputText v-model="filters.global.value" placeholder="Procurar..." />
                    </span>
                  </div>
                </template>
                <template #empty v-if="!loading">
                    Nenhum registro encontrado.
                </template>
                <template #loading>
                    Carregando. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords }}
                </template>
                <Column field="CODSIS" header="Código" :sortable="true" style="width:5rem">
                    <template #body="{data}">
                        {{data.CODSIS}}
                    </template>
                </Column>
                <Column field="NOMSIS" header="Descrição" :sortable="true" style="min-width:5rem">
                    <template #body="{data}">
                        {{data.NOMSIS}}
                    </template>
                    <!-- <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                    </template> -->
                </Column>
                <Column headerStyle="min-width:10rem; width:10rem;">
                  <template #body="props">
                      <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data.CODSIS)" />
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
          Deseja realmente excluir este sistema <b> {{sistema.NOMSIS}}</b>?
      </div>
      <template #footer>
          <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
          <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove" />
      </template>
		</Dialog>
</template>