<template>
  <div class="grid">
    <div class="col-12">
      <div class="p-fluid">
        <div class="card">
          <h4><Translate text="Envia contribuições email" /></h4>
          <Toast/>
          <hr/>
          <h5><Translate text="Filtros" /></h5>
          <div class="formgrid grid" v-if="loading">
            <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 w-50rem">
              <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-50rem">
                <div class="flex flex-column align-items-center sm:align-items-start gap-3 w-50rem">
                  <Skeleton class="w-50rem border-round h-2rem" />
                  <Skeleton class="w-15rem border-round h-2rem" />
                  <Skeleton class="border-round h-1rem w-30rem" />
                  <div class="flex align-items-center gap-3">
                      <Skeleton class="w-10rem border-round h-1rem" />
                      <Skeleton class="w-25rem border-round h-1rem" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="formgrid grid" v-if="!loading">
            <div class="field col-12 md:col-6 lg:col-6">
              <label for="empresa"><Translate text="Empresa" /></label>
              <Dropdown
                id="entidade"
                name="entidade"
                v-model="objEmpresa"
                :options="listaEmpresa"
                optionLabel="label"
                placeholder="Selecione"
                :class="{'p-invalid': submitted && !objFiltro.CODEMP}"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
              <small class="p-error" v-if="submitted && !objFiltro.CODEMP">Este campo é obrigatório.</small>
            </div>
            <div class="field col-12 md:col-6 lg:col-6">
              <label for="entidade"><Translate text="Entidade" /></label>
              <Dropdown
                id="entidade"
                name="entidade"
                :disabled="listaEntidade.length == 0"
                :loading="loadingEntidade"
                v-model="objEntidade"
                :options="listaEntidade"
                optionLabel="label"
                placeholder="Selecione"
                :class="{'p-invalid': submitted && objFiltro.CODEMP && !objFiltro.CODENT}"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
              <small class="p-error" v-if="submitted && objFiltro.CODEMP && !objFiltro.CODENT">Este campo é obrigatório.</small>
            </div>

            <div class="field col-12 md:col-4">
              <label for="anocnt"><Translate text="Ano" /></label>
              <Calendar id="anocnt" name="anocnt" v-model="objAnoCnt" view="year" dateFormat="yy" />
            </div>
            <div class="field col-12 md:col-4">
              <label for="cntini"><Translate text="Início faixa" /></label>
              <InputText id="cntini" name="cntini" v-model="objFiltro.NUMCNTINI"/>
            </div>
            <div class="field col-12 md:col-4">
              <label for="cntfin"><Translate text="Fim faixa" /></label>
              <InputText id="cntini" name="cntini" v-model="objFiltro.NUMCNTFIN"/>
            </div>

            <div class="field col-12 md:col-6">
              <label for="defcontrib"><Translate text="Definição" /></label>
              <Dropdown
                id="defcontrib"
                name="defcontrib"
                v-model="objDefContrib"
                :options="listaDefContrib"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col-12 md:col-3 lg:col-3">
              <label for="DatIniVenCnt"><Translate text="Vencimento inicial" /></label>
              <Calendar id="DatIniVenCnt" name="DatIniVenCnt" v-model="objDatIniVenCnt" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div class="field col-12 md:col-3 lg:col-3">
              <label for="DatFinVenCnt"><Translate text="Vencimento final" /></label>
              <Calendar id="DatFinVenCnt" name="DatFinVenCnt" v-model="objDatFinVenCnt" dateFormat="dd/mm/yy" showIcon />
            </div>

            <div class="field col-12 md:col-3 lg:col-3">
              <label for="DatIniNegCnt"><Translate text="Vencimento negociado inicial" /></label>
              <Calendar id="DatIniNegCnt" name="DatIniNegCnt" v-model="objDatIniNegCnt" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div class="field col-12 md:col-3 lg:col-3">
              <label for="DatFinNegCnt"><Translate text="Vencimento negociado final" /></label>
              <Calendar id="DatFinNegCnt" name="DatFinNegCnt" v-model="objDatFinNegCnt" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div class="field col-12 md:col-3 lg:col-3">
              <label for="alteradasApenasPorMim"><Translate text="Alteradas apenas por mim" /></label>
              <Dropdown
                id="alteradasApenasPorMim"
                name="alteradasApenasPorMim"
                v-model="objAlteradasApenasPorMim"
                :options="optionsSimNao"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col-12 md:col-3 lg:col-3">
              <label for="envioPendente"><Translate text="Envio pendente" /></label>
              <Dropdown
                id="envioPendente"
                name="envioPendente"
                v-model="objEnvioPendente"
                :options="optionsSimNao"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>

          </div>

          <div class="center-child">
            <Button label="Filtrar" icon="pi pi-search" class="p-button-success btn-fluid" style="margin-top: 15%;" @click="enviarContribuicao" />
          </div>
            
          </div>
        </div>

        <div class="card" v-if="hasFilter && screenShowing == 0">

            <h5><Translate text="Email" /></h5><br>

            <div class="grid-email">
              
                <DataTable
                  :value="sends"
                  :paginator="true"
                  :rows="10"
                  :rowsPerPageOptions="[5, 10, 20]"
                  scrollable scrollHeight="400px"
                  showGridlines 
                  resizableColumns
                  v-model:selection="selectedRegisters"
                >
                  <Column selectionMode="multiple" headerStyle="width: 1rem"></Column>
                  <Column field="NOMEMP" header="Empresa" sortable ></Column>
                  <Column field="CODENT" header="Cod. Ent." sortable ></Column>
                  <Column field="NOMENT" header="Nome Ent." sortable ></Column>
                  <Column field="NUMCNT" header="Num. Contrib." sortable ></Column>
                  <Column field="CODDFC" header="Tipo Contrib." sortable ></Column>
                  <Column field="VALCNT" header="Valor" sortable ></Column>
                  <Column field="EMAENT" header="Email Ent." sortable ></Column>
                  <Column field="DATVENCNT" header="Vencimento" sortable ></Column>
                </DataTable>
              
            </div>

            <div class="center-child">
              <Button label="Gravar Email com Contribuições selecionadas" class="p-button-success btn-fluid" style="margin-top: 15%;" @click="changeScreen" />
            </div>

        </div>

        <div class="card" v-if="hasFilter && selectedRegisters.length > 0 && screenShowing == 1">
          <h5><Translate text="Email" /></h5>
          <div class="formgrid grid" v-if="loading">
            <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 w-50rem">
              <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-50rem">
                <div class="flex flex-column align-items-center sm:align-items-start gap-3 w-50rem">
                  <Skeleton class="w-50rem border-round h-2rem" />
                  <Skeleton class="w-15rem border-round h-2rem" />
                  <Skeleton class="border-round h-1rem w-30rem" />
                  <div class="flex align-items-center gap-3">
                      <Skeleton class="w-10rem border-round h-1rem" />
                      <Skeleton class="w-25rem border-round h-1rem" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="formgrid grid" v-if="!loading">
            <div class="field col-12 md:col-4 lg:col-4 inp-email">
              <label for="codEma"><Translate text="Cobrança" /></label>
              <Dropdown
                id="codEma"
                name="codEma"
                v-model="objCobranca"
                :options="optionsSimNao"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col-12 md:col-4 lg:col-4  inp-email">
              <label for="impEndEnt"><Translate text="Envia para contabilidade" /></label>
              <Dropdown
                id="impEndEnt"
                name="impEndEnt"
                v-model="objEnviaContabilidade"
                :options="optionsSimNao"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>
            <div class="field col-12 md:col-4 lg:col-4  inp-email">
              <label for="aneLisEmp"><Translate text="Anexa lista empregados" /></label>
              <Dropdown
                id="aneLisEmp"
                name="aneLisEmp"
                v-model="objAnexaListaEmpregados"
                :options="optionsSimNao"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col-12 md:col-6 lg:col-4 inp-email">
              <label for="emaall"><Translate text="Substituir e-mails por" /></label>
              <InputText id="emaall" name="emaall" v-model="objFiltro.EMAALL"/>
            </div>
            <div class="field col-12 md:col-6 lg:col-4 inp-email">
              <label for="nomEmm"><Translate text="Nome" /></label>
              <InputText id="nomEmm" name="nomEmm" v-model="objFiltro.NOMEMM"/>
            </div>
            <div class="field col-12 md:col-6 lg:col-4 inp-email">
              <label for="ccoEma"><Translate text="C.c" /></label>
              <InputText id="ccoEma" name="ccoEma" v-model="objFiltro.CCOEMA"/>
            </div>
            <div class="field col-12 md:col-6 lg:col-4 inp-email">
              <label for="bcoEma"><Translate text="Cópia oculta" /></label>
              <InputText id="bcoEma" name="bcoEma" v-model="objFiltro.BCOEMA"/>
            </div>

            <div class="field col-12 md:col-8 lg:col-8 inp-email">
              <label for="tipEmm"><Translate text="Mensagem" /></label>
              <InputText id="tipEmm" name="tipEmm" v-model="objFiltro.TIPEMM"/>
            </div>
            <div class="field col-12 md:col-4 lg:col-4 inp-email">
              <label for="locMsgAddEmm"><Translate text="Localização mensagem adicional" /></label>
              <Dropdown
                id="locMsgAddEmm"
                name="locMsgAddEmm"
                v-model="objLocalizacaoMensagemAdicional"
                :options="optionsLocMsgAdd"
                optionLabel="label"
                placeholder="Selecione"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value && slotProps.value.value">
                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                  </div>
                  <span v-else>
                    {{slotProps.placeholder}}
                  </span>
                </template>
              </Dropdown>
            </div>

            <div class="field col-12 md:col-4 lg:col-4 inp-email">
              <label for="EmailModelo"><Translate text="Modelo do email" /></label>
              <Dropdown v-model="selectEmailModel" :options="emailItems" optionLabel="label" optionValue="value" placeholder="Selecione" class="w-full md:w-14rem" />
            </div>

            <div class="field col-12">
              <label for="msgAddEmm"><Translate text="Mensagem adicional" /></label>
              <Editor id="msgAddEmm" name="msgAddEmm" v-model="objFiltro.MSGADDEMM" editorStyle="height: 320px"/>
            </div>

            
            <div class="center-child">
              <Button label="Enviar email" icon="pi pi-search" class="p-button-success btn-fluid" style="margin-top: 15%;" @click="getSelectedContent" />
            </div>
            <div class="center-child">
              <Button label="Voltar a tela de listagem" class="p-button-Info btn-fluid" style="margin-top: 15%;" @click="changeScreen" />
            </div>
            
        </div>
      
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, watch, onBeforeMount } from 'vue';
import EmpresaService from '../../../../service/EmpresaService'
import EntidadeService from '../../../../service/EntidadeService'
import DefContribService from '../../../../service/DefContribService'
import EmailContribService from '../../../../service/EmailContribService';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

/* Services */
const empresaService = new EmpresaService();
const entidadeService = new EntidadeService();
const defContribService = new DefContribService();

/* Controle de tela */
const loading = ref(false);
const loadingEntidade = ref(false);
const submitted = ref(false);

/* Listas dos dropdonws */
const listaEmpresa = ref([]);
const listaEntidade = ref([]);
const listaDefContrib = ref([]);
const optionsSimNao = reactive([
  {label: "Sim", value: "S"},
  {label: "Não", value: "N"}
]);
const optionsLocMsgAdd = reactive([
  {label: "Início", value: "S"},
  {label: "Fim", value: "N"}
]);

/* Objetos dropdown */
const objEmpresa = ref();
const objEntidade = ref();
const objDefContrib = ref();
const objAlteradasApenasPorMim = ref();
const objEnvioPendente = ref();
const objCobranca = ref();
const objEnviaContabilidade = ref();
const objAnexaListaEmpregados = ref();
const objMensagem = ref();
const objLocalizacaoMensagemAdicional = ref();
const objAnoCnt = ref(new Date());
const objDatIniVenCnt = ref();
const objDatFinVenCnt = ref();
const objDatIniNegCnt = ref();
const objDatFinNegCnt = ref();
const emailTypes = ref();
const emailItems = ref();
const sends = ref();
let selectedRegisters = ref([]);
const hasFilter = ref(false);
const selectEmailModel = ref();
const screenShowing = ref(0);

/* Objeto do formulário */
const objFiltro = reactive({})

watch(objEmpresa, async (valor) => {
  console.log(valor);
  objFiltro.CODEMP = valor.value;
  loadingEntidade.value = true;
  let responseEntidade = await entidadeService.allResumido();
  listaEntidade.value = responseEntidade.map((entidade) => {
    return {
      label: entidade.NOMENT,
      value: entidade.CODENT,
    }
  });
  loadingEntidade.value = false;
});

watch(objEntidade, async (valor) => {
  objFiltro.CODENT = valor.value;
});

watch(objAnoCnt, async (valor) => {
  objFiltro.ANOCNT = valor.getFullYear();
});

watch(objDefContrib, async (valor) => {
  objFiltro.CODDFC = valor.value;
});

watch(objDatIniVenCnt, async (valor) => {
  objFiltro.DATINIVENCNT = formataData(valor);
});

watch(objDatFinVenCnt, async (valor) => {
  objFiltro.DATFINVENCNT = formataData(valor);
});

watch(objDatFinNegCnt, async (valor) => {
  objFiltro.DATFINNEGCNT = formataData(valor);
});

watch(objDatFinVenCnt, async (valor) => {
  objFiltro.DATFINVENCNT = formataData(valor);
});


onBeforeMount(async () => {
  loading.value = true;
  let responseEmpresa = await empresaService.all();
  listaEmpresa.value = responseEmpresa.map((empresa) => {
    return {
      label: empresa.NOMEMP,
      value: empresa.CODEMP
    }
  });
  let responseDefContrib = await defContribService.all();
  listaDefContrib.value = responseDefContrib.map((defContrib) => {
    return {
      label: defContrib.DESDFC,
      value: defContrib.CODDFC
    }
  });
  console.log("listaDefContrib.value", listaDefContrib.value);
  loading.value = false;
})

/**
 * @description Recebe uma string de Date e retorna uma data no padrão do banco de dados
 * @param {Date} data
 * @returns yyyy-mm-dd
 */
function formataData(data) {
  return [data.getFullYear(), (data.getMonth()+1).toString().padStart(2, "0"), (data.getDate()).toString().padStart(2, "0")].join("-");
}

/**
 * @description Realiza a validação dos filtros obrigatórios e caso retorne false vai impedir a requisição para a API
 */
function validaFiltros() {
  if(objFiltro.CODEMP && objFiltro.CODENT){
    return true;
  }
  return false;
}

/**
 * @description Envia requisição para a API
 */
// function enviarContribuicao() {
//   // submitted.value = true;
//   // if(!validaFiltros()) return;
  
//   console.log(objFiltro);
//   sends.value = EmailContribService.getDataToEmailList(objFiltro.CODEMP, objFiltro.CODEMP, objFiltro.CODDFC);
//   console.log('SENDS:')
//   console.log(sends);
//   // submitted.value = false;
// }

EmailContribService.getTypeEmail()
  .then(function (data) {
    console.log('Dados recebidos:');
    emailTypes.value = data;
    emailItems.value = emailTypes.value.map(item => item);
    console.log(emailItems);
  })
  .catch(function (error) {
    console.error('Erro ao obter dados da API:', error);
  });

function enviarContribuicao() {
  console.log(objFiltro);

  EmailContribService.getDataToEmailList(objFiltro.CODEMP, objFiltro.CODEMP, objFiltro.CODDFC)
    .then(function (data) {
      console.log('Dados recebidos:');
      sends.value = data;
      console.log(sends);
      hasFilter.value = true;
    })
    .catch(function (error) {
      console.error('Erro ao obter dados da API:', error);
    });
}

function getSelectedContent() {
     
      const selectedValues = selectedRegisters.value.map(item => item);
      console.log(selectedValues);

      const test = EmailContribService.sendToEmailRow(selectedValues);
}

function changeScreen() {
  screenShowing.value == 0 ? screenShowing.value = 1 : screenShowing.value = 0;
}

</script>

<style>

</style>