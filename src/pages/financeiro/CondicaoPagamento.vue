<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast />
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="objCondicaoPagamentos" :loading="loading" v-model:selection="selectedProducts"
					dataKey="id" :paginator="true" :rows="10" :filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} CondicaoPagamento"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<!-- <Translate text="CondicaoPagamento" /> -->
								Condição de pagamento
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODCND" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{ slotProps.data.CODCND }}
						</template>
					</Column>
					<Column field="DESCND" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.DESCND }}
						</template>
					</Column>
					<Column field="QTDPARCND" header="Quantidade de Parcelas" :sortable="true"
						headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.QTDPARCND }}
						</template>
					</Column>
					<Column field="PRIPARCND" header="Primeira parcelas (Dias)" :sortable="true"
						headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.PRIPARCND }}
						</template>
					</Column>
					<Column field="DIFPARCND" header="Diferença entre parcelas" :sortable="true"
						headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.DIFPARCND }}
						</template>
					</Column>
					<Column field="TIPDIFCND" header="Tipo de diferença entre parcelas" :sortable="true"
						headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ (slotProps.data.TIPDIFCND == "D" || slotProps.data.TIPDIFCND == "d" ? "DIAS" : "MESES") }}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
								@click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
								@click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{ width: '70%' }" header="Detalhes da Condição Pagamento"
					:modal="true" class="p-fluid">
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
						<div class="field ">
							<label for="name">Descrição</label>
							<InputText v-model.trim="objCondicaoPagamento.DESCND" required="true" autofocus
								:class="{ 'p-invalid': submitted && !objCondicaoPagamento.DESCND }" />
							<small class="p-error" v-if="submitted && !objCondicaoPagamento.DESCND">Este campo é
								obrigatorio.</small>
						</div>
						<div class="field">
							<label for="name">Quantidade de Parcelas</label>
							<InputNumber v-model="objCondicaoPagamento.QTDPARCND" required="true" autofocus
								:class="{ 'p-invalid': submitted && !objCondicaoPagamento.QTDPARCND }" />
							<small class="p-error" v-if="submitted && !objCondicaoPagamento.QTDPARCND">Este campo é
								obrigatorio.</small>
						</div>
						<div class="field">
							<label for="name">Primeira parcela (Dias)</label>
							<InputNumber v-model="objCondicaoPagamento.PRIPARCND" required="true" autofocus
								:class="{ 'p-invalid': submitted && !objCondicaoPagamento.PRIPARCND }" />
							<small class="p-error" v-if="submitted && !objCondicaoPagamento.PRIPARCND">Este campo é
								obrigatorio.</small>
						</div>
						<div class="field">
							<label for="name">Diferença entre parcelas</label>
							<InputNumber v-model="objCondicaoPagamento.DIFPARCND" required="true" autofocus
								:class="{ 'p-invalid': submitted && !objCondicaoPagamento.DIFPARCND }" />
							<small class="p-error" v-if="submitted && !objCondicaoPagamento.DIFPARCND">Este campo é
								obrigatorio.</small>
						</div>
						<div class="field">
							<label for="name">Tipo de diferença entre parcelas</label>

							<Dropdown id="tipoDiferenca" v-model="objCondicaoPagamento.TIPDIFCND" :options="tiposDiferenca"
								optionLabel="label" placeholder="Selecione">
								<template #value="slotProps">
									<div v-if="slotProps.value && slotProps.value.value">
										<span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label
										}}</span>
									</div>
									<span v-else>
										{{ slotProps.placeholder }}
									</span>
								</template>
							</Dropdown>
							<small class="p-error" v-if="submitted && !objCondicaoPagamento.TIPDIFCND">Este campo é
								obrigatorio.</small>
						</div>
					</div>
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmação de remoção"
					:modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span>Deseja realmente excluir este registro?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deletesDialog = false" />
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import { FilterMatchMode } from 'primevue/api';
import CondicaoPagamentoService from '../../service/financeiro/CondicaoPagamentoService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate: null,
			loading: true,
			loading2: false,
			objCondicaoPagamentos: null,
			objCondicaoPagamento: {},
			productDialog: false,
			deleteDialog: false,
			deletesDialog: false,
			selectedProducts: null,
			filters: {},
			submitted: false,
			saving: false,
			statuses: [
				{ label: 'INSTOCK', value: 'instock' },
				{ label: 'LOWSTOCK', value: 'lowstock' },
				{ label: 'OUTOFSTOCK', value: 'outofstock' }
			],
			tiposDiferenca: [
				{ label: 'DIAS', value: 'D' },
				{ label: 'MESES', value: 'M' },
			]

		}
	},
	created() {
		this.objCondicaoPagamentoService = new CondicaoPagamentoService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.objCondicaoPagamentoService.all().then(
				(data) => {
					this.objCondicaoPagamentos = data
					this.loading = false;
				}
			);
		},
		validaCampos() {
			// this.submitted = false;
			console.log("entrou na função de validate fields");
			if (
			
				this.objCondicaoPagamento.DESCND === "" ||
				this.objCondicaoPagamento.DESCND === undefined ||
				this.objCondicaoPagamento.QTDPARCND === "" ||
				this.objCondicaoPagamento.QTDPARCND === undefined ||
				this.objCondicaoPagamento.PRIPARCND === "" ||
				this.objCondicaoPagamento.PRIPARCND === undefined ||
				this.objCondicaoPagamento.DIFPARCND === "" ||
				this.objCondicaoPagamento.DIFPARCND === undefined ||
				this.objCondicaoPagamento.TIPDIFCND === "" ||
				this.objCondicaoPagamento.TIPDIFCND === undefined
			) {
				// console.log(this.objCondicaoPagamento.DESCND);
				// console.log(this.objCondicaoPagamento.QTDPARCND);
				// console.log(this.objCondicaoPagamento.PRIPARCND);
				// console.log(this.objCondicaoPagamento.DIFPARCND);
				// console.log(this.objCondicaoPagamento.TIPDIFCND);

				console.log("entrou no if");
				this.$toast.add({
					severity: "error",
					summary: "Atenção",
					detail: "Preencha todos os campos obrigatórios!",
					life: 3000,
				})
			
				return false;
			}
			else if(this.objCondicaoPagamento.DIFPARCND === 0){
				console.log("entrou no else if");
				this.$toast.add({
					severity: "error",
					summary: "Atenção",
					detail: "Diferença entre parcela não pode ser igual a zero!",
					life: 3000,
				});
				return false;
			}
			
			else {
				// Se todos os campos estiverem preenchidos, a função retorna true
				return true;
			}
		},

		formatCurrency(value) {
			if (value)
				return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
			return;
		},
		openNew() {
			console.log("!");
			this.objCondicaoPagamento = {};
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
			if (!this.validaCampos()) return
			this.saving = true

			if (this.objCondicaoPagamento.TIPDIFCND) {
				this.objCondicaoPagamento.TIPDIFCND = this.objCondicaoPagamento.TIPDIFCND.value
			}

			let response;
			if (this.objCondicaoPagamento.CODCND) {
				response = await this.objCondicaoPagamentoService.update(this.objCondicaoPagamento);
			}
			else {
				response = await this.objCondicaoPagamentoService.store(this.objCondicaoPagamento);
			}

			if (response) {
				this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000 });
				this.load();
			}
			else {
				this.$toast.add({ severity: 'error', summary: 'Erro', detail: 'Condição Pagamento não salva', life: 3000 });
			}

			this.productDialog = false;
			this.saving = true;
		},
		edit(objCondicaoPagamento) {
			this.loading2 = true;
			this.objCondicaoPagamentoService.get(objCondicaoPagamento.CODCND).then(
				(data) => {
					this.objCondicaoPagamento = data
					if (this.objCondicaoPagamento.TIPDIFCND) {
						this.objCondicaoPagamento.TIPDIFCND = this.findCondicaoPagamento(this.objCondicaoPagamento.TIPDIFCND);
					}
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		findCondicaoPagamento(id) {
			let _tipoDiferenca;
			this.tiposDiferenca.map(
				(tipoDiferenca) => {
					if (tipoDiferenca.value == id) {
						_tipoDiferenca = tipoDiferenca;
					}
				}
			);

			return _tipoDiferenca;
		},
		confirmDeleteProduct(objCondicaoPagamento) {
			this.objCondicaoPagamento = objCondicaoPagamento;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;
			await this.objCondicaoPagamentoService.delete(this.objCondicaoPagamento.CODCND);

			this.objCondicaoPagamento = {};

			this.$toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Condição Pagamento removida com sucesso', life: 3000 });

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
				'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
			}
		},
	}
}

</script>

<style scoped lang="scss">
@import '../../assets/demo/badges.scss';
</style>
