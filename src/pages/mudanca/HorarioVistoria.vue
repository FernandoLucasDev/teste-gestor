<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h4><Translate text="Horario de Vistoria" /></h4>
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="horariosVistoria" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Horario de Vistoria" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODVIS" header="Código" :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Código</span>
							{{slotProps.data.CODVIS}}
						</template>
					</Column>
					<Column field="HORINI" header="Horário Inicial" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Horário Inicial</span>
							{{slotProps.data.HORINI}}
						</template>
					</Column>
					<Column field="HORFIN" header="Horário Final" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Horário Final</span>
							{{slotProps.data.HORFIN}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Horário" :modal="true" class="p-fluid">
					<div v-if="loading2">
						<div class="form grid">
							<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
								<Skeleton style="margin-top: 0.3rem; margin-bottom: 0.6rem;"></Skeleton>
								<Skeleton height="2.3rem"></Skeleton>
							</div>
							<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
								<Skeleton style="margin-top: 0.3rem; margin-bottom: 0.6rem;"></Skeleton>
								<Skeleton height="2.3rem"></Skeleton>
							</div>
						</div>
								<!-- <Skeleton class="mb-2"></Skeleton>
								<Skeleton class="mb-2"></Skeleton>
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
								<Skeleton height=".5rem"></Skeleton> -->
					</div>
					<div v-else>
						<div class="form grid">
							<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
								<label for="horarioInicial">Horário Inicial</label>
								<InputMask id="horarioInicial" mask="99:99:99" :class="{'p-invalid': submitted && !horarioVistoria.HORINI}" v-model="horarioVistoria.HORINI" />
								<small class="p-error" v-if="submitted && !horarioVistoria.HORINI">Este campo é obrigatório.</small>
							</div>
							<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
								<label for="horarioFinal">Horário Final</label>
								<InputMask id="horarioFinal" mask="99:99:99" :class="{'p-invalid': (submitted && !horarioVistoria.HORFIN) || (submitted && this.horarioVistoria.HORINI == this.horarioVistoria.HORFIN)}" v-model="horarioVistoria.HORFIN" />
								<small class="p-error" v-if="submitted && !horarioVistoria.HORFIN">Este campo é obrigatório.</small>
								<small class="p-error" v-if="submitted && (this.horarioVistoria.HORINI == this.horarioVistoria.HORFIN) && horarioVistoria.HORFIN">A hora final deve ser diferente da inicial.</small>
							</div>
						</div>
					</div>
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<!-- <Button label="Salvar" :loading="this.saving" icon="pi pi-check" class="p-button-text" @click="save" /> -->
						<Button label="Salvar" :loading="this.saving" icon="pi pi-check" class="p-button-text" @click="validaCampos()" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Deseja realmente excluir este Horário <b>{{horarioVistoria.HORINI}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>

				<Dialog v-model:visible="horaInicialMaiorDialog" :style="{width: '450px'}" header="Atenção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span>A hora inicial informada é posterior a hora final informada. Deseja continuar?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="horaInicialMaiorDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="save()" />
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
import HorarioVistoriaService from '../../service/mudanca/HorarioVistoriaService';
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			loading : true,
			loading2 : false,
			horariosVistoria : null,
			horarioVistoria : {},
			productDialog: false,
			deleteDialog: false,
			deletesDialog: false,
			horaInicialMaiorDialog: false,
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
		this.horarioVistoriaService = new HorarioVistoriaService();
		this.initFilters();
	},
	mounted() {
		this.load();
	},
	methods: {
		load() {
			this.loading = true;
			this.horarioVistoriaService.all().then(
				(data) => {
					this.horariosVistoria = data
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
			this.horarioVistoria = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		validaCampos(){
			this.submitted = true;
			// console.log(this.horarioVistoria);
			// this.submitted = false;
			if((!this.horarioVistoria.HORINI && !this.horarioVistoria.HORFIN) || (this.horarioVistoria.HORINI == "" || this.horarioVistoria.HORFIN == "")){
				this.saving = false;
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios!', life: 3000});
				return;
			}else if(this.horarioVistoria.HORINI == this.horarioVistoria.HORFIN){
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'A hora final deve ser diferente da inicial!', life: 3000});
				return;
			}else if(this.horarioVistoria.HORINI > this.horarioVistoria.HORFIN){
				this.horaInicialMaiorDialog = true;
				return;
			}

			// if(){
			// 	this.saving = true;
			// 	return true;
			// }
			this.save();
		},
		async save() {
			if (this.saving) return;
			this.horaInicialMaiorDialog = false;

			// this.submitted = true;
			this.saving = true;

			// if(!this.validaCampos()) return;

			let response;
			if (this.horarioVistoria.CODVIS) {
				response = await this.horarioVistoriaService.update(this.horarioVistoria);
			}
			else {
				response = await this.horarioVistoriaService.store(this.horarioVistoria);
			}
			this.load();

			if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Horario de Vistoria salvo com sucesso', life: 3000});
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Horario de Vistoria não salvo', life: 3000});
			}

			this.productDialog = false;
			this.saving = false;
		},
		edit(horarioVistoria) {
			this.loading2 = true;
			this.horarioVistoriaService.get(horarioVistoria.CODVIS).then(
				(data) => {
					this.horarioVistoria = data
					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(horarioVistoria) {
			this.horarioVistoria = horarioVistoria;
			this.deleteDialog = true;
		},
		async deleteFunction() {
			this.deleteDialog = false;			
			this.horarioVistoriaService.delete(this.horarioVistoria.CODVIS);

			this.horarioVistoria = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Horario de Vistoria removido com sucesso', life: 3000});

			this.load();
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deletesDialog = true;
		},
		confirmSaveHoraInicialMaior() {
			this.horaInicialMaiorDialog = true;
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
