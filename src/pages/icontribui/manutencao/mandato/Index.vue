<script setup>
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import MandatoService from "../../../../service/icontribui/MandatoService"

//Inicializando as variaveis

//Variavel que armazena o numero de registros retornados da consulta
const totalRecords = ref(0)
const id = ref()
//Variavel que armazena os dados a serem enviados pro BackEnd
const objMandato = ref({})
//Variavel que exibe a lista dos dados a serem retornados pelo banco de dados
const listaMandato = ref([])
//Variavel responsavel por controlar o aviso de erro/sucesso
const toast = useToast()
//Variavel responsavel por controlar o estado de carregamento da tela
const loading = ref(false)
//Variavel que controla se um dado foi editado ou não
const editando = ref(false)
//Variavel que é responsalvel por abrir o modal
const mandatoDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
//Variavel responsalve por verificar se os dados foram enviados corretamente
const submitted = ref(false)

//Variavel responsavel por fazer filtragem no campo busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const mandatoService = new MandatoService()

//Função de carregamento da tela
const load = (options) => {
  console.log("Entrou na função Load")
  loading.value = true

  mandatoService
    .all(options)
    .then((response) => {
      console.log("1")
      console.log(response)
      console.log("2")
      if (response.length) {
        totalRecords.value = response.length
        listaMandato.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  objMandato.value = {}
  submitted.value = false
  editando.value = false
  mandatoDialog.value = true
}

//Função de editar os dados do registro salvo
const edit = (_objMandato) => {
  console.log("Entrou na função edit")
  console.log("objMandato", _objMandato)
  //   id.value = _objMandato.CODMAN
  editando.value = true
  //   objMandato.value = _objMandato
  if (objMandato.value["INIMAN"]) {
    objMandato.value["INIMAN"] = new Date(_objMandato["INIMAN"], 1, 1)
  }
  if (objMandato.value["FINMAN"]) {
    objMandato.value["FINMAN"] = new Date(_objMandato["FINMAN"], 1, 1)
  }
  mandatoDialog.value = true
}

//Função de confirmação de deleção
const confirmDelete = (_Objmandato) => {
  console.log("entrou na função de confirmDelete", _Objmandato)
  objMandato.value = _Objmandato
  console.log("secaoCnae", objMandato.value)
  deleteDialog.value = true
}

const deleteFunction = () => {
  console.log("entrou na função de deleteFunction")
  deleteDialog.value = false
  toast.add({
    severity: "info",
    summary: "Mandato",
    detail: "Excluindo Registro",
    life: 3000,
  })
  mandatoService.delete(objMandato.value.CODMAN).then((response) => {
    if (response) {
      toast.add({
        severity: "success",
        summary: "Mandato",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Mandato",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
  })
}

const save = async () => {
  submitted.value = true
  //   editando.value = false
  var retorno = validateFields()
  console.log(retorno)
  if (!retorno) {
    return
  } else {
    //  loading.value = true
    let data = {};
    for (const key in objMandato.value) {
      data[key] = objMandato.value[key]

      if (key == "INIMAN" || key == "FINMAN") {
        data[key] = objMandato.value[key].getFullYear()
      }
    }
    // Formate as datas como números inteiros (ano)
    // if (objMandato.value.INIMAN instanceof Date) {
    //    objMandato.value.INIMAN = objMandato.value.INIMAN.getFullYear()
    //  }

    //  if (objMandato.value.FINMAN instanceof Date) {
    //    objMandato.value.FINMAN = objMandato.value.FINMAN.getFullYear()
    //  }

    let response
    if (editando.value == true) {
      // objMandato.value.id = objMandato.value.CODMAN
      // editando.value = false
      response = await mandatoService.update(data)
    } else {
      response = await mandatoService.store(data)
      console.log("response", response)
    }
    if (response) {
      mandatoDialog.value = false

      load()
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Salvo com sucesso",
        life: 3000,
      })
      // load()
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha na operação",
        life: 3000,
      })
    }

    //  loading.value = false
  }
}

const validateFields = () => {
  console.log("entrou na função validateFields")
  if (
    objMandato.value.DESMAN == undefined || objMandato.value.DESMAN == "" ||
    objMandato.value.INIMAN == undefined || objMandato.value.FINMAN == ""
  ) {
    toast.add({
      severity: "error",
      summary: "Atenção",
      detail: "Preencha os campos obrigatórios",
      life: 3000,
    })

    return false
  }
  if (objMandato.value.INIMAN > objMandato.value.FINMAN) {
    console.log("Entrou no if ");
    toast.add({
      severity: "error",
      summary: "Atenção",
      detail: "A data de inicio não deve ser maior que a de FIM do mandato",
      life: 3000,
    })
    return false;
  }

  return true;
}

onMounted(() => {
  load()
  if (id.value) {
    loading.value = true
    editando.value = true
    mandatoService
      .get(id.value)
      .then((response) => {
        mandatoService.value = response
      })
      .finally(() => {
        loading.value = false
      })
  }
})
</script>

<template lang="">
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <h5>Mandato</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="Novo"
                icon="pi pi-plus"
                class="p-button-success"
                @click="Novo"
              />
            </div>
          </template>
        </Toolbar>

        <DataTable
          :value="listaMandato"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODMAN"
          :filters="filters"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4"
            >
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Procurar..."
                />
              </span>
            </div>
          </template>
          <template #empty v-if="!loading">
            Nenhum registro encontrado
          </template>
          <template #loading>
            Carregando Registros. Por favor, aguarde...
          </template>
          <template #footer v-if="!loading">
            Total de registros {{ totalRecords }}
          </template>
          <Column
            field="CODMAN"
            header="Código"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="{ data }">
              {{ data.CODMAN }}
            </template>
          </Column>
          <Column
            field="DESMAN"
            header="Descrição"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESMAN }}
            </template>
          </Column>
          <Column
            field="INIMAN"
            header="Data Inicio Mandato"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.INIMAN }}
            </template>
          </Column>
          <Column
            field="FINMAN"
            header="Fim Mandato"
            :sortable="true"
            headerStyle="width:63%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.FINMAN }}
            </template>
          </Column>
          <Column headerStyle="min-width:10em; width:5em;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mt-2"
                @click="confirmDelete(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="mandatoDialog"
          :style="{ width: '70%' }"
          header="Mandato"
          :modal="true"
          class="p-fluid"
        >
          <div class="formgrid grid">
            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="name">Descrição</label>
              <InputText
                v-model="objMandato.DESMAN"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !objMandato.DESMAN }"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !objMandato.DESMAN">
                Este campo é obrigatório.
              </small>
            </div>
            <div class="field col-12 sm:col-12 md:col-6 lg:col-3">
              <label for="inicioMandato">Início Mandato</label>
              <Calendar
                v-model="objMandato.INIMAN"
                view="year"
                showIcon="true"
                dateFormat="yy"
                :class="{ 'p-invalid': submitted && !objMandato.INIMAN }"
              />
              <small class="p-error" v-if="submitted && !objMandato.INIMAN">
                Este campo é obrigatório.
              </small>
            </div>
            <div class="field col-12 sm:col-12 md:col-6 lg:col-3">
              <label for="fimMandato">Fim Mandato</label>
              <Calendar
                v-model="objMandato.FINMAN"
                view="year"
                showIcon="true"
                dateFormat="yy"
                :class="{ 'p-invalid': submitted && !objMandato.FINMAN }"
              />
              <small class="p-error" v-if="submitted && !objMandato.INIMAN">
                Este campo é obrigatório.
              </small>
            </div>
          </div>

          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="mandatoDialog = false"
            />

            <Button
              label="Salvar"
              icon="pi pi-check"
              class="p-button-text"
              @click="save"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="openDialog"
          :style="{ width: '450px' }"
          header="Confirmar Edição"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span>Deseja realmente editar este registro?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="mandatoDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="Novo"
            />
          </template>
        </Dialog>
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirmação de remoção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span>Deseja realmente excluir este registro?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteFunction"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
