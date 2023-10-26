<script setup>
import { onMounted, reactive } from "vue"
import { ref, defineProps } from "vue"
import GrupoDefContribService from "@/service/GrupoDefContribService"
import ConvenioService from "@/service/ConvenioService"
import ApoliceService from "@/service/ApoliceService"
import { useToast } from "primevue/usetoast";
import FormCedente from './Cedente.vue'
import FormValores from './Valores.vue'

const grupoDefContribService = new GrupoDefContribService();
const convenioService = new ConvenioService();
const apoliceService = new ApoliceService();
const submitted = ref(false);
const erroININNUDFC = ref(false);
const toast = useToast();

const props = defineProps({
  dfc: {
    type: Object,
    required: true
  }
});

const objDefcontrib = reactive(props.dfc.value);

const cobrancaRegistrada = ref();
const associados = ref();
const indivAssociados = ref();
const valorPatronal = ref();
const segurados = ref();
const indivSegurados = ref();
const contribuicaoInativa = ref();
const emissaoParaFuncionario = ref();
const mostraValores = ref();
const enviaEventosParaBanco = ref();
const aceitaEmissaoVencida = ref();
const relatorio = ref();
const validaMes = ref();
const convenio = ref();
const apolice = ref();

const listaTipo = ref([
  {label: "SICAS", value: 1},
  {label: "SAD SICOOB", value: 2},
  {label: "CNR - HSBC", value: 3},
  {label: "SINCO", value: 4},
  {label: "SITCS", value: 5}
]);
const objTipo = ref({});
const opcoesSimNao = reactive([
	{ label: "Sim", value: "S" },
	{ label: "Não", value: "N" },
]);
const listaGrupo = ref([]);
const objGrupo = ref({});
const listaConvenio = ref([]);
const objConvenio = ref([]);
const listaApolice = ref([]);
const objApolice = ref([]);

function validaININNUDFC(){
  if(objDefcontrib.ININNUDFC > 99 || objDefcontrib.ININNUDFC < 0){
    objDefcontrib.ININNUDFC = "";
    erroININNUDFC.value = true;
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "O inicio nosso número deve ter apenas dois algarismos",
      life: 3000,
    });
  }
}

onMounted(()=>{
  grupoDefContribService.all().then((response)=>{
    listaGrupo.value = response.map((entry)=>{
      return {label: entry.DESGDC, value: entry.CODGDC}
    })
  });

  convenioService.all().then((response)=>{
    listaConvenio.value = response.map((entry)=>{
      return {label: entry.DESCNV, value: entry.CODCNV}
    })
  });

  apoliceService.all().then((response)=>{
    listaApolice.value = response.map((entry)=>{
      return {label: entry.NUMAPO, value: entry.NUMAPO}
    })
  });
})

</script>

<template>
  <div class="form grid">
    <div class="field col-12 sm:col-12 md:col-6">
      <label for="name">Descrição</label>
      <InputText v-model.trim="objDefcontrib.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" />
      <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
    </div>
    <div class="field col-12 sm:col-6 md:col-3">
      <label for="name">Grupo</label>
      <Dropdown v-model="objGrupo" @change="objDefcontrib.CODGDC = objGrupo.value" :options="listaGrupo" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <!-- <InputText v-model.trim="objDefcontrib.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" /> -->
      <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
    </div>
    <div class="field col-12 sm:col-6 md:col-3">
      <label for="name">Tipo</label>
      <Dropdown v-model="objTipo" @change="objDefcontrib.TIPDFC = objTipo.value" :options="listaTipo" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
    </div>

    <TabView class="col-12">
      <TabPanel header="Dados gerais">
        <div class="form grid">
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Início nosso número</label>
            <InputText v-model.trim="objDefcontrib.ININNUDFC" @change="validaININNUDFC()" required="true" autofocus :class="{'p-invalid': (submitted && !objDefcontrib.ININNUDFC) || erroININNUDFC}" />
            <small class="p-invalid" v-if="(submitted && !objDefcontrib.ININNUDFC) || erroININNUDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Aceite</label>
            <InputText v-model.trim="objDefcontrib.ACEDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Espécie</label>
            <InputText v-model.trim="objDefcontrib.ESPDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Espécie do doc</label>
            <InputText v-model.trim="objDefcontrib.ESPDOCDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Carteira</label>
            <InputText v-model.trim="objDefcontrib.CARDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DESDFC}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Cobrança registrada</label>
            <Dropdown v-model="cobrancaRegistrada" @change="objDefcontrib.COBREGDFC = cobrancaRegistrada.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Associados</label>
            <Dropdown v-model="associados" @change="objDefcontrib.ASSDFC = associados.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Indiv. associados</label>
            <Dropdown v-model="indivAssociados" @change="objDefcontrib.INDASSDFC = indivAssociados.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Valor patronal</label>
            <Dropdown v-model="valorPatronal" @change="objDefcontrib.PATDFC = valorPatronal.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Segurados</label>
            <Dropdown v-model="segurados" @change="objDefcontrib.SEGDFC = segurados.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Indiv. segurados</label>
            <Dropdown v-model="indivSegurados" @change="objDefcontrib.INDSEGDFC = indivSegurados.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Contribuição inativa</label>
            <Dropdown v-model="contribuicaoInativa" @change="objDefcontrib.INADFC = contribuicaoInativa.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Código contábil</label>
            <InputText v-model.trim="objDefcontrib.CODCTB" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.CODCTB}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.CODCTB">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Emissão para funcionário</label>
            <Dropdown v-model="emissaoParaFuncionario" @change="objDefcontrib.EMIFUNDFC = emissaoParaFuncionario.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Mostra valores</label>
            <Dropdown v-model="mostraValores" @change="objDefcontrib.MOSVALDFC = mostraValores.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Díg. nosso número</label>
            <InputText v-model.trim="objDefcontrib.DIGNNUDFC" required="true" autofocus :class="{'p-invalid': submitted && !objDefcontrib.DIGNNUDFC}" />
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DIGNNUDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Envia eventos para o banco</label>
            <Dropdown v-model="enviaEventosParaBanco" @change="objDefcontrib.ENVEVEDFC = enviaEventosParaBanco.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Aceita emissão vencida</label>
            <Dropdown v-model="aceitaEmissaoVencida" @change="objDefcontrib.EMIVENDFC = aceitaEmissaoVencida.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Relatório</label>
            <Dropdown v-model="relatorio" @change="objDefcontrib.CODWSR = relatorio.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Valida mês</label>
            <Dropdown v-model="validaMes" @change="objDefcontrib.VALMESDFC = relatorio.value" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <!-- <small class="p-invalid" v-if="submitted && !emissaoParaFuncionario.value">Este campo é obrigatório.</small> -->
          </div>
        </div>

      </TabPanel>
      <TabPanel header="Cedente">
        <FormCedente :ced="objDefcontrib.cedente" @change="(value) => objDefcontrib.cedente = value" />
      </TabPanel>
      <TabPanel header="Valores">
        <!-- <FormValores :val="objDefcontrib.valores" /> -->
      </TabPanel>
      <TabPanel header="Linha digitável">
        
        <div class="form grid">
          <div class="field col-12 sm:col-12 md:col-12 lg:col-12">
            <label for="name">Linha digitável</label>
            <!-- <InputText v-model.trim="objDefcontrib.ININNUDFC" @change="validaININNUDFC()" required="true" autofocus :class="{'p-invalid': (submitted && !objDefcontrib.ININNUDFC) || erroININNUDFC}" /> -->
            <Textarea
              @change="validaININNUDFC()"
              :class="{'p-invalid': (submitted && !objDefcontrib.ININNUDFC) || erroININNUDFC}"
              class="w-12"
              v-model.trim="objDefcontrib.LINDIGDFC"
              required="true"
              rows="5"
              autofocus />
            <small class="p-invalid" v-if="(submitted && !objDefcontrib.ININNUDFC) || erroININNUDFC">Este campo é obrigatório.</small>
          </div>
        </div>
        
      </TabPanel>
      <TabPanel header="Benefícios">
        
        <div class="form grid">
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Convênio</label>
            <Dropdown v-model="convenio" @change="objDefcontrib.CODCNV = convenio.value" :options="listaConvenio" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
          <div class="field col-12 sm:col-6 md:col-4 lg:col-3">
            <label for="name">Apólice</label>
            <Dropdown v-model="apolice" @change="objDefcontrib.NUMAPO = apolice.value" :options="listaApolice" optionLabel="label" placeholder="Selecione">
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !objDefcontrib.DESDFC">Este campo é obrigatório.</small>
          </div>
        </div>
        
      </TabPanel>
    </TabView>

  </div>
</template>