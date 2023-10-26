<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h4><Translate text="Tipo de Dissídio" /></h4>
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="listaTipoDissidio" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Tipo de Dissídio" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<!-- <h5 class="m-0">
								<Translate text="Tipo de Dissídio" />
							</h5> -->
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODTDI" header="Cód." :sortable="true" headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODTDI}}
						</template>
					</Column>
					<Column field="DESTDI" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:5rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.DESTDI}}
						</template>
					</Column>
					<Column headerStyle="width:7%; min-width:1rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'Excluir'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Tipo de Dissídio" :modal="true" class="p-fluid">
					<div>						
						<div class="field">
							<label for="name">Descrição</label>
							<InputText v-model.trim="tipoDissidio.DESTDI" required="true" autofocus :class="{'p-invalid': submitted && !tipoDissidio.DESTDI}" maxlength="200"/>
							<small class="p-invalid" v-if="submitted && !tipoDissidio.DESTDI">Name is required.</small>
						</div>
                        <div class="field">
							<label for="name">Data Base:</label>
							<InputMask id="data" mask="99/99/9999" v-model="tipoDissidio.DATBASTDI" />
						</div>
                        <div class="field col-12 sm:col-12 md:col-12 lg:col-3">
                            <label for="name">Tipo:</label>
                            <Dropdown v-model="tipo" :options="opcoesTipo" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <small class="p-invalid" v-if="submitted && !tipoDissidio.TIPTDI">Preencha o campo.</small>
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
						<span v-if="product">Deseja realmente excluir este Tipo de Dissídio <b>{{tipoDissidio.DESTDI}}</b>?</span>
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
import TipoDissidioService from '../../../../service/TipoDissidioService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			listaTipoDissidio : null,
			tipoDissidio : {},
			productDialog: false,
			deleteDialog: false,
			deletesDialog: false,
			selectedProducts: null,
			filters: {},
            tipo: null,
			submitted: false,
			saving : false,
			statuses: [
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			],
            opcoesTipo: [
                    { label: "ACT", value: "1" },
                    { label: "CCT", value: "2" },
            ],
		}
	},
	created() {
		this.tipoDissidioService = new TipoDissidioService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.tipoDissidioService.all().then(
				(data) => {
					this.listaTipoDissidio = data
					this.loading = false;
				}
			);
		},
		formatDate(value) {
			console.log("Entrou no formatDate"); 
			this.partesData = value.split("/");
			let dia = this.partesData[0];
			let mes = this.partesData[1];
			let ano = this.partesData[2];
			console.log(this.dia);
			console.log(this.mes);
			console.log(this.ano);
			return ano + "-" + mes + "-" + dia;
		},
		formatDateEdit(value){
			console.log("Entrou no formatDateEdit");
			this.partesDataEdit = value.split("-");
			let ano = this.partesDataEdit[0];
			let mes = this.partesDataEdit[1];
			let dia = this.partesDataEdit[2];
			return dia + "/" + mes + "/" + ano;
		},
		openNew() {
			console.log("!");
			this.tipoDissidio = {};
            this.tipo = {};
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

			if (this.tipoDissidio.DATBASTDI) {
				this.tipoDissidio.DATBASTDI = this.formatDate(this.tipoDissidio.DATBASTDI);
			}

            let data = this.tipoDissidio;
            data.TIPTDI = this.tipo.value;

			this.submitted = true;
			this.saving = true;

			let response;
			if (this.tipoDissidio.CODTDI) {
				response = await this.tipoDissidioService.update(this.tipoDissidio);
			}
			else {
				response = await this.tipoDissidioService.store(this.tipoDissidio);
			}			

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
				this.load();
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Tipo de Dissídio não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		// edit(tipoDissidio) {
		// 	console.log (tipoDissidio)
		// 	this.loading2 = true;
		// 	this.tipoDissidioService.get(tipoDissidio.CODTDI).then(
		// 		(data) => {
		// 			this.tipoDissidio = data
		// 			this.loading2 = false;
		// 		}
		// 	);
		// 	this.productDialog = true;
		// },
        edit(tipoDissidio) {
            this.loading2 = true;
            this.tipoDissidio = tipoDissidio;
            this.tipo = this.opcoesTipo.find(element => element.value == tipoDissidio.TIPTDI);
			this.tipoDissidio.DATBASTDI = this.formatDateEdit(this.tipoDissidio.DATBASTDI);
            this.productDialog = true;
        },
		confirmDeleteProduct(tipoDissidio) {
			this.tipoDissidio = tipoDissidio;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			this.tipoDissidioService.delete(this.tipoDissidio.CODTDI);

			this.tipoDissidio = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Tipo de Dissídio removido com sucesso', life: 3000});

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
                if(this.tipoDissidio.DESTDI == "" || this.tipoDissidio.DESTDI == undefined || this.tipoDissidio.DATBASTDI == "" || this.tipoDissidio.DATBASTDI == undefined || this.tipo.value == undefined){
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
