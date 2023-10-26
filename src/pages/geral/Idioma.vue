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

				<DataTable ref="dt" :value="idiomas" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} idiomas" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Idioma" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODIDI" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODIDI}}
						</template>
					</Column>
					<Column field="DESIDI" header="Nome" :sortable="true" headerStyle="width:80%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESIDI}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes da Entidade" :modal="true" class="p-fluid">
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
							<InputText v-model.trim="idioma.DESIDI" required="true" autofocus :class="{'p-invalid': submitted && !idioma.DESIDI}" />
							<small class="p-invalid" v-if="submitted && !idioma.DESIDI">Name is required.</small>
						</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteIdiomaDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Deseja realmente excluir este idioma <b>{{idioma.DESIDI}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteIdiomaDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteIdioma" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteIdiomasDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteIdiomasDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import IdiomaService from '../../service/IdiomaService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			idiomas : null,
			idioma : {},
			productDialog: false,
			deleteIdiomaDialog: false,
			deleteIdiomasDialog: false,
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
		this.idiomaService = new IdiomaService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.idiomaService.all().then(
				(data) => {
					this.idiomas = data
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
			this.idioma = {};
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
			if (this.idioma.CODIDI) {
				response = await this.idiomaService.update(this.idioma);
			}
			else {
				response = await this.idiomaService.store(this.idioma);

				this.load();
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Idioma salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Idioma não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(idioma) {
			this.loading2 = true;
			this.idiomaService.get(idioma.CODIDI).then(
				(data) => {
					this.idioma = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(idioma) {
			this.idioma = idioma;
			this.deleteIdiomaDialog = true;
		},
		async deleteIdioma() {
			this.deleteIdiomaDialog = false;			
			this.idiomaService.delete(this.idioma.CODIDI);

			this.idioma = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Idioma removido com sucesso', life: 3000});

			this.load();
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteIdiomasDialog = true;
		},
		initFilters() {
			this.filters = {
					'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
			}
		},
		validaCampos() {
			if (this.idioma.DESIDI == "" || this.idioma.DESIDI == undefined) {
				this.$toast.add({severity:'error', summary: 'Atenção', detail: 'Preencha os campos obrigatórios!', life: 3000});
				return false;
			}
			else {
				return true;
			}
		},
	}
}
</script>

<style scoped lang="scss">
@import '../../assets/demo/badges.scss';
</style>
