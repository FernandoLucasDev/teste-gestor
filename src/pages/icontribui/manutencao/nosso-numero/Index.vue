<script setup>
import { FilterMatchMode } from "primevue/api"
import { onMounted, watch } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import DefContribService from "../../../../service/DefContribService"
import NossoNumeroService from "../../../../service/icontribui/NossoNumeroService"
//Variavel que armazena o numero de registros retornados da consulta
const totalRecords = ref(0)
//Variavel que armazena os dados a serem enviados pro BackEnd
const objNossonumero = ref({})
//Variavel que exibe a lista dos dados a serem retornados pelo banco de dados
const listaNossoNumero = ref([])
//Variaveis de objetos dos dropdowns a serem armazenados os valores 
const objdefContribDropdown = ref()
//Variavel da lista a ser preenchida pelo dropdown de definição de contribuição
const listaDefinicaoContribuicao = ref([])
//Variavel responsavel por controlar o aviso de erro/sucesso
const toast = useToast()
//Variavel responsavel por controlar o estado de carregamento da tela
const loading = ref(false)
//Variavel que controla se um dado foi editado ou não
const editando = ref(false)
//Variavel que é responsalvel por abrir o modal
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
//Variavel responsalve por verificar se os dados foram enviados corretamente
const submitted = ref(false)

//Variavel que abre o dialog de nosso-numero
const nossoNumeroDialog = ref(false)

//Variavel responsavel por fazer filtragem no campo busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const nossoNumeroService = new NossoNumeroService()
const defcontribService = new DefContribService()

const load = async () => {
  console.log("Entrou na função load")
  // Referenciando a variável loading usada para controlar o estado de carregamento
  loading.value = true
  console.log(objdefContribDropdown.value)

  try {
    const response = await nossoNumeroService.all(objdefContribDropdown.value.value) // Faz a chamada à API

    if (response) {
      // Verifica se a resposta não é nula e se tem itens
      listaNossoNumero.value = response
      totalRecords.value = listaNossoNumero.value.length // Atualiza o total de registros
      console.log("Lista de DefContribuicao:", listaNossoNumero.value) // Verifique a lista preenchida

      console.log(response)
    } else {
      console.log("Nenhum registro encontrado.") // Trata o caso de nenhum registro retornado
    }
  } catch (error) {
    console.error("Erro ao carregar os dados:", error) // Trata erros de consulta à API
  } finally {
    loading.value = false // Certifica-se de que o estado de carregamento seja atualizado
  }
}

//Função que abre o modal para criar um novo registro
const novo = () => {
  console.log("Entrou na função novo")
  nossoNumeroDialog.value = true
  objNossonumero.value = { CODDFC: objdefContribDropdown.value.value }
  editando.value = false
  submitted.value = false
}

const confirmDelete = (_objNossonumero) => {
  console.log("Entrou na função de confirmDelete")
  objNossonumero.value = _objNossonumero
  //Passar o valor da variavel de deleteDiaglog para true para que possa se fechar o modal
  deleteDialog.value = true
}

const deleteFunction = async () => {
  console.log("entrou na função delete")
  //Passar o valor da variavel de deleteDialog para false para não fechar o modal
  deleteDialog.value = false
  //Adicionar um token de aviso para o usuario informando 
  //se o registro foi salvo com sucesso
  // ou não
  toast.add({
    severity: "info",
    summary: "Registro",
    detail: "Excluindo Registro",
    life: 3000,
  })

  console.log("objeto Nossonumero", objNossonumero.value.CODDFC)
 
  //Função que chama o metodo delete do objeto TipopremioService  passando como argumento o valor do atributo CODPRE do objeto premioService.value
  let response = await nossoNumeroService.delete(objNossonumero.value) 
    //verifica o valor da response para determinar se a exclusão foi bem-sucedida ou não. Se a response for avaliada como verdadeira, ou seja, se a exclusão foi bem-sucedida, o código dentro do bloco if será executado. Caso contrário, o código dentro do bloco else será executado.
    if (response) {
      await load();
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
}

//Função do botão de editar
const edit = (_objNossonumero) => {
  console.log("Entrou na função edit")
  nossoNumeroDialog.value = true
  editando.value = true
  objNossonumero.value = _objNossonumero
  // console.log("lista Objeto Nossonumero", listaNossoNumero.value);
  console.log("Objeto Nossonumero", objNossonumero.value)
  console.log("OBJETO _NOSSONUMERO", objNossonumero.value)
}

const save = async () => {
  submitted.value = true
  console.log("OBJETO NOSSONUMERO", objNossonumero)

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

  if (editando.value == true) {
    console.log("Objeto premio", objNossonumero.value)
    // objNossonumero.value.id = objNossonumero.value.CODPRE
    // Nesta linha, a função update do serviço objNossonumero é chamada para atualizar o registro com base no objeto objNossonumero.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await nossoNumeroService.update(objNossonumero.value)
    console.log("response", response)
  } else {
    response = await nossoNumeroService.store(objNossonumero.value)
    console.log("response", response)
  }

  //Aqui, o código verifica se a variável response é avaliada como verdadeira.
  //Se response for verdadeiro, significa que a operação foi bem-sucedida e o código dentro do bloco if será executado.
  //Caso contrário, se response for falso, o código dentro do bloco else será executado.
  if (response) {
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

  nossoNumeroDialog.value = false
  editando.value = false
}

//Função que valida os campos
const validateFields = () => {
  console.log("entrou na função validateFields")
  if (objNossonumero.value.DESNNU == undefined ||
      objNossonumero.value.DESNNU == "" ||
      objNossonumero.value.FILNNU == undefined ||
      objNossonumero.value.FILNNU == ""        ||
      objNossonumero.value.DIGNNU == undefined ||
      objNossonumero.value.DIGNNU == ""
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

onMounted(async () => {
  // await load()
  defcontribService.all().then((response) => {
    console.log("response", response)
    response.map((item) => {
      listaDefinicaoContribuicao.value.push({
        value: item.CODDFC,
        label: item.DESDFC,
      })
    })
    console.log("lista definição de contribuição", listaDefinicaoContribuicao)
    console.log("lista definição de contribuição", listaDefinicaoContribuicao.value)

  })
})

watch(objdefContribDropdown, (valor) => {
  console.log(valor);
  console.log(objNossonumero.value);
  objNossonumero.value.CODDFC = valor.value;
})
</script>

<template lang="">
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <h4><Translate text="Nosso Numero"/></h4>
        <Toolbar class="mb-2">
          <template v-slot:start>
            <div class="grid">
              <div class="mt-2">
                <Button
                  label="Novo"
                  icon="pi pi-plus"
                  class="p-button-success"
                  @click="novo"
                />
              </div>
            
                <div class="mt-4 ml-4">
                  <label for="DefContrib"> DefContribuição:</label>
                </div>
                <div class="my-2 mx-3">
                  <Dropdown
                    id="DefContrib"
                    v-model="objdefContribDropdown"
                    :options="listaDefinicaoContribuicao"
                    optionLabel="label"
                    placeholder="Selecione"
                    :class="{ 'p-invalid': submitted && !objNossonumero.CODDFC }"
                    @change="load()"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value">
                        <span
                          :class="'product-badge status-' + slotProps.value"
                          >{{ slotProps.value.label }}</span>
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                  </Dropdown>

                  <small class="p-error" v-if="submitted && !objNossonumero.CODDFC">
                    Este campo é obrigatório.
                  </small>
                </div>
              </div>
          </template>
        </Toolbar>

        <DataTable
          :value="listaNossoNumero"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODDFC"
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
            field="CODDFC"
            header="Código Da Definição"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="{ data }">
              {{ data.CODDFC }}
            </template>
          </Column>
          <Column
            field="DESNNU"
            header="Descrição DefiniçãoContrib"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESNNU }}
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
          v-model:visible="nossoNumeroDialog"
          :style="{ width: '70%' }"
          header="Nosso Numero"
          :modal="true"
          class="p-fluid"
        >
        <div class="field">
            <label for="Defcontrib">Definição de contribuição</label>
            <Dropdown
              id="DefContrib"
              v-model="objdefContribDropdown"
              :options="listaDefinicaoContribuicao"
              optionLabel="label"
              placeholder="Selecione"
              :class="{ 'p-invalid': submitted && !objNossonumero.CODDFC }"
              disabled
            >
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
              <label for="name">Descrição</label>
              <InputText
                v-model="objNossonumero.DESNNU"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !objNossonumero.DESNNU }"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !objNossonumero.DESNNU">
                Este campo é obrigatório.
              </small>
            </div>
           <div class="field">
              <label for="name">Nome do campo:</label>
              <InputText
                v-model="objNossonumero.FILNNU"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !objNossonumero.FILNNU }"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !objNossonumero.FILNNU">
                Este campo é obrigatório.
              </small>
            </div>
           
          <div class="field">
              <label for="name">Numeros de Digitos:</label>
              <InputText
                v-model="objNossonumero.DIGNNU"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !objNossonumero.DIGNNU }"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !objNossonumero.DIGNNU">
                Este campo é obrigatório.
              </small>
            </div>
          
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="nossoNumeroDialog = false"
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
          v-model:visible="deleteDialog"
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
              @click="nossoNumeroDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="novo"
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
