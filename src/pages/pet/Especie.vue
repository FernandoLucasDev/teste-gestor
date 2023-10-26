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

				<DataTable ref="dt" :value="especies" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} especies" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Especie" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODESP" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODESP}}
						</template>
					</Column>
					<Column field="NOMESP" header="Nome" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.NOMESP}}
						</template>
					</Column>
					<Column field="NOMCIEESP" header="Nome Cientifico" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.NOMCIEESP}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes da Espécie" :modal="true" class="p-fluid">
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
							<InputText v-model.trim="especie.NOMESP" required="true" autofocus :class="{'p-invalid': submitted && !especie.NOMESP}" />
							<small class="p-invalid" v-if="submitted && !especie.NOMESP">Name is required.</small>
						</div>
						<div class="field">
							<label for="name">Nome Cientifico</label>
							<InputText v-model.trim="especie.NOMCIEESP" required="true" autofocus :class="{'p-invalid': submitted && !especie.NOMCIEESP}" />
							<small class="p-invalid" v-if="submitted && !especie.NOMCIEESP">Name is required.</small>
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
						<span v-if="product">Deseja realmente excluir este tipo de entidade <b>{{tipoEntidade.DESTIE}}</b>?</span>
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
import EspecieService from '../../service/pet/EspecieService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			especies : null,
			especie : {},
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
		this.especieService = new EspecieService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.especieService.all().then(
				(data) => {
					this.especies = data
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
			this.especie = {};
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
			if (this.especie.CODESP) {
				response = await this.especieService.update(this.especie);
			}
			else {
				response = await this.especieService.store(this.especie);

				this.load();
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Especie não salva', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(especie) {
			this.loading2 = true;
			this.especieService.get(especie.CODESP).then(
				(data) => {
					this.especie = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(especie) {
			this.especie = especie;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			this.especieService.delete(this.especie.CODESP);

			this.especie = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Especie removida com sucesso', life: 3000});

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
