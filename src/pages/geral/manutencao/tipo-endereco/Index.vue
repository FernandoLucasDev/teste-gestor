<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h4><Translate text="Tipo Endereço" /></h4>
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="listaTipoEndereco" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Tipo Endereço" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<!-- <h5 class="m-0">
								<Translate text="Tipo Endereço" />
							</h5> -->
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODTIPEND" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODTIPEND}}
						</template>
					</Column>
					<Column field="DESTIPEND" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESTIPEND}}
						</template>
					</Column>
					<Column headerStyle="width:1%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Tipo de Endereço" :modal="true" class="p-fluid">
					<div>						
						<div class="field">
							<label for="name">Descrição</label>
							<InputText v-model.trim="tipoEndereco.DESTIPEND" required="true" autofocus :class="{'p-invalid': submitted && !tipoEndereco.DESTIPEND}" maxLength="20" />
							<small class="p-error" v-if="submitted && !tipoEndereco.DESTIPEND">Este campo é obrigatório.</small>
						</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button :loading="saving" label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span>Deseja realmente excluir este Registro <b>{{tipoEndereco.DESTIPEND}}</b>?</span>
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
import TipoEnderecoService from '../../../../service/TipoEnderecoService'
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			listaTipoEndereco : null,
			tipoEndereco : {},
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
		this.tipoEnderecoService = new TipoEnderecoService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.tipoEnderecoService.all().then(
				(data) => {
					this.listaTipoEndereco = data
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
			this.tipoEndereco = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		async save() {
			if (this.saving) return;
			if (!this.validaCampos()) return;

			this.submitted = true;
			this.saving = true;

			let response;
			if (this.tipoEndereco.CODTIPEND) {
				response = await this.tipoEnderecoService.update(this.tipoEndereco);
			}
			else {
				response = await this.tipoEnderecoService.store(this.tipoEndereco);
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
				this.load();
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Tipo endereço não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(tipoEndereco) {
			console.log (tipoEndereco)
			this.loading2 = true;
			this.tipoEnderecoService.get(tipoEndereco.CODTIPEND).then(
				(data) => {
					this.tipoEndereco = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(tipoEndereco) {
			this.tipoEndereco = tipoEndereco;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			await this.tipoEnderecoService.delete(this.tipoEndereco.CODTIPEND);

			this.tipoEndereco = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Tipo endereço removido com sucesso', life: 3000});

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
		validaCampos() {
			if (this.tipoEndereco.DESTIPEND == "" || this.tipoEndereco.DESTIPEND == undefined){
				this.submitted = true;
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios', life: 3000});
				return false;
			}
			else {
				this.submitted = false;
				return true;
			}
		},
	}
}
</script>

<style scoped lang="scss">

</style>

