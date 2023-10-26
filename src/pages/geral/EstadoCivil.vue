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

				<DataTable ref="dt" :value="estadoCivils" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} estadoCivils" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Estado Civil" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODESTCIV" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODESTCIV}}
						</template>
					</Column>
					<Column field="DESESTCIV" header="Nome" :sortable="true" headerStyle="width:80%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESESTCIV}}
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
							<label for="name">Descrição</label>
							<InputText  maxLength="50" v-model.trim="estadoCivil.DESESTCIV" required="true" autofocus :class="{'p-invalid': submitted && !estadoCivil.DESESTCIV}" />
							<small class="p-error" v-if="submitted && !estadoCivil.DESESTCIV">Name is required.</small>
						</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteEstadoCivilDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span>Deseja realmente excluir este estado civil<b></b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteEstadoCivilDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteEstadoCivil" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEstadoCivilsDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEstadoCivilsDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import EstadoCivilService from '../../service/EstadoCivilService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			estadoCivils : null,
			estadoCivil : {},
			productDialog: false,
			deleteEstadoCivilDialog: false,
			deleteEstadoCivilsDialog: false,
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
		this.estadoCivilService = new EstadoCivilService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		async load() {
			this.loading = true;
			this.estadoCivilService.all().then(
				(data) => {
					this.estadoCivils = data
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
			this.estadoCivil = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		async save() {
			if (this.validaCampos() == true) return;
			if (this.saving) return;

			this.submitted = true;
			this.saving = true;

			let response;
			if (this.estadoCivil.CODESTCIV) {
				response = await this.estadoCivilService.update(this.estadoCivil);
			}
			else {
				response = await this.estadoCivilService.store(this.estadoCivil);

			}			
			
			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Estado Civil salvo com sucesso', life: 3000});
				this.load();
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Estado Civil não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},

		validaCampos(){
			console.log("Entrou na função de validarCampos");
          if(this.estadoCivil.DESESTCIV == null || this.estadoCivil.DESESTCIV == ''){
            this.submitted = true;
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencher os campos obrigatórios', life: 3000});
            return true;
          }
          else{
            this.submitted = false;
            return false;
          }
        },

		edit(estadoCivil) {
			this.loading2 = true;
			this.estadoCivilService.get(estadoCivil.CODESTCIV).then(
				(data) => {
					this.estadoCivil = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;

		},
		confirmDeleteProduct(estadoCivil) {
			this.estadoCivil = estadoCivil;
			this.deleteEstadoCivilDialog = true;
		},
		async deleteEstadoCivil() {
			this.deleteEstadoCivilDialog = false;			
			await this.estadoCivilService.delete(this.estadoCivil.CODESTCIV);
			this.estadoCivil = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Estado Civil removido com sucesso', life: 3000});

			this.load();

		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteEstadoCivilsDialog = true;
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
