<script setup>
import { FilterMatchMode } from "primevue/api";
import { onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import PremioService from "../../../../service/PremioService";
import ApoliceService from "../../../../service/ApoliceService";

/* Services */
const premioService = new PremioService();
const apoliceService = new ApoliceService();

/* Variáveis de controle */
const toast = useToast();
const loading = ref(false);
const editando = ref(false);
const submitted = ref(false);
const deleteDialog = ref(false);
const premioDialog = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

/* Objetos de tela */
const objPremio = ref({});
const objApoliceDropdown = ref();

/* Listas */
const listaPremio = ref([]);
const listaApolice = ref([]);
const totalRecords = ref(0);

/**
 * @async
 * @description Carrega lista que compõe a tabela
 */
const load = async () => {
  loading.value = true;

  try {
    const response = await premioService.all(objApoliceDropdown.value.value);

    if (response) {
      listaPremio.value = response;
      totalRecords.value = listaPremio.value.length;

      console.log(response);
    }
  } catch (error) {
    // console.error("Erro ao carregar os dados:", error)
  } finally {
    loading.value = false;
  }
};

/**
 * @description Abre o modal para novo registro
 */
const novo = () => {

  if(objApoliceDropdown.value){
    objPremio.value = { NUMAPO: objApoliceDropdown.value.value };
    editando.value = false;
    submitted.value = false;
    premioDialog.value = true;
  }else{
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Selecione uma apólice!",
      life: 3000,
    });
  }
};

/**
 * @description Abre o modal para editar registro
 */
const edit = (_objPremio) => {
  premioDialog.value = true;
  editando.value = true;
  objPremio.value = _objPremio;
};

/**
 * @description Abre o modal de confirmação de exclusão de registro
 * @param _objPremio É o objeto a ser excluído
 */
const confirmDelete = (_objPremio) => {
  objPremio.value = _objPremio;
  deleteDialog.value = true;
};

/**
 * @async
 * @description Realiza a exclusão do registro e exibe resultado
 */
const deleteFunction = async () => {
  deleteDialog.value = false;

  let response = await premioService.delete(objPremio.value);
  if (response) {
    await load();
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Registro removido com sucesso",
      life: 3000,
    });
  } else {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Ocorreu um erro",
      life: 3000,
    });
  }
};

/**
 * @async
 * @description Realiza a requisição para a API
 */
const save = async () => {
  submitted.value = true;
  let retorno = validateFields();
  if (!retorno) {
    return;
  } else {
    loading.value = true;
  }

  let response;

  if (editando.value == true) {
    console.log("Objeto premio", objPremio.value);
    response = await premioService.update(objPremio.value);
  } else {
    response = await premioService.store(objPremio.value);
    console.log("response", response);
  }

  if (response) {
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Salvo com sucesso",
      life: 3000,
    });
    await load();
  } else {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha na operação",
      life: 3000,
    });
  }

  premioDialog.value = false;
  editando.value = false;
};


/**
 * @description Faz a validação dos campos
 * @return boolean | true para válidos, false para campo com erro
 */
const validateFields = () => {
  if (objPremio.value.DESPRE == undefined || objPremio.value.DESPRE == "") {
    toast.add({
      severity: "error",
      summary: "Atenção",
      detail: "Preencha os campos obrigatórios",
      life: 3000,
    });
    return false;
  }

  return true;
};

onMounted(async () => {
  apoliceService.all().then((response) => {
    response.map((item) => {
      listaApolice.value.push({
        value: item.NUMAPO,
        label: item.NUMAPO,
      });
    });
  });
});

/**
 * @description Realiza a atribuição do número da apólice ao objPremio
 * @param objApoliceDropdown
 */
watch(objApoliceDropdown, (valor) => {
  objPremio.value.NUMAPO = valor.value;
});

</script>

<template lang="">
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <h5>Premio</h5>
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="grid">
              <div class="my-2">
                <Button
                  label="Novo"
                  icon="pi pi-plus"
                  class="p-button-success"
                  @click="novo()" />
              </div>
              <div class="mt-4 ml-4">
                <label for="Apolice">Apolice: </label>
              </div>
              <div class="my-2 mx-3">
                <Dropdown
                  id="Apolice"
                  v-model="objApoliceDropdown"
                  :options="listaApolice"
                  optionLabel="label"
                  placeholder="Selecione"
                  :class="{ 'p-invalid': submitted && !objPremio.NUMAPO }"
                  @change="load()">
                  <template #value="slotProps">
                    <div v-if="slotProps.value">
                      <span :class="'product-badge status-' + slotProps.value">{{ slotProps.value.label }}</span>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                </Dropdown>
                <small class="p-error" v-if="submitted && !objPremio.NUMAPO">Este campo é obrigatório.</small>
              </div>
            </div>
          </template>
        </Toolbar>

        <DataTable
          :value="listaPremio"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRegistros="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODPRE"
          :filters="filters"
          ref="dt">
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Procurar..." />
              </span>
            </div>
          </template>
          <template #empty v-if="!loading"> Nada encontrado </template>
          <template #loading>
            Carregando Registros. Por favor, aguarde...
          </template>
          <template #footer v-if="!loading">
            Total de registros {{ totalRecords }}
          </template>
          <Column
            field="CODPRE"
            header="Código"
            :sortable="true"
            style="max-width: 10rem">
            <template #body="{ data }">
              {{ data.CODPRE }}
            </template>
          </Column>

          <Column
            field="DESPRE"
            header="Descrição"
            :sortable="true"
            style="min-width: 12rem; width: 85rem">
            <template #body="slotProps">
              {{ slotProps.data.DESPRE }}
            </template>
          </Column>

          <Column headerStyle="min-width:10rem; width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data)" />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mt-2"
                @click="confirmDelete(slotProps.data)" />
            </template>
          </Column>
        </DataTable>

        <!-- 1-Modal  -->
        <Dialog
          v-model:visible="premioDialog"
          :style="{ width: '70%' }"
          header="Premio"
          :modal="true"
          class="p-fluid">
          <div class="field">
            <label for="Apolice">Apolice</label>
            <Dropdown
              id="Apolice"
              v-model="objApoliceDropdown"
              :options="listaApolice"
              optionLabel="label"
              placeholder="Selecione"
              :class="{ 'p-invalid': submitted && !objPremio.NUMAPO }"
              disabled>
              <template #value="slotProps">
                <div v-if="slotProps.value">
                  <span :class="'product-badge status-' + slotProps.value">{{
                    slotProps.value.label
                  }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
          </div>

          <div class="field">
            <label for="name">Valor Seguro Premio</label>
            <InputText
              v-model="objPremio.VALSEGPRE"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objPremio.VALSEGPRE }"
              maxLength="20" />
            <small class="p-error" v-if="submitted && !objPremio.VALSEGPRE">Este Campo é obrigatorio.</small>
          </div>

          <div class="field">
            <label for="name">Capital do seguro:</label>
            <InputText
              v-model="objPremio.CAPSEGPRE"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objPremio.CAPSEGPRE }"
              maxLength="20" />
            <small v-if="submitted && !objPremio.CAPSEGPRE" class="p-error">Este Campo é obrigatorio.</small>
          </div>

          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model="objPremio.DESPRE"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objPremio.DESPRE }"
              maxLength="20" />
            <small v-if="submitted && !objPremio.DESPRE" class="p-error">Este Campo é obrigatorio.</small>
          </div>

          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="premioDialog = false" />

            <Button
              label="Salvar"
              icon="pi pi-check"
              class="p-button-text"
              @click="save" />
          </template>
        </Dialog>

        <!-- Modal do Delete de registro-->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirmação de remoção"
          :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem" />
            <span>Deseja realmente excluir este registro? <br /> </span>
          </div>

          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false" />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteFunction" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
