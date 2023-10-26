<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h4><Translate text="Funcionario" /></h4>
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="funcionarios" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Funcionario" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODFUN" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODFUN}}
						</template>
					</Column>
					<Column field="NOMFUN" header="Nome" :sortable="true" style="min-width: 12rem; width: 85rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.NOMFUN}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Funcionario" :modal="true" class="p-fluid">
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
							<label for="name">Nome</label>
							<InputText v-model.trim="funcionario.NOMFUN" required="true" autofocus :class="{'p-invalid': submitted && !funcionario.NOMFUN}" maxLength="50"/>
							<small class="p-error" v-if="submitted && !funcionario.NOMFUN">Este campo é obrigatório.</small>
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
						<span v-if="funcionario">Deseja realmente excluir este Funcionario <b>{{funcionario.NOMFUN}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="funcionario">Are you sure you want to delete the selected products?</span>
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
import FuncionarioService from '../../service/rh/FuncionarioService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			funcionarios : null,
			funcionario : {},
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
		this.funcionarioService = new FuncionarioService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.funcionarioService.all().then(
				(data) => {
					this.funcionarios = data
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
			// console.log("!");
			this.funcionario = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},

		validaCampos(){
			if(this.funcionario.NOMFUN == "" || this.funcionario.NOMFUN == undefined || this.funcionario.NOMFUN == null){
				return false;
			}
			return true;
		},

		async save() {
			if (this.saving) return;

			this.submitted = true;
			
			if(!this.validaCampos()){
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios', life: 3000});
				return;
			}

			this.saving = true;
			

			let response;
			if (this.funcionario.CODFUN) {
				response = await this.funcionarioService.update(this.funcionario);
			}
			else {
				response = await this.funcionarioService.store(this.funcionario);
			}			

			this.load();

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Funcionario salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Funcionario não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(funcionario) {
			this.loading2 = true;
			this.funcionarioService.get(funcionario.CODFUN).then(
				(data) => {
					this.funcionario = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(funcionario) {
			this.funcionario = funcionario;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;
			await this.funcionarioService.delete(this.funcionario.CODFUN);

			this.funcionario = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Funcionario removido com sucesso', life: 3000});

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
