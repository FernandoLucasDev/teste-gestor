<script setup>
import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import SituacaoService from "../../../../service/SituacaoService"

const route = useRoute()
const router = useRouter()
const totalRecords = ref(0)
const id = ref()
const objSituacao = ref({})
const listaSituacao = ref([])
const checkedDialog = ref(false)
const toast = useToast()
const loading = ref(false)
const loading2 = ref(false)
const editando = ref(false)
const openDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)
const checked = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const situacaoService = new SituacaoService()

const load = (options) => {
  console.log("Entrou na função Load")
  loading.value = true

  situacaoService
    .all(options)
    .then((response) => {
      console.log("1")
      console.log(response)
      console.log("2")
      if (response.length) {
        totalRecords.value = response.length
        listaSituacao.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  objSituacao.value = {}
  checked.value = {}
  submitted.value = false
  checkedDialog.value = true
}

const edit = (_situacao) => {
  id.value = _situacao.CODSIT
  checked.value = _situacao.CRESIT

  loading2.value = true
  objSituacao.value = _situacao

  // if(_situacao.CRESIT == 'S'){
  //  checked.value = true
  // }

  checked.value = _situacao.CRESIT == "S" ? true : false

  console.log("entrou no nivel de situacao", _situacao)
  checkedDialog.value = true
}

const confirmDelete = (_situacao) => {
  console.log("entrou na função de confirmDelete", _situacao)
  objSituacao.value = _situacao
  console.log("situacaoService.value", objSituacao.value)
  deleteDialog.value = true
  console.log("Aa", deleteDialog.value)
}

const deleteFunction = () => {
  console.log("entrou na função de deleteFunction")
  deleteDialog.value = false
  toast.add({
    severity: "info",
    summary: "Grau Situação",
    detail: "Excluindo Registro",
    life: 3000,
  })

  situacaoService.delete(objSituacao.value.CODSIT).then((response) => {
    if (response) {
      toast.add({
        severity: "success",
        summary: "Grau Situação",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Grau Situação",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
  })
}

const save = async () => {
  submitted.value = true

  var retorno = validateFields()
  console.log(retorno)
  if (!retorno) {
    return
  } else {
    loading.value = true

    let response = null
    console.log(checked.value)
    objSituacao.value.CRESIT = checked.value ? "S" : "N"

    if (id.value) {
      objSituacao.value.id = objSituacao.value.CODSIT
      response = await situacaoService.update(
        objSituacao.value,
        id.value,
        checked.value
      )
    } else {
      response = await situacaoService.store(
        objSituacao.value,
        id.value,
        checked.value
      )
      console.log("response", response)
    }

    if (response) {
      checkedDialog.value = false

      load()
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Salvo com sucesso",
        life: 3000,
      })
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha na operação",
        life: 3000,
      })
    }

    loading.value = false
  }
}

const validateFields = () => {
  console.log("entrou na função validateFields")
  if (objSituacao.value.DESSIT == undefined || objSituacao.value.DESSIT == "") {
    console.log("Entrou na função de ValidateFields")
    toast.add({
      severity: "warn",
      summary: "Atenção",
      detail: "Preencha os campos obrigatórios",
      life: 3000,
    })

    return false
  } else {
    return true
  }
}

onMounted(() => {
  load()
  if (id.value) {
    loading.value = true
    editando.value = true
    situacaoService
      .get(id.value)
      .then((response) => {
        situacaoService.value = response
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
        <h5>Situação</h5>

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
          :value="listaSituacao"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          filterDisplay="row"
          responsiveLayout="scroll"
          dataKey="CODSIT"
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
            Nenhum registro encontrado.
          </template>
          <template #loading>
            Carregando Registros. Por favor, aguarde...
          </template>
          <template #footer v-if="!loading">
            Total de registros: {{ totalRecords }}
          </template>
          <Column
            field="CODSIT"
            header="Código"
            :sortable="true"
            headerStyle="width:40%; min-width:10rem;"
          >
            <template #body="{ data }">
              {{ data.CODSIT }}
            </template>
          </Column>
          <Column
            field="DESSIT"
            header="Descrição"
            :sortable="true"
            headerStyle="width:40%; min-width:10rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESSIT }}
            </template>
          </Column>
          <Column headerStyle="min-width:10rem;">
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
          v-model:visible="checkedDialog"
          :style="{ width: '70%' }"
          header="Tipo de Situação"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model="objSituacao.DESSIT"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objSituacao.DESSIT }"
              maxLength="30"
            />
            <small class="p-error" v-if="submitted && !objSituacao.DESSIT"
              >Descrição is required.</small>
          </div>

          <div class="flex flex-column gap-3 md:col-3 sm:col-12 pt-0">
            <label for="checkbox">Credito: </label>
            <Checkbox v-model="checked" :binary="true" />
          </div>

          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="checkedDialog = false"
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
            <span>Deseja realmente editar este registro? <br /> </span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="openDialog = false"
            />
            <Button
              label="Sim"
              ico2n="pi pi-check"
              class="p-button-text"
              @click="openNew"
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
            <span>Deseja realmente excluir este registro? <br /></span>
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
              ico2n="pi pi-check"
              class="p-button-text"
              @click="deleteFunction"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>
