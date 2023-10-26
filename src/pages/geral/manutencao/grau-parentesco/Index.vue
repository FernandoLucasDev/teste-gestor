<script setup>
import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import GrauParentescoService from "../../../../service/geral/GrauParentescoService"

const route = useRoute()
const router = useRouter()
const totalRecords = ref(0)
const id = ref()
const nivelParentesco = ref({})
const tiposParentesco = ref([])
const nivelParentescoDialog = ref(false)
const toast = useToast()
const loading = ref(false)
const loading2 = ref(false)
const editando = ref(false)
const openDialog = ref(false)
const deleteDialog = ref(false)
const submitted = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const grauParentescoService = new GrauParentescoService()

const load = (options) => {
  console.log("Entrou na função Load");
  loading.value = true

  grauParentescoService
    .all(options)
    .then((response) => {
      console.log("1")
      console.log(response)
      console.log("2")
      if (response.length) {
        totalRecords.value = response.length
        tiposParentesco.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  nivelParentesco.value = {}
  nivelParentescoDialog.value = true
  submitted.value = false
}

const edit = (_nivelParentesco) => {
  id.value = _nivelParentesco.CODGRAPAR
  
  loading2.value = true
  // nivelParentesco.value = _nivelParentesco
  nivelParentesco.value = {
    CODGRAPAR: _nivelParentesco.CODGRAPAR,
    DESGRAPAR: _nivelParentesco.DESGRAPAR,
  }
  nivelParentescoDialog.value = true

}

const confirmDelete = (_grauParentescoService) => {
  console.log("entrou na função de confirmDelete", _grauParentescoService)
  grauParentescoService.value = _grauParentescoService
  console.log("grauParentescoService.value", grauParentescoService.value)
  deleteDialog.value = true
  console.log("Aa", deleteDialog.value)
}

const deleteFunction = () => {
  console.log("entrou na função de deleteFunction")
  deleteDialog.value = false
  toast.add({
    severity: "info",
    summary: "Grau Parentesco",
    detail: "Excluindo Registro",
    life: 3000,
  })

  grauParentescoService
    .delete(grauParentescoService.value.CODGRAPAR)
    .then((response) => {
      if (response) {
        toast.add({
          severity: "success",
          summary: "Grau Parentesco",
          detail: "Registro removido com sucesso",
          life: 3000,
        })

        load()
      } else {
        toast.add({
          severity: "error",
          summary: "Grau Parentesco",
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
    let response

    if (id.value) {
      nivelParentesco.value.id = nivelParentesco.value.CODGRAPAR
      console.log("Entrou no if"+ nivelParentesco.value)
      response = await grauParentescoService.update(nivelParentesco.value)
    } else {
      response = await grauParentescoService.store(nivelParentesco.value)
      console.log("response", response)
    }

    if (response) {
      nivelParentescoDialog.value = false
      
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
  if (
    nivelParentesco.value.DESGRAPAR == undefined ||
    nivelParentesco.value.DESGRAPAR == ""
  ) {
    console.log("Entrou na função de ValidateFields")
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Preencha os campos obrigatórios",
      life: 3000,
    })
    console.log("1")
    return false
  } else {
    console.log("2")

    return true
  }
}

onMounted(() => {
  load()
  if (id.value) {
    loading.value = true
    editando.value = true
    grauParentescoService
      .get(id.value)
      .then((response) => {
        grauParentescoService.value = response
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
        <h5>Tipos De Grau Parentesco</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="Novo" />
            </div>
          </template>
        </Toolbar>

        <DataTable
          :value="tiposParentesco"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          filterDisplay="row"
          responsiveLayout="scroll"
          dataKey="CODGRAPAR"
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
          <Column
            field="CODGRAPAR"
            header="Código"
            :sortable="true"
            headerStyle="width:40%; min-width:10rem;"
          >
            <template #body="{ data }">
              {{ data.CODGRAPAR }}
            </template>
            <template #empty v-if="!loading">
              Nenhum veículo encontrado
            </template>
            <template #loading>
              Carregando Registros. Por favor, aguarde...
            </template>
            <template #footer v-if="!loading">
              Total de registros {{ totalRecords }}
            </template>
          </Column>
          <Column
            field="DESGRAPAR"
            header="Descrição"
            :sortable="true"
            headerStyle="width:40%; min-width:10rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESGRAPAR }}
            </template>
          </Column>
          <Column headerStyle="width:10%; min-width:10rem;">
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
          v-model:visible="nivelParentescoDialog"
          :style="{ width: '70%' }"
          header="Nivel de Parentesco"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model.trim="nivelParentesco.DESGRAPAR"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !nivelParentesco.DESGRAPAR }"
              maxLength="50"
            />
            <small
              class="p-error"
              v-if="submitted && !nivelParentesco.DESGRAPAR"
              >Descrição is required.</small
            >
          </div>
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="nivelParentescoDialog = false"
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
            <span
              >Deseja realmente editar este registro? <br />
              Registro: <b>{{ grauParentescoService.DESGRAPAR }}</b></span
            >
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
            <span
              >Deseja realmente excluir este registro? <br />
              Registro: <b>{{ grauParentescoService.DESGRAPAR }}</b></span
            >
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
