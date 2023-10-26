<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "primevue/usetoast"
import TipoTarefaService from "../../../../service/administracao/TipoTarefaService"
import { FilterMatchMode } from "primevue/api"

const route = useRoute()
const router = useRouter()
const toast = useToast()
const totalRecords = ref(0)
const tipoTarefa = ref({})
const tiposTarefa = ref([])
const loading = ref(false)
const deleteDialog = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const tipoTarefaService = new TipoTarefaService()

const load = (options) => {
  loading.value = true

  tipoTarefaService
    .all(options)
    .then((response) => {
      console.log(response)
      if (response.length) {
        totalRecords.value = response.length
        tiposTarefa.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const novo = () => {
  router.push({ path: "/administracao/fmtad03/novo" })
}

const edit = (id) => {
  // console.log(id);
  router.push({ path: "/administracao/fmtad03/alterar/" + id })
}

const confirmDeleteTask = (_tipoTarefa) => {
  console.log("entrou na função de confirmDelete", _tipoTarefa)
  tipoTarefa.value = _tipoTarefa
  console.log("tipoTarefa", tipoTarefa.value)
  deleteDialog.value = true
}

const removeTask = () => {
  console.log("entrou na função de deleteTask")
  deleteDialog.value = false
  toast.add({
    severity: "info",
    summary: "Tarefa",
    detail: "Excluindo Tarefa",
    life: 3000,
  })

  tipoTarefaService.delete(tipoTarefa.value.CODTIPTAR).then((response) => {
    if (response) {
      toast.add({
        severity: "success",
        summary: "Tarefa",
        detail: "Tarefa removida com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Tarefa",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
  })
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast />
          <h5>Tipo Tarefa</h5>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="novo" />
              </div>
            </template>
          </Toolbar>
          <DataTable :value="tiposTarefa" :paginator="true" :rows="10" :loading="loading" :totalRecords="totalRecords"
            filterDisplay="row" responsiveLayout="scroll" dataKey="CODTIPTAR" :filters="filters">
            <template #header>
              <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
                <span class="block mt-2 md:mt-0 p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Procurar..." />
                </span>
              </div>
            </template>
            <template #empty v-if="!loading">
              Nenhuma tarefa encontrada
            </template>
            <template #loading>
              Carregando Tarefas. Por favor, aguarde...
            </template>
            <template #footer v-if="!loading">
              Total de registros {{ totalRecords }}
            </template>
            <Column field="CODTIPTAR" header="Código" :sortable="true" style="max-width: 5em;">
              <template #body="{ data }">
                {{ data.CODTIPTAR }}
              </template>
            </Column>
            <Column field="DESTIPTAR" header="Descrição" :sortable="true" style="min-width: 10em">
              <template #body="{ data }">
                {{ data.DESTIPTAR }}
              </template>
            </Column>

            <Column headerStyle="min-width:10em; width:10em" style="">
              <template #body="props">
                <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2"
                  @click="edit(props.data.CODTIPTAR)" />
                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
                  @click="confirmDeleteTask(props.data)" />
              </template>
            </Column>
          </DataTable>
          <Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmação de remoção"
            :modal="true">
            <div class="flex align-items-center justify-content-center">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              Deseja realmente excluir esta Tarefa?
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
              <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="removeTask" />
            </template>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
</template>
