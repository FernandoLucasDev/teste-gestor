<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="eleicoes" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Eleicao" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Eleicao" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODELE" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODELE}}
						</template>
					</Column>
					<Column field="DESELE" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESELE}}
						</template>
					</Column>
					<Column field="DATELE" header="Data" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DATELE}}
						</template>
					</Column>
					<Column field="INIEXEELE" header="Início do exercício" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.INIEXEELE}}
						</template>
					</Column>
					<Column field="FIMEXEELE" header="Fim do exercício" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.FIMEXEELE}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes da Eleição" :modal="true" class="p-fluid">
					<div v-if="loading2">						
								<Skeleton width="30rem" class="mb-2"></Skeleton>
								<Skeleton width="10rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
								<Skeleton width="30rem" class="mb-2"></Skeleton>
								<Skeleton width="10rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
								<Skeleton width="30rem" class="mb-2"></Skeleton>
								<Skeleton width="10rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
								<Skeleton width="20rem" class="mb-2"></Skeleton>
								<Skeleton width="5rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
								<Skeleton width="10rem" class="mb-2"></Skeleton>
								<Skeleton width="5rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
								<Skeleton width="10rem" class="mb-2"></Skeleton>
								<Skeleton width="5rem" class="mb-2"></Skeleton>
								<Skeleton height=".5rem"></Skeleton>						
					</div>
					<div v-else>						
						<div class="field">
							<label for="name">Descrição </label>
							<InputText v-model.trim="eleicao.DESELE" required="true" autofocus :class="{'p-invalid': submitted && !eleicao.DESELE}" />
							<small class="p-invalid" v-if="submitted && !eleicao.DESELE">Name is required.</small>
						</div>
						<div class="field">
							<label for="name">Data</label>
							<Calendar showIcon="true" dateFormat="dd/mm/yy" v-model="eleicao.DATELE" required="true" autofocus :class="{'p-invalid': submitted && !eleicao.DATELE}" />
							<small class="p-invalid" v-if="submitted && !eleicao.DATELE">Name is required.</small>
						</div>
						<div class="field">
							<label for="name">Início do exercício</label>
							<InputNumber v-model="eleicao.INIEXEELE" required="true" autofocus :class="{'p-invalid': submitted && !eleicao.INIEXEELE}" />
							<small class="p-invalid" v-if="submitted && !eleicao.INIEXEELE">Name is required.</small>
						</div>
						<div class="field">
							<label for="name">Fim do exercício</label>
							<InputNumber v-model="eleicao.FIMEXEELE" required="true" autofocus :class="{'p-invalid': submitted && !eleicao.FIMEXEELE}" />
							<small class="p-invalid" v-if="submitted && !eleicao.FIMEXEELE">Name is required.</small>
						</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Deseja realmente excluir esta Eleição <b>{{eleicao.DESELE}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletesDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import EleicaoService from '../../service/eleicoes/EleicaoService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			eleicoes : null,
			eleicao : {},
			productDialog: false,
			deleteDialog: false,
			deletesDialog: false,
			selectedProducts: null,
			filters: {},
			submitted: false,
			saving : false,
			statuses: [
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			]
		}
	},
	created() {
		this.eleicaoService = new EleicaoService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.eleicaoService.all().then(
				(data) => {
					this.eleicoes = data
					this.loading = false;
				}
			);
		},
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			console.log("!");
			this.eleicao = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		async save() {
			if (this.saving) return;

			this.submitted = true;
			this.saving = true;

			let response;
			if (this.eleicao.CODELE) {
				response = await this.eleicaoService.update(this.eleicao);
			}
			else {
				response = await this.eleicaoService.store(this.eleicao);

				this.load();
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Eleicão salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Eleicão não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(eleicao) {
			this.loading2 = true;
			this.eleicaoService.get(eleicao.CODELE).then(
				(data) => {
					this.eleicao = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(eleicao) {
			this.eleicao = eleicao;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			this.eleicaoService.delete(this.eleicao.CODELE);

			this.eleicao = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Eleição removido com sucesso', life: 3000});

			this.load();
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deletesDialog = true;
		},
		initFilters() {
			this.filters = {
					'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
			}
		},
	}
}
</script>

<style scoped lang="scss">
@import '../../assets/demo/badges.scss';
</style>
