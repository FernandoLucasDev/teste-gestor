<script setup>
//Importando os scripts necessarios

import { useRoute, useRouter } from "vue-router"
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import TipoDespesaService from "../../../../service/financeiro/TipoDespesaService"

//inicializando as variaveis e usando as funções

const route = useRoute()
const router = useRouter()
//variavel que serve para mostrar o total de registros
const totalRecords = ref(0)
const toast = useToast()
const loading = ref(false)
//Objeto a ser enviado para o Back-End
const objTipoDespesa = ref({})
//objeto do dropdown
const objTipoDespesaDropdown = ref()
const objFrequenciaDropdown = ref()
//Lista de objTipoDespesas retornada pelo banco
const listaDespesa = ref([])
const optionsTipo = ref(
  [
    { label: 'DESPESA', value: "D" },
    { label: 'RECEITA', value: "R" },
  ]);
const optionsFrequencia = ref(
  [
    { label: 'MENSAL', value: "M" },
    { label: 'TRIMESTRAL', value: "T" },
    { label: 'ANUAL', value: "A" },
  ]);
const id = ref()
const editando = ref(false)
const submitted = ref(false)
//Variavel responsavel por abrir o modal
const openDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
const despesaDialog = ref(false)

//Função para filtrar regsitros no campo de busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

//Instanciando a classe que chama os metodos responsaveis por fazer a chamada de API
const despesaService = new TipoDespesaService()

//criando a função de load que vai ser responsavel por carregar a tela
const load = async (options) => {
  console.log("Entrou na função load")
  //referenciando a variavel loading usada para controlar o estado de carregamento
  loading.value = true

  await despesaService
    .all(options)
    .then((response) => {
      console.log("response", response)
      listaDespesa.value = response.map((item) => {
        console.log("ITEM", listaDespesa.value.find(element => element.value == item.CODTIPDES));
        return {
          CODTIPDES: item.CODTIPDES,
          DESTIPDES: item.DESTIPDES,
          TIPTIPDES: item.TIPTIPDES,
          FRETIPDES: item.FRETIPDES
        }
      })
      console.log("lista Despesa", listaDespesa);
      loading.value = false;
      if (response.length) {
        totalRecords.value = response.length
        listaDespesa.value = response
      }
    })

    .finally(() => {
      loading.value = false
    })
}

//Função que abre o modal para criar um novo registro
const novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  objTipoDespesa.value = {}
  objTipoDespesaDropdown.value = null
  objFrequenciaDropdown.value = null
  editando.value = false
  submitted.value = false
  despesaDialog.value = true
}

//Função do botão de editar
const edit = (_objTipoDespesa) => {
  console.log("Entrou na função edit")
  despesaDialog.value = true
  editando.value = true
  objTipoDespesa.value = _objTipoDespesa
  // console.log("lista despesa", listaDespesa.value);
  console.log("Objeto despesa", objTipoDespesa.value);
  console.log("OBJETO _DESPESA", _objTipoDespesa.value);
  objTipoDespesaDropdown.value = optionsTipo.value.find(element => element.value == _objTipoDespesa.value.TIPTIPDES)
  objFrequenciaDropdown.value = optionsFrequencia.value.find(element => element.value == _objTipoDespesa.value.FRETIPDES)
  console.log(optionsTipo.value.find(element => element.value == objTipoDespesa.value.TIPTIPDES));
}

//Função de confirmar deleção do registro desejado
const confirmDelete = (_objTipoDespesa) => {
  console.log("Entrou na função de confirmDelete")
  objTipoDespesa.value = _objTipoDespesa
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
    summary: "Tipo Despesa",
    detail: "Excluindo Registro",
    life: 3000,
  })

  console.log("objeto tipo despesa", objTipoDespesa.value.CODTIPDES);


  //Função que chama o metodo delete do objeto TipoDespesaService  passando como argumento o valor do atributo CODTIPDES do objeto despesaService.value
  despesaService.delete(objTipoDespesa.value.CODTIPDES).then((response) => {
    //verifica o valor da response para determinar se a exclusão foi bem-sucedida ou não. Se a response for avaliada como verdadeira, ou seja, se a exclusão foi bem-sucedida, o código dentro do bloco if será executado. Caso contrário, o código dentro do bloco else será executado.
    if (response) {
      toast.add({
        severity: "success",
        summary: "Tipo Despesa",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Tipo Despesa",
        detail: "Ocorreu um erro",
        life: 3000,
      })
    }
  })
}

const save = async () => {
  console.log("frequencia dropdown", objFrequenciaDropdown.value);
  console.log("despesa dropdown", objTipoDespesaDropdown.value.value);
  console.log("despesa dropdown", objTipoDespesaDropdown.value.label);
  console.log("despesa dropdown", objTipoDespesaDropdown);
  console.log("OBJETO DESPESA", objTipoDespesa);
  
  objTipoDespesa.value.TIPTIPDES = objTipoDespesaDropdown.value.value;
  objTipoDespesa.value.FRETIPDES = objFrequenciaDropdown.value.value;

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

  if (editando.value == true) {
    console.log("Objeto despesa", objTipoDespesa.value);
    // objTipoDespesa.value.id = objTipoDespesa.value.CODTIPDES
    // Nesta linha, a função update do serviço objTipoDespesa é chamada para atualizar o registro com base no objeto objTipoDespesa.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await despesaService.update(objTipoDespesa.value, id.value)
  } else {
    response = await despesaService.store(objTipoDespesa.value, id.value)
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

  despesaDialog.value = false
  editando.value = false
}

//Função que valida os campos
const validateFields = () => {
  console.log("entrou na função validateFields")
  if (objTipoDespesa.value.DESTIPDES == undefined || objTipoDespesa.value.DESTIPDES == "") {
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

//Função que é executada depois que a tela for montada
onMounted(() => {
  load()

  if (id.value) {
    loading.value = true
    despesaService
      .get(id.value)
      .then((response) => {
        despesaService.value = response
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
        <h5>Tipo Despesa/Receita</h5>
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
          :value="listaDespesa"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRegistros="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODTIPDES"
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
            field="CODTIPDES"
            header="Código"
            :sortable="true"
            style="max-width: 10rem"
          >
            <template #body="{ data }">
              {{ data.CODTIPDES }}
            </template>
          </Column>

          <Column
            field="DESTIPDES"
            header="Descrição"
            :sortable="true"
            style="min-width: 12rem; width: 85rem;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESTIPDES }}
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
          v-model:visible="despesaDialog"
          :style="{ width: '70%' }"
          header="Despesa/Receita"
          :modal="true"
          class="p-fluid"
        >

      <div class="field">
         <label for="name">Código</label>
         <InputText
         v-model="objTipoDespesa.CODTIPDES"
         required="true"
         autofocus
         :class="{ 'p-invalid': submitted && !objTipoDespesa.CODTIPDES }"
         maxLength="20"
         />
         <small class="p-error" v-if="submitted && !objTipoDespesa.DESTIPDES">Este Campo é obrigatorio.</small>
      </div>

      <div class="field">
           <label for="name">Descrição</label>
           <InputText
             v-model="objTipoDespesa.DESTIPDES"
             required="true"
             autofocus
             :class="{ 'p-invalid': submitted && !objTipoDespesa.DESTIPDES }"
             maxLength="20"/>
           <small class="p-error" v-if="submitted && !objTipoDespesa.DESTIPDES">Este Campo é obrigatorio.</small>
         </div>

          <div class="field">
            <label for="tipo">Tipo</label>
               <Dropdown id="tipo" v-model="objTipoDespesaDropdown" :options="optionsTipo" optionLabel="label" placeholder="Selecione" >
                <template #value="slotProps">
                    <div v-if="slotProps.value">
                      <span :class="'product-badge status-' +slotProps.value">{{slotProps.value.label}}</span>
                    </div>
                    <span v-else>
                      {{slotProps.placeholder}}
                    </span>
                  </template>
                </Dropdown>
          </div>


          <div class="field">
            <label for="frequencia">Frequencia</label>
               <Dropdown id="frequencia" v-model="objFrequenciaDropdown" :options="optionsFrequencia" optionLabel="label" placeholder="Selecione" >
                  <template #value="slotProps">
                    <div v-if="slotProps.value">
                      <span :class="'product-badge status-' + slotProps.value">{{slotProps.value.label}}</span>
                    </div>
                    <span v-else>
                      {{slotProps.placeholder}}
                    </span>
                  </template>
                </Dropdown>
          </div>

          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="despesaDialog = false"
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
