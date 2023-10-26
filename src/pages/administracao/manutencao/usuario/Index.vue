<script setup>
import { ref, onMounted, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import {FilterMatchMode} from 'primevue/api';

import UsuarioService from '../../../../service/administracao/UsuarioService';

const router = useRouter();
const toast = useToast();

const usuarioService = new UsuarioService();

const loading = ref(false);
const usuarios = ref([]);
const totalRecords = ref();
const deleteDialog = ref(false);
const usuario = ref();
const filters = reactive({});
const descricao = ref();
// const filters = ref({
//  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
// });

const load = (options, nomusu = "") => {

  loading.value = true;

  options = { ...options, filters: filters.value};
  if (descricao.value) {
    options.query = {};
    options.query.nomusu = descricao.value;
  }
  // nomusu = filters.value;
  // nomusu = {filters: filters.value};

  console.log("nomusu", nomusu);
  //if (nomusu == "") {
    console.log("Entrou no if");
    usuarioService.all(options).then((response) => {
      console.log(response);

        if (response) {
          totalRecords.value = response.totalRecords;
          usuarios.value = response.data;
        }
      }
    ).finally(()=>{
      loading.value = false;
    });
  //}
  //else {
    /*
    console.log("Entrou no else");
    usuarioService.procuraByUsuario(nomusu).then((response) => {
        usuarios.value = response.data
      }
    ).finally(()=>{
      loading.value = false;
    });
    */
  //}
}

const onPage = (event) => load(event);

const onSort = (event) => load(event);

const novo = () => router.push({ path : '/administracao/fmtad02/novo' });

const edit = (id) => router.push({ path : '/administracao/fmtad02/' + id });

const confirmDeleteProduct = (data) => {
  usuario.value = data;
  deleteDialog.value = true;
}

const remove = () => {
  deleteDialog.value = false;
  loading.value = true;
  usuarioService.delete(usuario.value.CODUSU)
  .then(response => {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Usuário removido com sucesso', life: 3000 });
    load();
  })
  .finally(() => {
    loading.value = false
  });
}

// const initFilters = () => {
//   console.log("Entrou na função initFilters", filters.value);
//   console.log("Entrou na função initFilters", filters);
//   filters.value = {
//     global: {value: null, matchMode: FilterMatchMode.CONTAINS},
//   }
//   console.log("Entrou na função initFilters", filters);
// }

  // const filtraUsuario = () => {
  //   console.log("Entrou filtraUsuario");
  //   return load({}, filters.value);

  // }

  const applyFilter = () => {
    load();
  }

onBeforeMount(() => {
  // initFilters();
  const initFilters = () => {
    console.log("Entrou na função initFilters", filters.value);
    console.log("Entrou na função initFilters", filters);
    filters.value = {
      'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
    }
    console.log("Entrou na função initFilters", filters);
  }
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
          <h5>Usuários</h5>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="novo" />
              </div>
            </template>
          </Toolbar>
          <DataTable 
            :value="usuarios" 
            :lazy="true" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            @sort="onSort($event)"
            responsiveLayout="scroll"
            dataKey="CODUSU"
            :filters="filters"
            >      

                <template #header>
                  <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
                    <span class="block mt-2 md:mt-0 p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText v-model="descricao" placeholder="Procurar..." @input="applyFilter" />
                        <!-- <InputText v-model="filtraUsuario" placeholder="Procurar..." /> -->
                    </span>
                  </div>
                </template>
                <template #empty v-if="!loading">
                    Nenhum usuário encontrado
                </template>
                <template #loading>
                    Carregando usuários. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords }}
                </template>
                <Column field="CODUSU" header="Código" :sortable="true" style="max-width:3rem">
                    <template #body="{data}">
                        {{data.CODUSU}}
                    </template>
                </Column>
                <Column field="NOMUSU" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.NOMUSU}}
                    </template>
                    <!-- <template #filter="{ filterModel }">
                        <InputText v-model="filterModel.value" type="text" class="p-column-filter" placeholder="Search by name" />
                    </template> -->
                </Column>
                <Column field="ATIUSU" header="Usuário Ativo" :sortable="true" style="min-width:12rem">
                    <template #body="slotProps">
                        {{(slotProps.data.ATIUSU == "S" || slotProps.data.ATIUSU == "s" ? "Sim" : "Não")}}
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
          Deseja realmente excluir este usuário <b>{{usuario.NOMUSU}}</b>?
      </div>
      <template #footer>
          <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
          <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove" />
      </template>
		</Dialog>
</template>