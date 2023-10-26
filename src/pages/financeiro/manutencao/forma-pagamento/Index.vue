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

				<DataTable ref="dt" :value="formaPagamentos" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} CondicaoPagamento" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Formas de pagamento" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>
					<Column field="CODFPG" header="Cód." :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODFPG}}
						</template>
					</Column>
					<Column field="DESCND" header="Descrição" :sortable="true" headerStyle="width:50%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESFPG}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="formaPagamentoDialog" :style="{width: '70%'}" header="Forma de Pagamento" :modal="true" class="p-fluid">
					<div class="field">
						<label for="name">Descrição</label>
						<InputText v-model.trim="formaPagamento.DESFPG" required="true" autofocus :class="{'p-invalid': submitted && !formaPagamento.DESFPG}" />
						<small class="p-invalid" v-if="submitted && !formaPagamento.DESFPG">Name is required.</small>
					</div>
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Deseja realmente excluir esta CondicaoPagamento <b>{{formaPagamento.DESFPG}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import FormaPagamentoService from '../../../../service/financeiro/FormaPagamentoService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			formaPagamentos : null,
			formaPagamento : {},
			formaPagamentoDialog: false,
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
			],
		}
	},
	created() {
		this.formaPagamentoService = new FormaPagamentoService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.formaPagamentoService.all().then((data) => {
				console.log("fp",data);
					this.formaPagamentos = data
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
			this.formaPagamento = {};
			this.submitted = false;
			this.formaPagamentoDialog = true;
		},
		hideDialog() {
			this.formaPagamentoDialog = false;
			this.submitted = false;
		},
		async save() {
			if (this.saving) return;

			this.submitted = true;
			this.saving = true;

			if (this.formaPagamento.TIPDIFCND) {
				this.formaPagamento.TIPDIFCND = this.formaPagamento.TIPDIFCND.value
			}

			let response;
			if (this.formaPagamento.CODFPG) {
				response = await this.formaPagamentoService.update(this.formaPagamento);
			}
			else {
				response = await this.formaPagamentoService.store(this.formaPagamento);

				this.load();
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Condição Pagamento não salva', life: 3000});
			}

			this.formaPagamentoDialog = false;
			this.saving = false;
		},
		edit(formaPagamento) {
			console.log(formaPagamento);
			this.loading2 = true;
			this.formaPagamento = formaPagamento;
			this.formaPagamentoDialog = true;
		},

		findCondicaoPagamento(id) {
			let _tipoDiferenca;
			return _tipoDiferenca;
		},

		confirmDeleteProduct(formaPagamento) {
			this.formaPagamento = formaPagamento;
			this.deleteDialog = true;
		},

		async deleteFunction() {
			this.deleteDialog = false;			
			this.formaPagamentoService.delete(this.formaPagamento.CODFPG);

			this.formaPagamento = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Forma de Pagamento removida com sucesso', life: 3000});

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
@import '../../../../assets/demo/badges.scss';
</style>
