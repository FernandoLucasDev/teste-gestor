<script setup>
import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import MotivoRecisaoService from "../../../../service/geral/MotivoRecisaoService"

//inicializando as variaveis
const route = useRoute()
const router = useRouter()
const totalRecords = ref(0)
const id = ref()
const objMotivoRecisao = ref({})
const listaMotivoRecisao = ref([])
const recisaoDialog = ref(false)
const toast = useToast()
//variavel responsavel pelo carregamento de tela da função load
const loading = ref(false)
const loading2 = ref(false)
const editando = ref(false)
//variavel responsavel por abrir o modal
const openDialog = ref(false)
const deleteDialog = ref(false)
//variavel responsavel por enviar os dados
const submitted = ref(false)

//função responsavel pelo campo de filtragem
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

//instanciando a classe de MotivoRecisaoService
const motivoRecisaoService = new MotivoRecisaoService()

//criando a função de load
const load = (options) => {
  console.log("Entrou na função Load")
  //atribuindo true a variavel loading
  loading.value = true
  motivoRecisaoService
    .all(options)
    .then((response) => {
      console.log("1")
      console.log(response)
      console.log("2")
      if (response.length) {
        totalRecords.value = response.length
        listaMotivoRecisao.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

//Criando a função de novo registro
const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  objMotivoRecisao.value = {}
  recisaoDialog.value = true
  submitted.value = false
}

//Função de editar os dados
const edit = (_motivoRecisao) => {
  console.log("entrou na função edit")
  id.value = _motivoRecisao.CODMOT
  loading2.value = _motivoRecisao.CODMOT
  objMotivoRecisao.value = _motivoRecisao
  recisaoDialog.value = true
}

//Função de confirmDelete
const confirmDelete = (_motivoRecisaoService) => {
  console.log("entrou na função de ConfirmDelete");
  motivoRecisaoService.value = _motivoRecisaoService
  console.log("objMotivoRecisao.value", motivoRecisaoService.value)
  deleteDialog.value = true
}

//Função de delete
const deleteFunction = () => {
  console.log("entrou na função de de");
  deleteDialog.value = false;
  toast.add({
    severity: "info",
    summary: "Grau Parentesco",
    detail: "Excluindo Registro",
    life: 3000,
  })

  motivoRecisaoService
    .delete(motivoRecisaoService.value.CODMOT)
    .then((response) => {
      if (response) {
        toast.add({
          severity: "success",
          summary: "Motivo Recisão",
          detail: "Registro removido com sucesso",
          life: 3000,
        })

        load()
      } else {
        toast.add({
          severity: "error",
          summary: "Motivo Recisão",
          detail: "Ocorreu um erro",
          life: 3000,
        })
      }
    })
}

//criando a função de salvar novo registro
const save = () => {
  submitted.value = true

  var retorno = validateFields()
  console.log(retorno)
  if (!retorno) {
    return
  } else {
    loading.value = true
  }
  let response

  if (id.value) {
    objMotivoRecisao.value.id = objMotivoRecisao.value.CODMOT
    console.log("Entrou no if" + objMotivoRecisao.value)
    response = motivoRecisaoService.update(objMotivoRecisao.value)
  } else {
    response = motivoRecisaoService.store(objMotivoRecisao.value)
    console.log("response", response)
  }

  if (response) {
    recisaoDialog.value = false

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

}

const validateFields = () => {
  console.log("entrou na função validateFields")
  if (
    objMotivoRecisao.value.DESMOT == undefined ||
    objMotivoRecisao.value.DESMOT == ""
  ) {
    console.log("Entrou na função de ValidateFields")
    toast.add({
      severity: "error",
      summary: "Erro",
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
    motivoRecisaoService
      .get(id.value)
      .then((response) => {
        motivoRecisaoService.value = response
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
        <h5>Motivo de Recisão</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="Novo" />
            </div>
          </template>
        </Toolbar>

        <DataTable
          :value="listaMotivoRecisao"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          filterDisplay="row"
          responsiveLayout="scroll"
          dataKey="CODMOT"
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
            field="CODMOT"
            header="Código"
            :sortable="true"
            style="max-width: 3rem"
          >
            <template #body="{ data }">
              {{ data.CODMOT }}
            </template>
          </Column>
          <Column
            field="DESMOT"
            header="Descrição"
            :sortable="true"
            style="min-width: 12rem"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESMOT }}
            </template>
          </Column>
          <Column headerStyle="min-width:10rem; width:10rem">
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
          v-model:visible="recisaoDialog"
          :style="{ width: '70%' }"
          header="Motivo da recisão"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model.trim="objMotivoRecisao.DESMOT"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objMotivoRecisao.DESMOT }"
              maxLength="50"
            />
            <small class="p-error" v-if="submitted && !objMotivoRecisao.DESMOT">Descrição is required.</small>
          </div>
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="recisaoDialog = false"
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
            <span>Deseja realmente editar este registro? <br />
              Registro: <b>{{ motivoRecisaoService.DESMOT }}</b></span>
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
            <span>Deseja realmente excluir este registro? <br />
              Registro: <b>{{ motivoRecisaoService.DESMOT }}</b></span>
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
