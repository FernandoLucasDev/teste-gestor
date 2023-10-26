<script setup>
import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import TipoVeiculoService from "../../../../service/administracao/TipoVeiculoService"

const route = useRoute()
const router = useRouter()
const totalRecords = ref(0)
const tipoVeiculo = ref({})
const tiposVeiculo = ref([])
const toast = useToast()
const loading = ref(false)

const deleteDialog = ref(false)

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const tipoVeiculoService = new TipoVeiculoService()

const load = (options) => {
  loading.value = true

  tipoVeiculoService
    .all(options)
    .then((response) => {
      console.log("1")
      console.log(response)
      console.log("2")
      if (response.length) {
        totalRecords.value = response.length
        tiposVeiculo.value = response
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const novo = () => {
  console.log("Entrou na função novo")
  router.push({ path: "/logistica/fmtlg03/novo" })
}

const edit = (id) => {
  router.push({ path: "/logistica/fmtlg03/alterar/" + id })
}

const confirmDelete = (_tipoVeiculo) => {
  console.log("entrou na função de confirmDelete", _tipoVeiculo)
  tipoVeiculo.value = _tipoVeiculo
  console.log("tipoVeiculo.value", tipoVeiculo.value)
  deleteDialog.value = true

}

const deleteFunction = () => {
  console.log("entrou na função de deleteFunction")
  deleteDialog.value = false
  toast.add({
    severity: "info",
    summary: "Veiculo",
    detail: "Excluindo Veiculo",
    life: 3000,
  })

  tipoVeiculoService.delete(tipoVeiculo.value.CODTIPVEI).then((response) => {
    if (response) {
      toast.add({
        severity: "success",
        summary: "Veiculo",
        detail: "Veiculo removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Veiculo",
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
<template lang="">
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <h5>Tipo Veículo</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="novo" />
            </div>
          </template>
        </Toolbar>

        <DataTable
          :value="tiposVeiculo"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          filterDisplay="row"
          responsiveLayout="scroll"
          dataKey="CODTIPVEI"
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
            field="CODTIPVEI"
            header="Código"
            :sortable="true"
            style="max-width: 5em"
          >
            <template #body="{ data }">
              {{ data.CODTIPVEI }}
            </template>
            <template #empty v-if="!loading">
              Nenhum veículo encontrado
            </template>
            <template #loading>
              Carregando veículos. Por favor, aguarde...
            </template>
            <template #footer v-if="!loading">
              Total de registros {{ totalRecords }}
            </template>
          </Column>
          <Column
            field="DESTIPVEI"
            header="Descrição"
            :sortable="true"
            style="min-width: 10em"
          >
            <template #body="{ data }">
              {{ data.DESTIPVEI }}
            </template>
          </Column>
          <Column headerStyle="min-width:10rem; width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data.CODTIPVEI)"
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
            <span>Deseja realmente excluir este registro? </span><br />
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
