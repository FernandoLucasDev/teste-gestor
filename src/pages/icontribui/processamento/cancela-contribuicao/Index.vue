<script setup>

import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useToast } from "primevue/usetoast";
import ContribuicaoService from "../../../../service/icontribui/ContribuicaoService";
import moment from "moment"

const ContribuicaoDialog = defineAsyncComponent(() => import('@/components/ContribuicaoDialog.vue'));

const contribuicaoService = new ContribuicaoService();

const toast = useToast();
const loading = ref();
const skeleton = ref(false);
const checkHeader = ref(false);
const disabledBotao = ref(false);
const contribuicao = ref();
const MotCanCnt = ref();
const showContribuicaoDialog = ref(false);
const showCancelDialog = ref(false);

const listaContribuicao = ref([]);
const totalRecords = ref(0);

const opcoesSimNao = reactive([
	{ label: "Sim", value: "S" },
	{ label: "Não", value: "N" },
]);

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

function onPage(event) {
	buscaCancelaContribuicao(event);
}

const openCancelaContribuicao = (data) => {
	contribuicao.value = data;
	showContribuicaoDialog.value = true;
}

const openConfirm = () => {
	showCancelDialog.value = true;
	showContribuicaoDialog.value = false;
}

const confirm = () => {
	if (!MotCanCnt.value) {
		toast.add({severity:'warn', summary: 'Contribuições', detail: 'Informe o motivo do cancelamento',  life : 3000});
		return;
	}

	showCancelDialog.value = false;
	showContribuicaoDialog.value = false;
	
	toast.add({severity:'info', summary: 'Contribuições', detail: 'Cancelando contribuição, aguarde...',});

	contribuicaoService.cancel(
		contribuicao.value.ANOCNT,
		contribuicao.value.NUMCNT,
		MotCanCnt.value
	)
	.then( resp => {
		toast.add({severity:'success', summary: 'Contribuições', detail: 'Contribuição cancelada com sucesso',});
	});
}

const buscaCancelaContribuicao = async (options = null) => {
		let data = {
		  ANOCNT: filtro.ano != "" ? filtro.ano.getUTCFullYear() : filtro.ano,
		  NUMINICNT: filtro.numeroInicial,
		  NUMFINCNT: filtro.numeroFinal,
		  CODENT: filtro.entidade ? filtro.entidade.value : "",
		  DATINIVENCNT: filtro.vencimentoInicial != "" ? moment(filtro.vencimentoInicial).format("YYYY-MM-DD") : filtro.vencimentoInicial,
		  DATFINVENCNT: filtro.vencimentoFinal != "" ? moment(filtro.vencimentoFinal).format("YYYY-MM-DD") : filtro.vencimentoFinal,
		  CANCNT: "N",
		  PAGCNT: "N",
		}
		loading.value = true;
		skeleton.value = true;
		listaContribuicao.value = [1,1,1,1,1,1,1,1,1,1,1];

		let query = "";
		// if(!options){
			// query += "?";
		// }
		for (const key in data) {
			if(data[key] != "" && data[key] != null){
				query += `${key}=${data[key]}&`
			}
		}
		query = query.substring(0, query.length-1);

		// console.log("📍 -> file: Index.vue:56 -> buscaCancelaContribuicao -> query:", query)

		// let response = await contribuicaoService.procuraByAno(ano.value ? ano.value.getUTCFullYear() : null);
		let response = await contribuicaoService.procuraByAno(options, query);
		
		// totalRecords.value = response.totalRecords;
		totalRecords.value = response.length;
		listaContribuicao.value = response;
		console.log("🚀 ~ file: Index.vue:81 ~ buscaCancelaContribuicao ~ listaContribuicao.value:", listaContribuicao.value)

		loading.value = false;
		skeleton.value = false;

}

const marcaTodos = () => {
	if (checkHeader.value) {
		listaContribuicao.value.forEach(item => item.cancela = true);
	} else {
		listaContribuicao.value.forEach(item => item.cancela = false);
	}

	disableBotaoMassa();
}

const disableBotaoMassa = () => {
	if (listaContribuicao.value.find(item => item.cancela == true) == undefined) {
		disabledBotao.value = true;
	} else {
		disabledBotao.value = false;
	}
}
</script>

<template>
	<Toast />
	<div>
		<div class="p-fluid">
			<div class="grid">
				<div class="col-12">
					<div class="card">
						<Toast />
						<h5>
							<Translate text="Cancela Contribuição" />
						</h5>
						<hr />
						<div class="formgrid grid">

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
								<InputNumber v-model="filtro.numeroInicial" />
							</div>
							
							<div class="field col-12 md:col-2 sm:col-6">
								<label for="name">Número Final:</label>
								<InputNumber v-model="filtro.numeroFinal" />
							</div>
							
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Vencimento Inicial:</label>
								<Calendar v-model="filtro.vencimentoInicial" dateFormat="dd/mm/yy" :showIcon="true" />
							</div>
								
							<div class="field col-12 md:col-3 sm:col-6">
								<label for="name">Vencimento Final:</label>
								<Calendar v-model="filtro.vencimentoFinal" dateFormat="dd/mm/yy" :showIcon="true" />
							</div>

							<div class="field flex flex-column gap-2 col-12 md:col-3 sm:col-6 lg:col-2">
								<label for="chbx">Cancela contribuição?</label>
								<Checkbox id="chbx" v-model="filtro.cancela" :binary="true" />
							</div>
							<div class="field col-6 md:col-2">
								<Button
								  label="Procurar"
								  icon="pi pi-search"
								  class="p-button-info"
								  style="margin-top: 15%;"
								  @click="buscaCancelaContribuicao" />
							</div>
							<div class="field col-6 md:col-2" v-if="filtro.cancela">
								<Button
								  label="Cancelamento em massa"
								  icon="pi pi-times"
								  class="p-button-danger"
									style="margin-top: 15%;"
									:disabled="disabledBotao" />
							</div>
						</div>
					</div>
				</div>
				<div class="col-12">
					<div class="card">
						<DataTable 
							:value="listaContribuicao" 
							:paginator="true" 
							:rows="10"
							:totalRecords="totalRecords"
							responsiveLayout="scroll" 
							dataKey="CODENT">

								<template #empty v-if="!loading">
										Nenhum registro encontrado
								</template>
								<!-- <template #loading>
										Carregando registros. Por favor, aguarde...
								</template> -->
								<template #loading>
									<Skeleton></Skeleton>
								</template>
								<template #footer v-if="!loading">
								Total de registros {{ totalRecords}}
								</template>

								<div v-if="loading">
									<Column header="Entidade" style="min-width:12rem">
										<template #body>
											<Skeleton style="height: 2rem;" class="mt-2"/>
											<!-- <Skeleton /> -->
										</template>
									</Column>
									<Column header="Ano" style="min-width:12rem">
										<template #body>
											<Skeleton style="height: 2rem;" class="mt-2"/>
											<!-- <Skeleton /> -->
										</template>
									</Column>
									<Column headerStyle="min-width:10rem; width:10rem;">
										<template #body>
											<div class="flex align-items-center gap-2 mt-2">
                        <Skeleton shape="circle" style="height: 2.5rem; width: 2.5rem;" />
                        <Skeleton shape="circle" style="height: 2.5rem; width: 2.5rem;" />
												<!-- <Skeleton shape="circle" class="w-3rem h-3rem" /> -->
                    	</div>
										</template>
									</Column>
								</div>
								<div v-else>
									<Column
									  field="CHECK"
									  style="min-width:5rem"
									  v-if="filtro.cancela">
											<template v-if="!loading" #header>
												<Checkbox v-model="checkHeader" :binary="true" @change="marcaTodos" />
											</template>
											<template v-if="!loading" #body="{data}">
												<Checkbox v-model="data.cancela" :binary="true" @change="disableBotaoMassa" />
											</template>
									</Column>
									<Column field="CODENT" header="Entidade" :sortable="true" style="min-width:12rem">
											<template v-if="!loading" #body="{data}">
												{{data.CODENT}}
											</template>
									</Column>
									<Column field="ANOCNT" header="Ano" :sortable="true" style="min-width:12rem">
											<template #body="{data}">
													{{data.ANOCNT}}
											</template>
									</Column>
									<Column headerStyle="min-width:10rem; width:10rem;" v-if="!filtro.cancela">
										<template #body="props">
												<Button icon="pi pi-times" class="p-button-rounded p-button-danger mt-2" @click="openCancelaContribuicao(props.data)" />
										</template>
									</Column>
								</div>								
						</DataTable>
					</div>
				</div>
			</div>
		</div>
	</div>
	<ContribuicaoDialog :visible="showContribuicaoDialog" :data="contribuicao" @hide="showContribuicaoDialog = false">
		<template #footer>
			<Button label="Cancelar" icon="pi pi-times" class="p-button-danger" text @click="openConfirm" />
		</template>
	</ContribuicaoDialog>

	<Dialog v-model:visible="showCancelDialog" modal header="Contribuição" :style="{ width: '50vw' }">
    <p>Deseja realmente cancelar esta contribuição?</p>
		<div class="col-12">
			<div class="col-12">
				<label class="font-bold block mb-2">Motivo</label>
				<Textarea v-model.trim="MotCanCnt" rows="5" cols="30" autoResize style="width: 100% " />
			</div>		
		</div>		

    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-warning" @click="showCancelDialog = false" text />
      <Button label="Confirmar Cancelamento" icon="pi pi-times" class="p-button-danger" text @click="confirm" />
    </template>
  </Dialog>
</template>

<style lang="scss" scoped></style>