<script setup>
//Importando os scripts necessarios

import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import SegmentoService from "../../../../service/SegmentoService"

//inicializando as variaveis e usando as funções

const route = useRoute()
const router = useRouter()
//variavel que serve para mostrar o total de registros
const totalRecords = ref(0)
const toast = useToast()
const loading = ref(false)
//variavel para servir de carregamento para a funçaõ edit
const loading2 = ref(false)
//Objeto a ser enviado para o Back-End
const segmento = ref({})
//Lista de segmentos retornada pelo banco
const listaSegmento = ref([])
const id = ref()
const editando = ref(false)
const submitted = ref(false)
//Variavel responsavel por abrir o modal
const openDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
const checkedDialog = ref(false)

//Função para filtrar regsitros no campo de busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

//Instanciando a classe que chama os metodos responsaveis por fazer a chamada de API
const segmentoService = new SegmentoService()

//criando a função de load que vai ser responsavel por carregar a tela
const load = (options) => {
  console.log("Entrou na função load")
  //referenciando a variavel loading usada para controlar o estado de carregamento
  loading.value = true

  segmentoService
    .all(options)
    .then((response) => {
      console.log("response", response)
      //se o comprimento da resposta (response)
      //é maior que zero (ou seja, se há elementos na resposta),
      //ele atualiza a variável totalRegistros.value
      // com o comprimento da resposta e atribui a resposta à variável listaSegmento.value
      if (response.length) {
        totalRecords.value = response.length
        listaSegmento.value = response
      }
    })
    //Após todo esse processo o valor da variavel loading passa a ser false
    //indicando que o carregamento foi concluído.
    .finally(() => {
      loading.value = false
    })
}

//Função que abre o modal para criar um novo registro
const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  segmento.value = {}
  submitted.value = false
  checkedDialog.value = true
}

//Função do botão de editar
const edit = (_segmento) => {
  console.log("Entrou na função edit")
  //nesta linha o valor da constante id é atualizado com o valor do atributo CODSEG do objeto _segmento.
  id.value = _segmento.CODSEG
  //Aqui,nesta linha o valor da constante loading2 é atualizado com o valor do atributo CODSEG do objeto _segmento recebido na função como parametro
  loading2.value = _segmento.CODSEG
  //Nesta linha, a constante segmento é atualizada com o valor do objeto _segmento. segmento.value
  segmento.value = _segmento
  //variavel responsavel por abrir o modal
  checkedDialog.value = true
}

//Função de confirmar deleção do registro desejado
const confirmDelete = (_segmento) => {
  console.log("Entrou na função de confirmDelete")
  segmentoService.value = _segmento
  console.log("SituaçãoService.value", segmentoService.value)
  //Passar o valor da variavel de deleteDiaglog para true para que possa se fechar o modal
  deleteDialog.value = true
}

const deleteFunction = () => {
  console.log("entrou na função delete")
  //Passar o valor da variavel de deleteDialog para false para não fechar o modal
  deleteDialog.value = false
  //Adicionar um token de aviso para o usuario informando se o registro foi salvo com sucesso ou não
  toast.add({
    severity: "info",
    summary: "Grau de segmento",
    detail: "Excluindo Registro",
    life: 3000,
  })

  //Função que chama o metodo delete do objeto SegmentoService  passando como argumento o valor do atributo CODSEG do objeto segmentoService.value
  segmentoService.delete(segmentoService.value.CODSEG).then((response) => {
    //verifica o valor da response para determinar se a exclusão foi bem-sucedida ou não. Se a response for avaliada como verdadeira, ou seja, se a exclusão foi bem-sucedida, o código dentro do bloco if será executado. Caso contrário, o código dentro do bloco else será executado.
    if (response) {
      toast.add({
        severity: "success",
        summary: "Grau Segmento",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Grau Segmento",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
  })
}

const save = async () => {
  submitted.value = true
  //Nesta linha, a função validateFields() é chamada e seu resultado é atribuído à variável retorno
  var retorno = validateFields()
  //imprime o resultado dessa variavel no console
  console.log(retorno)
  //Aqui, o código verifica o valor de retorno para determinar se os campos do formulário são válidos. Se retorno for avaliado como falso,
  // significa que há campos inválidos e o código dentro do bloco if será executado.
  // Caso contrário, se retorno for avaliado como verdadeiro, o código dentro do bloco else será executado.
  if (!retorno) {
    return
  } else {
    loading.value = true
  }

  let response

  if (id.value) {
    segmento.value.id = segmento.value.CODSEG
    // Nesta linha, a função update do serviço segmento é chamada para atualizar o registro com base no objeto segmento.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await segmentoService.update(segmento.value, id.value)
  } else {
    response = await segmentoService.store(segmento.value, id.value)
    console.log("response", response)
  }

  //Aqui, o código verifica se a variável response é avaliada como verdadeira.
  //Se response for verdadeiro, significa que a operação foi bem-sucedida e o código dentro do bloco if será executado.
  //Caso contrário, se response for falso, o código dentro do bloco else será executado.
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
}

//Função que valida os campos
const validateFields = () => {
  console.log("entrou na função validateFields")
  if (segmento.value.DESSEG == undefined || segmento.value.DESSEG == "") {
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

//Função que é executada depois que a tela for montada
onMounted(() => {
  load()

  if (id.value) {
    loading.value = true
    editando.value = true
    segmentoService
      .get(id.value)
      .then((response) => {
        segmentoService.value = response
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
        <h5>Segmento</h5>
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
          :value="listaSegmento"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRegistros="totalRecords"
          filterDisplay="row"
          responsiveLayout="scroll"
          dataKey="CODSEG"
          :filters="filters"
          ref="dt"
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
          <template #empty v-if="!loading"> Nada encontrado </template>
          <template #loading>
            Carregando Registros. Por favor, aguarde...
          </template>
          <template #footer v-if="!loading">
            Total de registros {{ totalRegistros }}
          </template>
          <Column
            field="CODSEG"
            header="Código"
            :sortable="true"
            style="max-width: 10rem"
          >
            <template #body="{ data }">
              {{ data.CODSEG }}
            </template>
          </Column>

          <Column
            field="DESSEG"
            header="Descrição"
            :sortable="true"
            style="min-width: 12rem; width: 85rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESSEG }}
            </template>
          </Column>

          <Column headerStyle="min-width:10rem; width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2 "
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

        <!-- 1-Modal  -->
        <Dialog
          v-model:visible="checkedDialog"
          :style="{ width: '70%' }"
          header="Segmento"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model="segmento.DESSEG"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !segmento.DESSEG }"
              maxLength="20"
            />
            <small class="p-error" v-if="submitted && !segmento.DESSEG"
              >Descrição is required.</small
            >
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

        <!-- Modal do Delete de registro-->
        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirmação de remoção"
          :modal="true"
        >
          <!-- Abertura da div -->
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span
              >Deseja realmente excluir este registro? <br />
              Registro:
            </span>
          </div>
          <!-- Fechamento da div -->

          <!-- Abertura do template -->
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
