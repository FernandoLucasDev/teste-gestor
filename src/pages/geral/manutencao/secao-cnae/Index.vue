<script setup>
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import SecaoCnaeService from "../../../../service/SecaoCnaeService"

const totalRecords = ref(0)
const id = ref()
const objSecaoCnae = ref({})
const listaSecaoCnae = ref([])
const secaoCnaeDialog = ref(false)
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

const secaoCnaeService = new SecaoCnaeService()

//Função de load da tela
const load = (options) => {
   console.log("Entrou na função Load")
   loading.value = true

   secaoCnaeService
      .all(options)
      .then((response) => {
         console.log(response)
         if (response.length) {
            totalRecords.value = response.length
            listaSecaoCnae.value = response
         }
      })
      .finally(() => {
         loading.value = false
      })
}

//Função de registrar novo registro na tela ao abrir um modal de novo registro
const Novo = () => {
   console.log("Entrou na função novo")
   id.value = null
   objSecaoCnae.value = {}
   secaoCnaeDialog.value = true
   submitted.value = false
}

//Função de editar os dados do registro salvo
const edit = (_objSecaoCnae) => {
   id.value = _objSecaoCnae.CODSCN
   loading2.value = true
   editando.value = true
   objSecaoCnae.value = _objSecaoCnae
   secaoCnaeDialog.value = true
}

//Função de confirmação de deleção
const confirmDelete = (_secaoCnae) => {
   console.log("entrou na função de confirmDelete", _secaoCnae)
   objSecaoCnae.value = _secaoCnae
   console.log("secaoCnae", objSecaoCnae.value)
   deleteDialog.value = true
}

//Função de deletar registro
const deleteFunction = () => {
   console.log("entrou na função de deleteFunction")
   deleteDialog.value = false
   toast.add({
      severity: "info",
      summary: "Seção Cnae",
      detail: "Excluindo Registro",
      life: 3000,
   })
   secaoCnaeService.delete(objSecaoCnae.value.CODSCN).then((response) => {
      if (response) {
         toast.add({
            severity: "success",
            summary: "Seção Cnae",
            detail: "Registro removido com sucesso",
            life: 3000,
         })

         load()
      } else {
         toast.add({
            severity: "error",
            summary: "Seção Cnae",
            detail: "Ocorreu um erro",
            life: 3000,
         })
      }
   })
}

const save = () => {
   submitted.value = true
   editando.value = false
   var retorno = validateFields()
   console.log(retorno)
   if (!retorno) {
      return
   } else {
      loading.value = true
      let response

      if (id.value) {
         objSecaoCnae.value.id = objSecaoCnae.value.CODSCN
         response = secaoCnaeService.update(objSecaoCnae.value)
      } else {
         response = secaoCnaeService.store(objSecaoCnae.value)
         console.log("response", response)
      }
      load()
      if (response) {
         secaoCnaeDialog.value = false

         toast.add({
            severity: "success",
            summary: "Sucesso",
            detail: "Salvo com sucesso",
            life: 3000,
         })
         load()
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
      objSecaoCnae.value.DESSCN == undefined ||
      objSecaoCnae.value.DESSCN == ""
   ) {
      console.log("Entrou na função de ValidateFields")
      toast.add({
         severity: "error",
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
      secaoCnaeService
         .get(id.value)
         .then((response) => {
            secaoCnaeService.value = response
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
        <h5>Seção Cnae</h5>

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
          :value="listaSecaoCnae"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODSCN"
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
            field="CODSCN"
            header="Código"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="{ data }">
              {{ data.CODSCN }}
            </template>
          </Column>
          <Column
            field="DESSCN"
            header="Descrição"
            :sortable="true"
            headerStyle="width:63%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESSCN }}
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
          v-model:visible="secaoCnaeDialog"
          :style="{ width: '70%' }"
          header="Seção Cnae"
          :modal="true"
          class="p-fluid"
        >
          <br />
          <div class="formgrid grid">
            <div class="field col-12 sm:col-12 md:col-2 lg:col-2 w-11rem">
            <label for="name">Código</label>
            <InputText
              v-model.trim="objSecaoCnae.CODSCN"
              :disabled="editando"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !objSecaoCnae.CODSCN }"
              maxLength="1"
            />
            <br />
            <small class="p-error" v-if="submitted && !objSecaoCnae.DESSCN"
              >Este campo é obrigatorio.</small>
          </div>
          <div class="field col-12 sm:col-12 md:col-2 lg:col-2 w-10">
            <label for="name">Descrição</label>
            <InputText
              v-model.trim="objSecaoCnae.DESSCN"
              required="true"
              autofocus
              :class="{ 'p-invalid w-full': submitted && !objSecaoCnae.DESSCN }"
              maxLength="20"
            />
            <br />
            <small class="p-error" v-if="submitted && !objSecaoCnae.DESSCN"
              >Este campo é obrigatorio</small>
          </div>
            </div>
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="secaoCnaeDialog = false"
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
