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

				<DataTable ref="dt" :value="listaReferencia" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Referência" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Referência" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODREF" header="Cód." :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODREF}}
						</template>
					</Column>
					<Column field="DESREF" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:5rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESREF}}
						</template>
					</Column>
					<Column headerStyle="width:7%; min-width:1rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes da Referência" :modal="true" class="p-fluid">
					<div>						
						<div class="field">
							<label for="name">Descrição</label>
							<InputText v-model.trim="referencia.DESREF" required="true" autofocus :class="{'p-invalid': submitted && !referencia.DESREF}" maxlength="200"/>
							<small class="p-invalid" v-if="submitted && !referencia.DESREF">Name is required.</small>
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
						<span v-if="product">Deseja realmente excluir esta Referência <b>{{referencia.DESREF}}</b>?</span>
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
import ReferenciaService from '../../../../service/ReferenciaService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			listaReferencia : null,
			referencia : {},
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
		this.referenciaService = new ReferenciaService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.referenciaService.all().then(
				(data) => {
					this.listaReferencia = data
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
			this.referencia = {};
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
			if (this.referencia.CODREF) {
				response = await this.referenciaService.update(this.referencia);
			}
			else {
				response = await this.referenciaService.store(this.referencia);
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
				this.load();
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Referência não salva', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		// edit(referencia) {
		// 	console.log (referencia)
		// 	this.loading2 = true;
		// 	this.referenciaService.get(referencia.CODREF).then(
		// 		(data) => {
		// 			this.referencia = data
		// 			this.loading2 = false;
		// 		}
		// 	);
		// 	this.productDialog = true;
		// },
        edit(referencia) {
            this.loading2 = true;
            this.referencia = referencia;
            this.productDialog = true;
        },
		confirmDeleteProduct(referencia) {
			this.referencia = referencia;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			this.referenciaService.delete(this.referencia.CODREF);

			this.referencia = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Referência removida com sucesso', life: 3000});

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
                if(this.referencia.DESREF == "" || this.referencia.DESREF == undefined){
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
