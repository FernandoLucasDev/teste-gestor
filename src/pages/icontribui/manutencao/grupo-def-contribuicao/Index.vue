<script setup>
import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import GrupoDefContribService from "../../../../service/GrupoDefContribService"

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
const objGrupoDefContrib = ref({})
//Lista de objGrupoDefContribs retornada pelo banco
const listaGrupoDefContrib = ref([])
const editando = ref(false)
const submitted = ref(false)
//Variavel responsavel por abrir o modal
const openDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
const GrupoDefContribDialog = ref(false)

//Função para filtrar regsitros no campo de busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

//Instanciando a classe que chama os metodos responsaveis por fazer a chamada de API
const grupoDefContribService = new GrupoDefContribService()

const load = (options) => {
  console.log("Entrou na função load")
  //referenciando a variavel loading usada para controlar o estado de carregamento
  loading.value = true

  grupoDefContribService
    .all(options)
    .then((response) => {
      console.log("response", response)
      //se o comprimento da resposta (response)
      //é maior que zero (ou seja, se há elementos na resposta),
      //ele atualiza a variável totalRegistros.value
      // com o comprimento da resposta e atribui a resposta à variável listaobjGrupoDefContrib.value
      if (response.length) {
        totalRecords.value = response.length
        listaGrupoDefContrib.value = response
      }
    })
    //Após todo esse processo o valor da variavel loading passa a ser false
    //indicando que o carregamento foi concluído.
    .finally(() => {
      loading.value = false
    })
}

//Função que abre o modal para criar um novo registro
const novo = () => {
  console.log("Entrou na função novo")
  editando.value = false
  objGrupoDefContrib.value = {}
  submitted.value = false
  GrupoDefContribDialog.value = true
}

//Função do botão de editar
const edit = (_dados) => {
  console.log("Entrou na função edit")
  //nesta linha o valor da constante id é atualizado com o valor do atributo CODGDC do objeto _dados.
  editando.value = true
  //Nesta linha, a constante objGrupoDefContrib é atualizada com o valor do objeto _dados. objGrupoDefContrib.value
  objGrupoDefContrib.value = _dados
  //variavel responsavel por abrir o modal
  GrupoDefContribDialog.value = true
}

//Função de confirmar deleção do registro desejado
const confirmDelete = (_dados) => {
  console.log("Entrou na função de confirmDelete")
  //Nesta linha, a constante objGrupoDefContrib é atualizada com o valor do objeto _dados. objGrupoDefContrib.value
  objGrupoDefContrib.value = _dados
 
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
    summary: "Registro",
    detail: "Excluindo Registro",
    life: 3000,
  })

  //Função que chama o metodo delete do objeto grupoDefContribService  passando como argumento o valor do atributo CODCDG do objeto grupoDefContribService.value
  console.log("Objeto GrupoDefContrib", objGrupoDefContrib.value);
  grupoDefContribService.delete(objGrupoDefContrib.value.CODGDC).then((response) => {
    //verifica o valor da response para determinar se a exclusão foi bem-sucedida ou não. Se a response for avaliada como verdadeira, ou seja, se a exclusão foi bem-sucedida, o código dentro do bloco if será executado. Caso contrário, o código dentro do bloco else será executado.
    if (response) {
      toast.add({
        severity: "success",
        summary: "Registro",
        detail: "Registro removido com sucesso",
        life: 3000,
      })
      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Registro",
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

  if (editando.value) {
    // objGrupoDefContrib.value.id = objGrupoDefContrib.value.CODGDC
    // Nesta linha, a função update do serviço objGrupoDefContrib é chamada para atualizar o registro com base no objeto objGrupoDefContrib.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await grupoDefContribService.update(objGrupoDefContrib.value,objGrupoDefContrib.value.CODGDC)
  } else {
    response = await grupoDefContribService.store(objGrupoDefContrib.value)
    console.log("response", response)
  }

  //Aqui, o código verifica se a variável response é avaliada como verdadeira.
  //Se response for verdadeiro, significa que a operação foi bem-sucedida e o código dentro do bloco if será executado.
  //Caso contrário, se response for falso, o código dentro do bloco else será executado.
  if (response) {
    GrupoDefContribDialog.value = false

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
  if (objGrupoDefContrib.value.DESGDC == undefined || objGrupoDefContrib.value.DESGDC == "") {
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

  // if (editando.value) {
  //   loading.value = true
  //   grupoDefContribService
  //     .get(editando.value)
  //     .then((response) => {
  //       objGrupoDefContrib.value = response
  //     })
  //     .finally(() => {
  //       loading.value = false
  //     })
  // }
})
</script>

<template lang="">
   <div class="grid">
     <div class="col-12">
       <div class="card">
         <Toast />
         <h4><Translate text="Grupo Definição de Contribuição" /></h4>
         <Toolbar class="mb-4">
           <template v-slot:start>
             <div class="my-2">
               <Button
                 label="Novo"
                 icon="pi pi-plus"
                 class="p-button-success"
                 @click="novo"
               />
             </div>
           </template>
         </Toolbar>
 
         <DataTable
           :value="listaGrupoDefContrib"
           :paginator="true"
           :rows="10"
           :loading="loading"
           :totalRegistros="totalRecords"
           responsiveLayout="scroll"
           dataKey="CODGDC"
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
             field="CODGDC"
             header="Código"
             :sortable="true"
             style="max-width: 10rem"
           >
             <template #body="{ data }">
               {{ data.CODGDC }}
             </template>
           </Column>
 
           <Column
             field="DESGDC"
             header="Descrição"
             :sortable="true"
             style="min-width: 12rem; width: 85rem;"
           >
             <template #body="slotProps">
               {{ slotProps.data.DESGDC }}
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
           v-model:visible="GrupoDefContribDialog"
           :style="{ width: '70%' }"
           header="Grupo Definição de Contribuição"
           :modal="true"
           class="p-fluid"
         >
           <div class="field">
             <label for="name">Descrição</label>
             <InputText
               v-model="objGrupoDefContrib.DESGDC"
               required="true"
               autofocus
               :class="{ 'p-invalid': submitted && !objGrupoDefContrib.DESGDC }"
               maxLength="30"
             />
             <small class="p-error" v-if="submitted && !objGrupoDefContrib.DESGDC"
               >Este campo é obrigatorio.</small>
           </div>
 
           <template #footer>
             <Button
               label="Fechar"
               icon="pi pi-times"
               class="p-button-text"
               @click="GrupoDefContribDialog = false"
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
