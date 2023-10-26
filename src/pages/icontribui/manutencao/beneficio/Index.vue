<script setup>

import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import BeneficioService from "../../../../service/BeneficioService"
import EmpresaService from "../../../../service/EmpresaService"


//inicializando as variaveis e usando as funções

//variavel que serve para mostrar o total de registros
const totalRecords = ref(0)
const toast = useToast()
//Variavel responsavel pelo carregamento da tela 
const loading = ref(false)
// Variavel a ser enviada para o Back end
const objBeneficio = ref({})
// Variavel de lista retornada pelo banco usada no Data-Table 
const listaBeneficios = ref([])
// Variavel que verifica se algum valor foi editado na função edit 
const editando = ref(false)
// Variavel que verifica se algum dado/valor foi enviado corretamente ao banco 
const submitted = ref(false)
//Variavel responsavel por abrir o modal
const openDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
const BeneficioDialog = ref(false)


//Função para filtrar regsitros no campo de busca
const filters = ref({
   global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

//Instanciando a classe que chama os metodos responsaveis por fazer a chamada de API
const beneficioService = new BeneficioService()
// const empresaService = new EmpresaService()

const load = (options) => {
   console.log("Entro na função load");
   //referenciando a variavel loading usada para controlar o estado de carregamento
   loading.value = true

   // Chamando a API com os parametros passados 
   beneficioService
      .all(options).
      then((response) => {
         console.log("response", response);
         if (response.length) {
            totalRecords.value = response.length
            listaBeneficios.value = response;
         }
      })
      .finally(() => {
         loading.value = false
      })
}

const novo = () =>{
   console.log("Entrou na função novo");
   // Atualizando o valor da constante id atravês do atributo CODEMP do objeto _dados
   editando.value = false
   submitted.value = false
   objBeneficio.value = {}
   BeneficioDialog.value=true
}

const edit = (_dados) =>{
   console.log('entrou na função edit');
   //Atualiza o valor da constante editando como VERDADEIRO
   editando.value = true
   objBeneficio.value = _dados
   BeneficioDialog.value=true
}

const confirmDelete = (_dados) =>{
   console.log("Entrou na função de confirmDelete");
   objBeneficio.value = _dados

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

  //Função que chama o metodo delete do objeto objetoBeneficioService  passando como argumento o valor do atributo CODCDG do objeto grupoDefContribService.value
  console.log("Objeto Beneficio", objBeneficio.value);
  console.log("Objeto Beneficio", objBeneficio.value.CODEMP);
  beneficioService.delete(objBeneficio.value).then((response) => {
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
  // editando.value = false
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
    // objBeneficio.value.id = objBeneficio.value.CODBEN
    // Nesta linha, a função update do serviço objGrupoDefContrib é chamada para atualizar o registro com base no objeto objGrupoDefContrib.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await beneficioService.update(objBeneficio.value)
  } else {
    editando.value = false
    submitted.value = true
    response = await beneficioService.store(objBeneficio.value)
    console.log("response", response)
  }

  //Aqui, o código verifica se a variável response é avaliada como verdadeira.
  //Se response for verdadeiro, significa que a operação foi bem-sucedida e o código dentro do bloco if será executado.
  //Caso contrário, se response for falso, o código dentro do bloco else será executado.
  if (response) {
    BeneficioDialog.value = false

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

//Função que valida os campos
const validateFields = () => {
  console.log("entrou na função validateFields")
  if (!objBeneficio.value.DESBEN) {
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


onMounted(()=>{
   load()
})

</script>

<template lang="">
   <div class="grid">
     <div class="col-12">
       <div class="card">
         <Toast />
         <h4><Translate text="Beneficio" /></h4>
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
           :value="listaBeneficios"
           :paginator="true"
           :rows="10"
           :loading="loading"
           :totalRegistros="totalRecords"
           responsiveLayout="scroll"
           dataKey="CODBEN"
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
             Total de registros {{ totalRecords }}
           </template>
           <Column
             field="CODBEN"
             header="Código"
             :sortable="true"
             style="max-width: 10rem"
           >
             <template #body="{ data }">
               {{ data.CODBEN }}
             </template>
           </Column>
 
           <Column
             field="DESBEN"
             header="Descrição"
             :sortable="true"
             style="min-width: 12rem; width: 85rem;"
           >
             <template #body="slotProps">
               {{ slotProps.data.DESBEN }}
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
           v-model:visible="BeneficioDialog"
           :style="{ width: '70%' }"
           header="Beneficio"
           :modal="true"
           class="p-fluid"
         >
           <div class="field">
             <label for="name">Descrição</label>
             <InputText
               v-model="objBeneficio.DESBEN"
               required="true"
               autofocus
               :class="{ 'p-invalid': submitted && !objBeneficio.DESBEN }"
               maxLength="30"
             />
             <small class="p-error" v-if="submitted && !objBeneficio.DESBEN"
               >Este campo é obrigatorio.</small>
           </div>
 
           <template #footer>
             <Button
               label="Fechar"
               icon="pi pi-times"
               class="p-button-text"
               @click="BeneficioDialog = false"
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
             <span v-if="product">Deseja realmente excluir este Beneficio?</span>
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