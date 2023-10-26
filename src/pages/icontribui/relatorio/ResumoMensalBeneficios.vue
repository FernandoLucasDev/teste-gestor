<script setup>
import { ref, onMounted } from 'vue';
import ConvenioService from '../../../service/ConvenioService';
import IcontribuiReportService from "../../../service/IcontribuiReportService";

const convenioService = new ConvenioService();
const icontribuiReportService = new IcontribuiReportService();

const meses = ref({
  1 : "Janeiro",
  2 : "Fevereiro",
  3 : "Março",
  4 : "Abril",
  5 : "Maio",
  6 : "Junho",
  7 : "Julho",
  8 : "Agosto",
  9 : "Setembro",
  10 : "Outubro",
  11 : "Novembro",
  12 : "Dezembro",
});

const convenio = ref();
const periodo = ref();
const adimplente = ref();

const convenios = ref([]);
const entries = ref([]);
const options = ref([
  { label : "Todos", value : "" },
  { label : "Sim", value : "S" },
  { label : "Não", value : "N" },
]);

// Loadings
const loading = ref(false);
const loadingConvenios = ref(false);

const create = () => {
  loading.value = true;
  icontribuiReportService.ResumoMensalBeneficios({
    CodCnv : convenio.value.value,
    periodo : periodo.value,
    adimplente : adimplente.value
  })
  .then(response => entries.value = response)
  .finally(() => {
    loading.value = false
  });
}

onMounted(() => {
  loadingConvenios.value = true;
  convenioService.all()
  .then(response => {
    convenios.value = response.map((entry)=>{
      return {label: entry.DESCNV, value: entry.CODCNV}
    })
  })
  .finally(() => {
    loadingConvenios.value = false
  });
})

</script>
<template>
  <div>
		<div class="p-fluid">
			<div class="grid">
				<div class="col-12">
					<div class="card">
            <div class="formgrid grid">
              <div class="field col-12 md:col-6">
                <label>Convênio</label>
                <Dropdown 
                  v-model="convenio" 
                  :options="convenios" 
                  :loading="loadingConvenios"
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
              <div class="field col-12 md:col-3 sm:col-6">
                <label for="name">Período:</label>
                <Calendar v-model="periodo" dateFormat="dd/mm/yy" :showIcon="true" selectionMode="range" :manualInput="false" />
              </div>
              <div class="field col-2 md:col-2">
                <label>Adimplência</label>
                <Dropdown 
                  v-model="adimplente" 
                  :options="options" 
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
              <div class="field col-6 md:col-2">
								<Button label="Gerar relatório" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;"
								@click="create" />
							</div>              
            </div>
          </div>
        </div>
        <div class="col-12">
					<div class="card">
						<DataTable 
							:value="entries" 
              :loading="loading"
							responsiveLayout="scroll">
								<template #empty>
										Nenhum registro encontrado
								</template>																
                <Column field="DESMOD" header="Modalidade" :sortable="true" style="min-width:12rem">
                    <template v-if="!loading" #body="{data}">
                      {{ data.DESMOD }}
                    </template>
                </Column>
                <Column field="ANO" header="Ano" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{ data.ANO }}
                    </template>
                </Column>									
                <Column field="MES" header="Mês" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{ meses[data.MES] }}
                    </template>
                </Column>									
                <Column field="QTD" header="Qtd. Titulares" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{ data.QTD }}
                    </template>
                </Column>
                <Column field="QTDDEP" header="Qtd. Dependentes" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{ data.QTDDEP }}
                    </template>
                </Column>
						</DataTable>
					</div>
				</div>
      </div>
    </div>
  </div>

</template>