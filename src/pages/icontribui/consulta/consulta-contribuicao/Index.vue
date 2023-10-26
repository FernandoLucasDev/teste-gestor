<script setup>

import { ref, reactive, onMounted } from 'vue';
import { useToast } from "primevue/usetoast";
import EntidadeService from '../../../../service/EntidadeService';
import ContribuicaoService from "../../../../service/icontribui/ContribuicaoService";
import DefContribService from "../../../../service/DefContribService";
import moment from "moment";

import { moneyFormat } from "../../../../mixins/Formatters";
import { cnpjMask } from "../../../../defaults/mask";

const entidadeService = new EntidadeService();
const contribuicaoService = new ContribuicaoService();
const defContribService = new DefContribService();

const toast = useToast();
const loading = ref();
const skeleton = ref(false);
const definicoes = ref();
const loadingDef = ref(false);

const ano = ref();
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
const CodDfc = ref();
const entidade = ref([]);
const totalRecords = ref(0);
const opcoesSimNao = reactive([
	{ label: "Sim", value: "S" },
	{ label: "Não", value: "N" },
]);
const dialogInfo = ref(false);
const contribuicao = ref();

const filtro = reactive({
	ano: "",
	numeroInicial: "",
	numeroFinal: "",
	entidade: null,
	vencimentoInicial: "",
	vencimentoFinal: "",
	abertas: "" ,
	canceladas: ""
});

// function onPage(event) {
// 	buscaConsultaContribuicao(event);
// }

const buscaConsultaContribuicao = async (options = null) => {
		let data = {
			CODDFC : CodDfc.value.value,
		  ANOCNT: filtro.ano != "" ? filtro.ano.getUTCFullYear() : filtro.ano,
		  NUMINICNT: filtro.numeroInicial,
		  NUMFINCNT: filtro.numeroFinal,
		  CODENT: filtro.entidade ? filtro.entidade.value : "",
		  DATINIVENCNT: filtro.vencimentoInicial != "" ? moment(filtro.vencimentoInicial).format("YYYY-MM-DD") : filtro.vencimentoInicial,
		  DATFINVENCNT: filtro.vencimentoFinal != "" ? moment(filtro.vencimentoFinal).format("YYYY-MM-DD") : filtro.vencimentoFinal,
		  CANCNT: filtro.canceladas ? (filtro.canceladas.value == "S"? "S" : "N") : "",
		  PAGCNT: filtro.abertas ? (filtro.abertas.value == "S"? "S" : "N") : "",
		}
		loading.value = true;
		skeleton.value = true;
		entidade.value = [1,1,1,1,1,1,1,1,1,1,1];

		let query = "";
		for (const key in data) {
			if(data[key] != "" && data[key] != null){
				query += `${key}=${data[key]}&`
			}
		}
		query = query.substring(0, query.length-1);

		console.log("📍 -> file: Index.vue:56 -> buscaConsultaContribuicao -> query:", query)

		let response = await contribuicaoService.procuraByAno(options, query);
		
		totalRecords.value = response.length;
		entidade.value = response;

		loading.value = false;
		skeleton.value = false;
}

const open = (data) => {
	dialogInfo.value = true;

	contribuicao.value = data;
}

const print = () => {
	window.open(contribuicaoService.api.getHost() + "contribuicao/pdf/" + contribuicao.value.ANOCNT + "/" + contribuicao.value.NUMCNT, '_blank');
}

onMounted(() => {
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
})

</script>

<template>
	<div>
		<div class="p-fluid">
			<div class="grid">
				<div class="col-12">
					<div class="card">
						<Toast />
						<h5>
							<Translate text="Consulta Contribuição" />
						</h5>
						<hr />
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

							<div class="field col-12 md:col-6 sm:col-8">
								<label for="name">Entidade:</label>
								<EntidadeBox :selected="entidade" v-model="filtro.entidade" />
							</div>
							
							<div class="field col-12 md:col-2 sm:col-4">
								<label for="ano">Ano:</label>
								<Calendar inputId="ano" v-model="filtro.ano" view="year" dateFormat="yy" :showIcon="true" />
							</div>
							
							<div class="field col-12 md:col-2 sm:col-6">
								<label for="name">Número Inicial:</label>
								<InputText type="number" v-model="filtro.numeroInicial" />
							</div>
							
							<div class="field col-12 md:col-2 sm:col-6">
								<label for="name">Número Final:</label>
								<InputText type="number" v-model="filtro.numeroFinal" />
							</div>
							
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Vencimento Inicial:</label>
								<Calendar v-model="filtro.vencimentoInicial" dateFormat="dd/mm/yy" :showIcon="true" />
							</div>
								
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Vencimento Final:</label>
								<Calendar v-model="filtro.vencimentoFinal" dateFormat="dd/mm/yy" :showIcon="true" />
							</div>
								
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Canceladas?</label>
								<Dropdown v-model="filtro.canceladas" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
									<template #value="slotProps">
										<div v-if="slotProps.value && slotProps.value.value">
											<span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
										</div>
										<span v-else>
											{{ slotProps.placeholder }}
										</span>
									</template>
								</Dropdown>
							</div>
								
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Abertas?</label>
								<Dropdown v-model="filtro.abertas" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
									<template #value="slotProps">
										<div v-if="slotProps.value && slotProps.value.value">
											<span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
										</div>
										<span v-else>
											{{ slotProps.placeholder }}
										</span>
									</template>
								</Dropdown>
							</div>
								
							<div class="field col-6 md:col-2">
								<Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;"
								@click="buscaConsultaContribuicao" />
							</div>
						</div>
					</div>
				</div>
				<div class="col-12">
					<div class="card">

						<DataTable 
							:value="entidade" 
							:paginator="true" 
							:rows="10"
							:totalRecords="totalRecords"
							responsiveLayout="scroll" 
							dataKey="NUMCNT">

								<template #empty v-if="!loading">
										Nenhum registro encontrado
								</template>
								<template #footer v-if="!loading">
								Total de registros {{ totalRecords}}
								</template>

								<div v-if="loading">
											<Skeleton height="2rem" width="100%"  class="mt-2" />
											<Skeleton height="2rem" width="100%" class="mt-2" />
											<Skeleton height="2rem" width="100%" class="mt-2" />
											<Skeleton height="2rem" width="100%" class="mt-2" />
											<Skeleton height="2rem" width="100%" class="mt-2" />
											<Skeleton height="2rem" width="100%" class="mt-2" />
								</div>
								<div v-else>
									<!--
									<Column field="ANOCNT" header="Ano" :sortable="true" style="max-width:5rem">
											<template #body="{data}">
													{{data.ANOCNT}}
											</template>
									</Column>
									
									-->
									<Column field="NUMCNT" header="Ano/Número" :sortable="true">
											<template #body="{data}">
												{{data.ANOCNT}}/{{data.NUMCNT}}
											</template>
									</Column>
									<Column field="CODDFC" header="Definição" :sortable="true" style="min-width:12rem">
											<template #body="{data}">
													<span v-if="data.defcontrib">{{ data.defcontrib.DESDFC }}</span>
											</template>
									</Column>
									<Column field="CODENT" header="Entidade" :sortable="true" style="min-width:12rem">
											<template v-if="!loading" #body="{data}">
												<span v-if="data.entidade">
													{{ data.entidade.CODENT }} - {{ data.entidade.NOMENT }}
												</span>
											</template>
									</Column>		
									<Column field="DATVENCNT" header="Vencimento" :sortable="true" style="min-width:12rem">
											<template #body="{data}">
													{{moment(data.DATVENCNT).format("DD/MM/YYYY")}}
											</template>
									</Column>					
									<Column field="VALCNT" header="Valor" :sortable="true" style="min-width:12rem">
											<template #body="{data}">
													{{ moneyFormat(data.VALCNT) }}
											</template>
									</Column>					
									<Column>
										<template #body="props">
												<Button icon="pi pi-eye" v-tooltip.top="'Visualizar'" class="p-button-rounded p-button-success mr-2" @click="open(props.data)" />
										</template>
									</Column>
								</div>								
						</DataTable>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Dialog v-model:visible="dialogInfo" modal header="Contribuição" :style="{ width: '50vw' }" v-if="contribuicao">    
		<div class="field col-6 md:col-2" v-if="!contribuicao.DATCANCNT">
			<Chip label="Pago" style="background: green;" v-if="contribuicao.DATPAGCNT" />
			<Chip label="Aberta" style="background: orange;" v-else />
		</div>
		<div class="field col-6 md:col-2">
			<Chip label="Cancelada" style="background: red;" v-if="contribuicao.DATCANCNT" />
		</div> 

    <p><strong>{{ contribuicao.defcontrib.DESDFC }}</strong></p>
    
    <p><strong>Exercício:</strong> {{ contribuicao.ANOCNT }}</p>
    <p><strong>Número:</strong> {{ contribuicao.NUMCNT }}</p>
    <p><strong>Mês de Referência:</strong> {{ meses[contribuicao.MESCNT] }}</p>
    <p><strong>Valor:</strong> {{ moneyFormat(contribuicao.VALCNT) }}</p>
    <p>
			<span v-if="contribuicao.banco">
				<strong>Banco:</strong> {{ contribuicao.banco.NOMBAN }}
			</span>			
		</p>  
		
		<Accordion>
			<AccordionTab :header="contribuicao.entidade.NOMENT" v-if="contribuicao.entidade">
				<p><strong>Nome: </strong>{{ contribuicao.entidade.NOMENT }}</p>
				<p><strong>Documento: </strong>{{ cnpjMask(contribuicao.entidade.DOCENT) }}</p>
				<p><strong>Endereco: </strong>{{ contribuicao.entidade.DESTIPLOG }} {{ contribuicao.entidade.NOMLOG }}</p>
				<p><strong>Bairro: </strong>{{ contribuicao.entidade.DESBAI }}</p>
				<p><strong>Cidade: </strong>{{ contribuicao.entidade.DESCID }}</p>
				<p><strong>Estado: </strong>{{ contribuicao.entidade.SIGEST }}</p>
				<p><strong>CEP: </strong>{{ contribuicao.entidade.CEPENDENT }}</p>
			</AccordionTab>
			<AccordionTab header="Pagamento" v-if="contribuicao.DATPAGCNT">
				<p><strong>Data: </strong>{{ moment(contribuicao.DATPAGCNT).format('DD/MM/YYYY') }}</p>
				<p><strong>Valor: </strong>{{ moneyFormat(contribuicao.VALPAGCNT) }}</p>
				<p>
					<span v-if="contribuicao.banco_pagamento">
						<strong>Banco: </strong>{{ contribuicao.banco_pagamento.NOMBAN }}
						<strong>Agência: </strong>{{ contribuicao.CODAGE }}
					</span>
				</p>
			</AccordionTab>
			<AccordionTab header="Histórico" v-if="contribuicao.historico">
				<div class="field col-6 md:col-12" v-if="contribuicao.historico.length == 0">					
					<Message severity="info" :closable="false">Nenhum registro</Message>
				</div>
				<div class="field col-6 md:col-12" v-else>					
					<div class="field col-6 md:col-12" v-for="entry in contribuicao.historico" v-bind:key="entry.NUMCNH">					
						<Card>
								<template #title>{{ moment(entry.DATCNH).format("DD/MM/YYYY") }} {{ entry.HORCNH }}</template>
								<template #content>
									<span v-if="entry.TIPCNH == 6">
										<p><strong>Pagamento</strong></p>
										<p>Atual: {{ entry.VALDESCNH ? moment(entry.VALDESCNH).format('DD/MM/YYYY') : 'Aberto' }}</p>
										<p>Anterior: {{ entry.VALORICNH ? moment(entry.VALORICNH).format('DD/MM/YYYY') : 'Aberto' }}</p>
									</span>
									<span v-else>
										<Message severity="info" closable="false">Sem registros</Message>
									</span>
								</template>
						</Card>					
					</div>
				</div>
			</AccordionTab>
			<AccordionTab header="Cancelamento" v-if="contribuicao.DATCANCNT">
				<p><strong>Data: </strong> {{ moment(contribuicao.DATCANCNT).format("DD/MM/YYYY") }}</p>
				<p>
					<span v-if="contribuicao.usuario_cancelamento">
						<strong>Usuário:</strong> {{ contribuicao.usuario_cancelamento.NOMUSU }}
					</span>
				</p>
				<p>
					<strong>Motivo:</strong> {{ contribuicao.MOTCANCNT }}
				</p>
			</AccordionTab>
		</Accordion>

    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-warning" @click="dialogInfo = false" text />
      <Button label="Impressão" icon="pi pi-file-pdf" class="p-button-info" @click="print()" text v-if="contribuicao.defcontrib.CODWSR" />
    </template>
  </Dialog>
</template>