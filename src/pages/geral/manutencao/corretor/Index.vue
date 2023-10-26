<script setup>
import { ref, onMounted, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

import CorretorService from '../../../../service/geral/CorretorService.js';

import { telefoneMask } from '../../../../defaults/mask';

const router = useRouter();
const toast = useToast();

const corretorService = new CorretorService();

const loading = ref(false);
const corretores = ref([]);
const totalRecords = ref();
const deleteDialog = ref(false);
const corretor = ref({});
const id = ref();
const filters = reactive({});
const descricao = ref();
const corretorDialog = ref(false);
const submitted = ref(false);
const validaPercetual = ref(false);
// const filters = ref({
//  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
// });

const load = (options, nomusu = "") => {
  loading.value = true;

  options = { ...options, filters: filters.value };
  if (descricao.value) {
    options.query = {};
    options.query.nomusu = descricao.value;
  }

  if (nomusu == "") {
    corretorService.all().then((response) => {
      if (response) {
        totalRecords.value = response.totalRecords;
        corretores.value = response;
      }
    }
    ).finally(() => {
      loading.value = false;
    });
  }
  else {
    corretorService.procuraByUsuario(nomusu).then((response) => {
      corretores.value = response.data
    }
    ).finally(() => {
      loading.value = false;
    });
  }
}

const onPage = (event) => load(event);

const onSort = (event) => load(event);

const edit = (corretorEditar) => {
  corretor.value = corretorEditar;
  id.value = corretor.value.id;
  submitted.value = false;
  corretorDialog.value = true;
};

const confirmDeleteProduct = (data) => {
  corretor.value = data;
  deleteDialog.value = true;
}

const remove = () => {
  deleteDialog.value = false;
  loading.value = true;
  corretorService.delete(corretor.value)
    .then(response => {
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Corretor removido com sucesso.', life: 3000 });
      load();
    })
    .finally(() => {
      loading.value = false
    });
}

const applyFilter = () => {
  load();
}

onBeforeMount(() => {
  // initFilters();
  const initFilters = () => {
    filters.value = {
      'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    }
  }
  initFilters();
  // filtraUsuario();
  load();
})

const openNew = () => {
  console.log("!");
  corretor.value = {};
  submitted.value = false;
  corretorDialog.value = true;
};

const formsubmit = () => {
  if (!corretor.value.NOMCOR || !corretor.value.TELCOR || !corretor.value.PERCOR || !corretor.value.NOMEMP) {
    toast.add({ severity: 'error', summary: 'Dados', detail: 'Preenchas os campos obrigatórios.', life: 3000 });
    return false;
  }

  if (validaPercetual.value == true) {
    corretor.value.PERCOR = null;
    toast.add({ severity: 'error', summary: 'Dados', detail: 'Percentual precisa ser entre 0 - 100.', life: 3000 });
    return false;
  }

  return true;
}

const save = async () => {
  if (!formsubmit()) {
    return;
  }

  loading.value = true;

  let response;

  if (id.value) {
    response = await corretorService.update(corretor.value);
  }
  else {
    response = await corretorService.store(corretor.value);
  }


  if (response) {
    setTimeout(() => corretorDialog.value = false, 2000);

    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Corretor salvo com sucesso.', life: 3000 });
  }
  else {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Corretor não salvo.', life: 3000 });
  }

  load();
  loading.value = false;
};

const formataTELCOR = (ev) => {
  corretor.value.TELCOR = telefoneMask(ev.target.value);
  ev.target.value = telefoneMask(ev.target.value);
};

const onSubmit = (values) => {
  if (values.target.value < 0 || values.target.value > 100) {
    return validaPercetual.value = true;
  } else {
    return validaPercetual.value = false;
  }
};
</script>

<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast />
          <h5>Corretor</h5>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="openNew" />
              </div>
            </template>
          </Toolbar>
          <DataTable
            :value="corretores"
            :lazy="true"
            :paginator="true"
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            @sort="onSort($event)"
            responsiveLayout="scroll"
            dataKey="id"
            :filters="filters">

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
              Nenhum corretor encontrado.
            </template>
            <template #loading>
              Carregando corretores. Por favor, aguarde...
            </template>
            <template #footer v-if="!loading">
              Total de registros {{ totalRecords }}
            </template>
            <Column field="NOMCOR" header="Nome" :sortable="true" style="min-width:5rem; max-width: 20rem;">
              <template #body="{ data }">
                {{ data.NOMCOR }}
              </template>
            </Column>
            <Column field="TELCOR" header="Telefone" :sortable="true" style="min-width:5rem; max-width: 20rem;">
              <template #body="{ data }">
                {{ data.TELCOR }}
              </template>
            </Column>
            <Column field="PERCOR" header="Percentual" :sortable="true" style="min-width:5rem; max-width: 20rem;">
              <template #body="{ data }">
                {{ data.PERCOR }}
              </template>
            </Column>
            <Column field="NOMEMP" header="Nome da Empresa" :sortable="true" style="min-width:5rem">
              <template #body="{ data }">
                {{ data.NOMEMP }}
              </template>
            </Column>
            <Column headerStyle="min-width:10rem; width:10rem;">
              <template #body="props">
                <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2"
                  @click="edit(props.data)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                  @click="confirmDeleteProduct(props.data)" />
              </template>
            </Column>
          </DataTable>

          <Dialog
            v-model:visible="corretorDialog"
            :style="{ width: '70%' }"
            header="Detalhes do corretor"
            :modal="true"
            class="p-fluid">
            <div v-if="loading2">
              <Skeleton width="30rem" class="mb-2"></Skeleton>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
              <Skeleton width="30rem" class="mb-2"></Skeleton>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
              <Skeleton width="30rem" class="mb-2"></Skeleton>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
              <Skeleton width="20rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
              <Skeleton width="10rem" class="mb-2"></Skeleton>
              <Skeleton width="5rem" class="mb-2"></Skeleton>
              <Skeleton height=".5rem"></Skeleton>
            </div>
            <div v-else>
              <div class="formgrid grid">
                <div class="field col-12 sm:col-12 md:col-6 lg:col-4">
                  <label>Nome:</label>
                  <InputText
                    placeholder="Escreva"
                    required="true"
                    v-model="corretor.NOMCOR"
                    maxLength="10" />
                </div>
                <small class="p-invalid" v-if="submitted && !corretor.NOMCOR">Nome é obrigatório.</small>
                <div class="field col-12 sm:col-12 md:col-6 lg:col-2">
                  <label>Telefone:</label>
                  <InputText
                    placeholder="Escreva"
                    required="true"
                    v-model="corretor.TELCOR"
                    maxlength="15"
                    @input="formataTELCOR" />
                </div>
                <small class="p-invalid" v-if="submitted && !corretor.TELCOR">Telefone é obrigatório.</small>
                <div class="field col-12 sm:col-12 md:col-6 lg:col-2">
                  <label>Percentual:</label>
                  <div class="p-inputgroup flex-1">
                    <InputText
                      placeholder="Escreva"
                      required="true"
                      v-model="corretor.PERCOR"
                      @input="onSubmit"
                      maxLength="3" />
                        <span class="p-inputgroup-addon">%</span>
                  </div>
                    <small class="p-invalid" v-if="submitted && !corretor.PERCOR">Percentual é obrigatório.</small>
                    <small
                      class="p-invalid"
                      v-else-if="validaPercetual">
                        Percentual precisa ser entre 0 - 100.
                    </small>
                  </div>
                <div class="field col-12 sm:col-12 md:col-6 lg:col-4">
                  <label>Nome da Empresa:</label>
                  <InputText
                    placeholder="Escreva"
                    required="true"
                    v-model="corretor.NOMEMP"
                    maxlength="100" />
                </div>
                <small class="p-invalid" v-if="submitted && !corretor.NOMEMP">Nome da Empresa é obrigatório.</small>
              </div>
            </div>
            <template #footer>
              <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
              <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmação de remoção" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      Deseja realmente excluir este corretor?
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove" />
    </template>
  </Dialog>
</template>