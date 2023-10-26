<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useToast } from "primevue/usetoast";
import moment from 'moment';

import DefContribService from '@/service/DefContribService';
import GeraContribuicaoService from '@/service/GeraContribuicaoService';
import CondicaoPagamentoService from '@/service/financeiro/CondicaoPagamentoService';

const InputCurrency = defineAsyncComponent(() => import('@/components/InputCurrency.vue'));

const toast = useToast();

const defContribService = new DefContribService();
const geraContribuicaoService = new GeraContribuicaoService();
const condicaoPagamentoService = new CondicaoPagamentoService();

const definicoes = ref([]);
const condicoesPagamento = ref([]);
const DatVenCntDisabled = ref(false);
const loadingDef = ref(false);
const dialogConfirm = ref(false);
const started = ref(false);
const progress = ref(0);
const tipoOptions = ref([
  {label : 'Não', value : "N"},
  {label : 'Sim', value : "S"},
]);
const meses = ref([
  {label: "Janeiro", value : 1},
  {label: "Fevereiro", value : 2},
  {label: "Março", value : 3},
  {label: "Abril", value : 4},
  {label: "Maio", value : 5},
  {label: "Junho", value : 6},
  {label: "Julho", value : 7},
  {label: "Agosto", value : 8},
  {label: "Setembro", value : 9},
  {label: "Outubro", value : 10},
  {label: "Novembro", value : 11},
  {label: "Dezembro", value : 12},
]);

// Fields
const CodDfc = ref();
const AnoCnt = ref();
const AvuDfc = ref();
const QtdCnt = ref(1);
const MesCnt = ref();
const ValCnt = ref();
const CalVal = ref();
const GerMas = ref();
const DatVenCnt = ref();
const DiaVenPad = ref();
const CodEnt = ref();
const CodCnd = ref();

let interval;

const vencimentoPadraoSelecionado = () => {
  if (DiaVenPad.value) {
    DatVenCntDisabled.value = true;
  }
  else {
    DatVenCntDisabled.value = false;
  }
}

const preDone = () => {
  if (!AnoCnt.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe o exercício', life : 3000});
    return false;
  }
  if (!MesCnt.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe a referência', life : 3000});
    return false;
  }
  if (!CodDfc.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe a definição', life : 3000});
    return false;
  }
  if (!QtdCnt.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe a quantidade de contribuições a gerar', life : 3000});
    return false;
  }
  if (!CodCnd.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe a condição de pagamento', life : 3000});
    return false;
  }
  if (!ValCnt.value && !CalVal.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Escolha se o valor é calculado ou defina um valor', life : 3000});
    return false;
  }
  if (!DiaVenPad.value && !DatVenCnt.value) {
    toast.add({severity:'warn', summary: 'Contribuições', detail: 'Escolha se o vencimento é padrão ou defina um vencimento', life : 3000});
    return false;
  }

  dialogConfirm.value = true;
}

const done = () => {
  started.value = false;

  toast.add({severity:'info', summary: 'Contribuições', detail: 'Gerando contribuições, aguarde...',});

  geraContribuicaoService.overview({
    AnoCnt : AnoCnt.value,
    CodDfc : CodDfc.value.value,
    QtdCnt : QtdCnt.value,
    MesCnt : MesCnt.value.value,
    ValCnt : ValCnt.value,
    CalVal : CalVal.value,
    GerMas : GerMas.value,
    CodCnd : CodCnd.value.value,
    DatVenCnt : DatVenCnt.value,
    DiaVenPad : DiaVenPad.value,
    CodEnt : CodEnt.value == null ? null : CodEnt.value.value
  })
  .then(response => {
    started.value = true;
    monitor(response);

    interval = setInterval(
      () => {
        monitor(response)
      },
      5000    
    );

    geraContribuicaoService.store({
      gera_contribuicao_controle_id : response
    })
  })
  .finally(() => {
    toast.removeAllGroups();
  });
}

const monitor = (id) => {
  geraContribuicaoService.status(id)
  .then(response => {
    if (response.total && response.index) {
      progress.value = Math.floor((response.index * 100) / response.total);
    }    
  });
}

const stop = () => {
  geraContribuicaoService.abort();

  toast.add({severity:'warn', summary: 'Contribuições', detail: 'Geração de contribuições cancelada',});

  clearInterval(interval);

  started.value = false;
}

onMounted(() => {
  AnoCnt.value = (new Date()).getFullYear();
  AvuDfc.value = tipoOptions.value[0];

  loadingDef.value = true;

  defContribService.all()
  .then(response => {
    const data = [];

    response.map(
      (entry) => data.push({label : entry.DESDFC, value : entry.CODDFC})
    );

    definicoes.value = data;
  })
  .finally(() => {
    loadingDef.value = false;
  });

  condicaoPagamentoService.all()
  .then(
    response => {
      const data = [];

      response.map(
        (entry) => data.push({label : entry.DESCND, value : entry.CODCND})
      );

      condicoesPagamento.value = data;
    }
  );
});
</script>

<template>
  <Toast />
  <div class="grid">
		<div class="col-12 md:col-12">
      <div class="p-fluid">
        <div class="card">
          <h5>Gera Contribuição</h5>

          <div class="formgrid grid">
            <div class="field col-12 md:col-6">
              <label>Definição</label>
              <Dropdown 
                v-model="CodDfc" 
                :options="definicoes" 
                :loading="loadingDef"
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
          <div v-if="CodDfc">
            <div class="formgrid grid">
              <div class="field col-12 md:col-2">
                <label>Exercício</label>
                <InputText v-model="AnoCnt" type="number" />
              </div>
              <div class="field col-12 md:col-3">
                <label>Mês de referência</label>
                <Dropdown
                  v-model="MesCnt" 
                  :options="meses"
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
              <div class="field col-12 md:col-1">
                <label>Qtd.</label>
                <InputText v-model="QtdCnt" type="number" />
              </div>              
              <div class="field flex flex-column gap-3 md:col-3 sm:col-12 pt-0">
                <label>Geração em massa?</label>
                <Checkbox v-model="GerMas" :binary="true" />
              </div>
            </div>

            <hr />
            <div class="formgrid grid">
              <div class="field flex flex-column gap-3 md:col-3 sm:col-12 pt-0">
                <label>Valor</label>
                <InputCurrency v-model="ValCnt" />
              </div>              
              <div class="field flex flex-column gap-3 md:col-3 sm:col-12 pt-0">
                <label>Calcula valor?</label>
                <Checkbox v-model="CalVal" :binary="true" />
              </div>
              
              <div class="field col-12 md:col-6">
                <label>Condição de pagamento</label>
                <Dropdown 
                  v-model="CodCnd" 
                  :options="condicoesPagamento" 
                  :loading="loadingDef"
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

            <hr />
            <div class="formgrid grid">
              <div class="field col-12 md:col-2">
                <label>Vencimento</label>
                <Calendar dateFormat="dd/mm/yy" v-model="DatVenCnt" :manualInput="false" :disabled="DatVenCntDisabled" />
              </div>
              <div class="field flex flex-column gap-3 md:col-3 sm:col-12 pt-0">
                <label>Vencimento padrão?</label>
                <Checkbox v-model="DiaVenPad" :binary="true" @change="vencimentoPadraoSelecionado"/>
              </div>
            </div>
            <hr />
            <div class="formgrid grid">
              
              <h2 class="field col-12 md:col-12">Filtros</h2>              
              
              <div class="field col-12 md:col-12">
                <label>Entidade</label>
                <EntidadeBox v-model="CodEnt" />
              </div>              
            </div>
            <hr />
            <div class="formgrid grid">              
              <div class="field col-12 md:col-2">
                <Button icon="pi pi-check" label="Gerar" @click="preDone"></Button>
              </div>              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="dialogConfirm" modal header="Geração de contribuições" :style="{ width: '50vw' }">    
    <p>Confirma estas informações de geração?</p>
    
    <p><strong>Exercício:</strong> {{ AnoCnt }}</p>
    <p><strong>Referência:</strong> {{ MesCnt.label }}</p>
    <p><strong>Definição:</strong> {{ CodDfc.label }}</p>
    
    <p><strong>Condição de pagamento:</strong> {{ CodCnd.label }}</p>
    <p><strong>Valor:</strong> {{ CalVal ? "A calcular" : ValCnt }}</p>
    <p><strong>Vencimento:</strong> {{ DiaVenPad ? "Padrão do sistema" : moment(DatVenCnt).format("DD/MM/YYYY") }}</p>    
    <p><strong>Quantidade a gerar:</strong> {{ QtdCnt }}</p>

    <div class="field col-12 md:col-12" v-if="started">
      <Message severity="success" v-if="progress == 100">Geração concluída</Message>
      <p v-else>Aguarde...</p>
      <ProgressBar :value="progress"></ProgressBar>
    </div>

    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-warning" @click="dialogConfirm = false" text />
      <Button label="Parar geração" icon="pi pi-stop-circle" class="p-button-danger" @click="stop" text v-if="started && progress != 100" />
      <Button label="Confirmar" icon="pi pi-check" class="p-button-success" @click="done" autofocus />
    </template>
  </Dialog>
</template>