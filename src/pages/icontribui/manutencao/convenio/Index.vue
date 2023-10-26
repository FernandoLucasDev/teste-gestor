<script setup>
import { FilterMatchMode } from "primevue/api"
import { onMounted } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import ConvenioService from "../../../../service/ConvenioService"
import TipoBeneficioService from "../../../../service/rh/TipoBeneficioService"
import GrupoConvenioService from "../../../../service/icontribui/GrupoConvenioService"
//Inicializando as variaveis

//Variavel que armazena o numero de registros retornados da consulta
const totalRecords = ref(0)
const id = ref()
//Variavel que armazena os dados a serem enviados pro BackEnd
const objConvenio = ref({})
//Variaveis de objetos dos dropdowns a serem armazenados os valores 
const objTipoBeneficioDropdown = ref({})
const objGrupoConvenioDropdown = ref({})
const objTipoPagamentoConvenioDropdown = ref({})
const objObrigatoriedadeConvenioDropdown = ref({})
const objCobrançaInadimplicênciaDropdown = ref({})
//Variavel que exibe a lista dos dados a serem retornados pelo banco de dados
const listaConvenio = ref([])
//lista de objetos a ser exibida pelo dropdown de grupoConvenio
const optionsTipoPagamentoConvenio = ref(
  [
    { label: 'pré-pago', value: "1" },
    { label: 'pós-pago', value: "2" },
  ]);
//Lista de objetos do dropdown de ObrigatoriedadeConvenio
const optionsSimNão = ref(
  [
    { label: 'Não', value: "N" },
    { label: 'Sim', value: "S" },
  ]);
const listaGrupoConvenio = ref([])
const entidade = ref([])

//Variaveis para os campos de entrada que serão usados apenas para validação
// const descricaoConvenioInput = ref(null);
// const diaLimiteCadastroInput = ref(null);

//Lista do dropdown de Beneficio
const listaTipoBeneficio = ref([])
//Variavel responsavel por controlar o aviso de erro/sucesso
const toast = useToast()
//Variavel responsavel por controlar o estado de carregamento da tela
const loading = ref(false)
//Variavel que controla se um dado foi editado ou não
const editando = ref(false)
//Variavel que é responsalvel por abrir o modal
const convenioDialog = ref(false)
//Variavel responsavel por abrir o modal de delete
const deleteDialog = ref(false)
//Variavel responsalve por verificar se os dados foram enviados corretamente
const submitted = ref(false)

//Variavel responsavel por fazer filtragem no campo busca
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const convenioService = new ConvenioService()
const tipoBeneficioService = new TipoBeneficioService()
const grupoConvenioService = new GrupoConvenioService()

// const load = async () => {
//   console.log("Entrou na função load")
//   //referenciando a variavel loading usada para controlar o estado de carregamento
//   loading.value = true
//   convenioService.all().then((response) => {
//   console.log("response", response);

//   // Mapear os dados do convênio
//   listaConvenio.value = response;

//   console.log("lista Convenio", listaConvenio);

//   loading.value = false;
//   totalRecords.value = listaConvenio.value.length;
// })  .finally(() => {
//       loading.value = false
//     })
// }
const load = async () => {
  console.log("Entrou na função load")
  //referenciando a variavel loading usada para controlar o estado de carregamento
  loading.value = true;
  listaConvenio.value = await convenioService.all();
  console.log(listaConvenio.value);
  totalRecords.value = listaConvenio.value.length;
  loading.value = false;
}

//Função que abre o modal para criar um novo registro
const Novo = () => {
  console.log("Entrou na função novo")
  id.value = null
  objConvenio.value = {}
  objTipoBeneficioDropdown.value = null
  objGrupoConvenioDropdown.value = null
  objTipoPagamentoConvenioDropdown.value = null
  objObrigatoriedadeConvenioDropdown.value = null
  objCobrançaInadimplicênciaDropdown.value = null
  editando.value = false
  submitted.value = false
  convenioDialog.value = true
}

const edit = (_objConvenio) => {
  console.log("Entrou na função edit")
  editando.value = true
  objConvenio.value = _objConvenio
  console.log("Objeto convenio", objConvenio.value);
  console.log("OBJETO _CONVENIO", _objConvenio);
  console.log(listaTipoBeneficio.value);
  objTipoBeneficioDropdown.value = listaTipoBeneficio.value.find(element => element.value == _objConvenio.CODTBE)
  console.log(listaGrupoConvenio.value);
  objGrupoConvenioDropdown.value = listaGrupoConvenio.value.find(element => element.value == _objConvenio.CODGCN)
  objTipoPagamentoConvenioDropdown.value = optionsTipoPagamentoConvenio.value.find(element => element.value == _objConvenio.TIPPAGCNV)
  objObrigatoriedadeConvenioDropdown.value = optionsSimNão.value.find(element => element.value == _objConvenio.OBRCNV)
  objCobrançaInadimplicênciaDropdown.value = optionsSimNão.value.find(element => element.value == _objConvenio.COBRETINACNV)

  for (const key in _objConvenio) {
    objConvenio.value[key] = _objConvenio[key]

    if (key == "DATINICNV" && typeof objConvenio.value[key] === "string" && objConvenio.value[key] !== "") {
      console.log(objConvenio.value[key]);
      const parts = objConvenio.value[key].split("-");
      console.log(parts);
      objConvenio.value[key] = new Date(parts[0], 1, 1);
    }

  }
  convenioDialog.value = true

}

//Função de confirmar deleção do registro desejado
const confirmDelete = (_objConvenio) => {
  console.log("Entrou na função de confirmDelete")
  objConvenio.value = _objConvenio
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
    summary: "Tipo Convenio",
    detail: "Excluindo Registro",
    life: 3000,
  })

  console.log("objeto convenio", objConvenio.value.CODCNV);


  //Função que chama o metodo delete do objeto convenioService  passando como argumento o valor do atributo CODCNV do objeto convenioService.value
  convenioService.delete(objConvenio.value).then((response) => {
    //verifica o valor da response para determinar se a exclusão foi bem-sucedida ou não. Se a response for avaliada como verdadeira, ou seja, se a exclusão foi bem-sucedida, o código dentro do bloco if será executado. Caso contrário, o código dentro do bloco else será executado.
    if (response) {
      toast.add({
        severity: "success",
        summary: "Tipo Convenio",
        detail: "Registro removido com sucesso",
        life: 3000,
      })

      load()
    } else {
      toast.add({
        severity: "error",
        summary: "Tipo Convenio",
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
  if (!retorno) {
    return
  } else {
    loading.value = true
  }

  let data = {};
  for (const key in objConvenio.value) {
    data[key] = objConvenio.value[key]

    if (key == "DATINICNV") {
      const year = objConvenio.value[key].getFullYear();
      data[key] = `${year}-01-01`; // Format: "yyyy-mm-dd"
    }

  }

  objConvenio.value.TIPPAGCNV = objTipoPagamentoConvenioDropdown.value.value;
  console.log(objTipoBeneficioDropdown);
  objConvenio.value.CODTBE = objTipoBeneficioDropdown.value.value;
  objConvenio.value.CODGCN = objGrupoConvenioDropdown.value.value;
  objConvenio.value.OBRCNV = objObrigatoriedadeConvenioDropdown.value.value;
  objConvenio.value.CODGCN = objGrupoConvenioDropdown.value.value;
  objConvenio.value.COBRETINACNV = objCobrançaInadimplicênciaDropdown.value.value;
  
  //imprime o resultado dessa variavel no console
  console.log(retorno)
  //Aqui, o código verifica o valor de retorno para determinar se os campos do formulário são válidos. Se retorno for avaliado como falso,
  // significa que há campos inválidos e o código dentro do bloco if será executado.
  // Caso contrário, se retorno for avaliado como verdadeiro, o código dentro do bloco else será executado.

  let response

  if (editando.value == true) {
    console.log("Objeto Convenio", objConvenio.value);
    // objConvenio.value.id = objConvenio.value.CODTIPDES
    // Nesta linha, a função update do serviço objConvenio é chamada para atualizar o registro com base no objeto objConvenio.value,
    // o valor de id.value e checked.value e então o resultado dessa operação é atribuído à variável response
    response = await convenioService.update(objConvenio.value, id.value)
  } else {
    response = await convenioService.store(objConvenio.value, id.value)
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

  convenioDialog.value = false
  editando.value = false
}


//Função que valida os dias do campo de dias
const isDiaValido = (dia) => {
  const numeroDia = parseInt(dia, 10);
  return numeroDia >= 1 && numeroDia <= 31;
};

//Função que valida os campos
const validateFields = () => {
  console.log("entrou na função validateFields")

  if (
    !objConvenio.value.DESCNV ||
    !objConvenio.value.DIALIMCNV ||
    !objConvenio.value.DIACORCNV ||
    !objConvenio.value.DATINICNV ||
    !objTipoBeneficioDropdown.value ||
    !objGrupoConvenioDropdown.value ||
    !objTipoPagamentoConvenioDropdown.value ||
    !objObrigatoriedadeConvenioDropdown.value ||
    !objCobrançaInadimplicênciaDropdown.value
  ) {
    console.log("Entrou na função de ValidateFields")
    toast.add({
      severity: "error",
      summary: "Atenção",
      detail: "Preencha todos os campos obrigatórios",
      life: 3000,
    })

    return false;

  }

  else {
    return true
  }
}

onMounted(async () => {
  await load();
  tipoBeneficioService.all().then((response) => {
    console.log("response", response)
    response.map((item) => {
      //  return {
      //    CODTBE: item.CODTBE,
      //    DESTBE: item.DESTBE,
      //  }
      listaTipoBeneficio.value.push({
        value: item.CODTBE,
        label: item.DESTBE,
      })
    })
    console.log("lista Beneficio", listaTipoBeneficio)

    // totalRecords.value = listaTipoBeneficio.value.length
  });
  grupoConvenioService.all().then((response) => {
    console.log("response", response)
    response.map((item) => {
      listaGrupoConvenio.value.push({
        value: item.CODGCN,
        label: item.DESGCN,
      })
    })
    console.log("lista Grupo Convenio", listaGrupoConvenio)

    // totalRecords.value = listaGrupoConvenio.value.length
  });

  if (id.value) {
    // loading.value = true
    convenioService
      .get(id.value)
      .then((response) => {
        convenioService.value = response
      })
    // .finally(() => {
    //   loading.value = false
    // })
  }
})
</script>

<template lang="">
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <h5>Convenio</h5>

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
          :value="listaConvenio"
          :paginator="true"
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          responsiveLayout="scroll"
          dataKey="CODCNV"
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
            field="CODENT"
            header="Código Entidade"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="{ data }">
              {{ data.CODCNV }}
            </template>
          </Column>
          <Column
            field="CODCNV"
            header="Código Convenio"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="{ data }">
              {{ data.CODCNV }}
            </template>
          </Column>
          <Column
            field="DESCNV"
            header="Descrição Convenio"
            :sortable="true"
            headerStyle="width:23%; min-width:5em;"
          >
            <template #body="slotProps">
              {{ slotProps.data.DESCNV }}
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
          v-model:visible="convenioDialog"
          :style="{ width: '70%' }"
          header="Convenio"
          :modal="true"
          class="p-fluid"
        >
          <div class="formgrid grid">
            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="name">Descrição</label>
              <InputText
                v-model="objConvenio.DESCNV"
                required="true"
                autofocus
                :class="{ 'p-invalid': submitted && !objConvenio.DESCNV }"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !objConvenio.DESCNV">
                Este campo é obrigatório.
              </small>
            </div>

            <div class="field col-12 md:col-6 sm:col-8">
              <label for="name">Entidade:</label>
              <EntidadeBox :selected="entidade" v-model="entidade" />
            </div>

            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="tipo">Tipo Beneficio</label>
              <Dropdown
                id="tipo"
                v-model="objTipoBeneficioDropdown"
                :options="listaTipoBeneficio"
                optionLabel="label"
                placeholder="Selecione"
                :class="{ 'p-invalid': submitted && !objConvenio.DESTBE }"
              >
              <small class="p-error" v-if="submitted && !objConvenio.DESTBE">
                Este campo é obrigatório.
              </small>
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

            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="tipo">Grupo Convenio</label>
              <Dropdown
                id="tipo"
                v-model="objGrupoConvenioDropdown"
                :options="listaGrupoConvenio"
                optionLabel="label"
                placeholder="Selecione"
                :class="{ 'p-invalid': submitted && !objConvenio.CODGCN }"
                maxLength="30"
              >
              <small class="p-error" v-if="submitted && !objConvenio.CODGCN">
                Este campo é obrigatório.
              </small>
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

            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="limiteCadastro">Dia limite para cadastro:</label>
              <InputText
                v-model="objConvenio.DIALIMCNV"
                :class="{
                  'p-invalid': submitted && !isDiaValido(objConvenio.DIALIMCNV),
                }"
                placeholder="Dia limite para cadastro (1-31)"
              />
              <small
                class="p-error"
                v-if="submitted && !isDiaValido(objConvenio.DIALIMCNV)"
              >
                O valor deve estar entre 1 e 31.
              </small>
            </div>
            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="corte">Dia de corte</label>
              <InputText
                v-model="objConvenio.DIACORCNV"
                :class="{
                  'p-invalid': submitted && !isDiaValido(objConvenio.DIACORCNV),
                }"
                placeholder="Dia de corte (1-31)"
              />
              <small
                class="p-error"
                v-if="submitted && !isDiaValido(objConvenio.DIACORCNV)"
              >
                O valor deve estar entre 1 e 31.
              </small>
            </div>

            <div class="field col-12 sm:col-12 md:col-6 lg:col-3">
              <label for="inicioConvenio">Data Início Convenio:</label>
              <Calendar
                v-model="objConvenio.DATINICNV"
                view="year"
                showIcon="true"
                dateFormat="yy"
              />
            </div>
            <br>
            <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="Obrigatorio">Obrigatorio Convenio:</label>
              <Dropdown
                id="tipo"
                v-model="objObrigatoriedadeConvenioDropdown"
                :options="optionsSimNão"
                optionLabel="label"
                placeholder="Selecione"
              >
              <small class="p-error" v-if="submitted && !objConvenio.OBRCNV">
                Este campo é obrigatório.
              </small>
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

            <div class="field field col-12 sm:col-12 md:col-12 lg:col-6">
              <label for="tipo">Tipo Pagamento:</label>
              <Dropdown
                id="tipo"
                v-model="objTipoPagamentoConvenioDropdown"
                :options="optionsTipoPagamentoConvenio"
                optionLabel="label"
                placeholder="Selecione"
              >
              <small class="p-error" v-if="submitted && !objConvenio.TIPPAGCNV">
                Este campo é obrigatório.
              </small>
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
              <label for="tipo">Cobrança Inadimplência:</label>
              <Dropdown
                id="tipo"
                v-model="objCobrançaInadimplicênciaDropdown"
                :options="optionsSimNão"
                optionLabel="label"
                placeholder="Selecione"
              >
              <small class="p-error" v-if="submitted && !objConvenio.COBRETINACNV">
                Este campo é obrigatório.
              </small>
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
          </div>

          
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="convenioDialog = false"
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
              @click="mandatoDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="Novo"
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
