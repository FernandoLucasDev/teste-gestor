<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast />
				<h4>
					<Translate text="Hierarquia" />
				</h4>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="hierarquias" :loading="loading" v-model:selection="selectedProducts" dataKey="id"
					:paginator="true" :rows="10" :filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Hierarquia"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<span class="block mt-2 md:mt-0 p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODHIE" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{ slotProps.data.CODHIE }}
						</template>
					</Column>
					<Column field="DESHIE" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.DESHIE }}
						</template>
					</Column>
					<Column field="QTDVOTHIE" header="Quantidade de votos" :sortable="true"
						headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.QTDVOTHIE }}
						</template>
					</Column>
					<Column field="ORDHIE" header="Ordenação" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.ORDHIE }}
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

				<Dialog v-model:visible="productDialog" :style="{ width: '70%' }" header="Detalhes da Hierarquia" :modal="true"
					class="p-fluid">
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
							<InputText v-model.trim="hierarquia.DESHIE" required="true" autofocus
								:class="{ 'p-invalid': submitted && !hierarquia.DESHIE }" maxlength="30" />
							<small class="p-error" v-if="submitted && !hierarquia.DESHIE">Este campo é obrigatório.</small>
						</div>
						<div class="field">
							<label for="name">Quantidade de votos</label>
							<InputNumber v-model="hierarquia.QTDVOTHIE" required="true" autofocus :class="{
								'p-invalid':
									submitted &&
									(!hierarquia.QTDVOTHIE || hierarquia.QTDVOTHIE <= 0),
							}" />
							<small class="p-error" v-if="submitted &&
								(!hierarquia.QTDVOTHIE || hierarquia.QTDVOTHIE <= 0)
								">
								A quantidade de votos deve ser um número positivo.
							</small>
						</div>
						<div class="field">
							<label for="name">Ordenaçao</label>
							<InputNumber v-model="hierarquia.ORDHIE" required="true" autofocus
								:class="{ 'p-invalid': submitted && !hierarquia.ORDHIE }" />
							<small class="p-error" v-if="submitted && !hierarquia.ORDHIE">Este campo é obrigatorio.</small>
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
						<span>Deseja realmente excluir esta Hierarquia ?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deletesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span>Are you sure you want to delete the selected products?</span>
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
import { FilterMatchMode } from "primevue/api"
import HierarquiaService from "../../service/icontribui/HierarquiaService"
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
	//mixins : [translate],
	data() {
		return {
			translate: null,
			loading: true,
			loading2: false,
			hierarquias: null,
			hierarquia: {},
			productDialog: false,
			deleteDialog: false,
			deletesDialog: false,
			selectedProducts: null,
			filters: {},
			submitted: false,
			saving: false,
			statuses: [
				{ label: "INSTOCK", value: "instock" },
				{ label: "LOWSTOCK", value: "lowstock" },
				{ label: "OUTOFSTOCK", value: "outofstock" },
			],
		}
	},
	created() {
		this.hierarquiaService = new HierarquiaService()
		this.initFilters()
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.loading = true
			this.hierarquiaService.all().then((data) => {
				this.hierarquias = data
				this.loading = false
			})
		},
		formatCurrency(value) {
			if (value)
				return value.toLocaleString("en-US", {
					style: "currency",
					currency: "USD",
				})
			return
		},
		openNew() {
			console.log("!")
			this.hierarquia = {}
			this.submitted = false
			this.productDialog = true
		},
		hideDialog() {
			this.productDialog = false
			this.submitted = false
		},

		validaCampos() {
			console.log("Entrou na função ValidaCampos")
			if (
				this.hierarquia.DESHIE == "" ||
				this.hierarquia.DESHIE == undefined ||
				this.hierarquia.QTDVOTHIE == "" ||
				this.hierarquia.QTDVOTHIE == undefined ||
				this.hierarquia.ORDHIE == "" ||
				this.hierarquia.ORDHIE == undefined
			) {
				this.$toast.add({
					severity: "error",
					summary: "Atenção",
					detail: "Preencha os campos obrigatórios!",
					life: 3000,
				})

				this.submitted = true
				return false
			} else if (this.hierarquia.QTDVOTHIE <= 0) {
				this.$toast.add({
					severity: "error",
					summary: "Atenção",
					detail: "A quantidade de votos deve ser um número positivo!",
					life: 3000,
				})

				this.submitted = true
				return false

			} else {
				this.submitted = false
				return true
			}
		},
		async save() {
			if (this.saving) return
			if (!this.validaCampos()) return
			console.log(this.validaCampos())

			this.submitted = true

			this.saving = true

			let response
			if (this.hierarquia.CODHIE) {
				response = await this.hierarquiaService.update(this.hierarquia)
			} else {
				response = await this.hierarquiaService.store(this.hierarquia)
				this.load()
			}

			if (response) {
				this.$toast.add({
					severity: "success",
					summary: "Sucesso",
					detail: "Hierarquia salva com sucesso",
					life: 3000,
				})
			} else {
				this.$toast.add({
					severity: "error",
					summary: "Erro",
					detail: "Hierarquia não salva",
					life: 3000,
				})
			}

			this.productDialog = false
			this.saving = false
			this.load()
		},
		edit(hierarquia) {
			this.loading2 = true
			this.hierarquiaService.get(hierarquia.CODHIE).then((data) => {
				this.hierarquia = data
				this.loading2 = false
			})
			this.productDialog = true
			this.load()
		},
		confirmDeleteProduct(hierarquia) {
			this.hierarquia = hierarquia
			this.deleteDialog = true
		},
		async deleteFunction() {
			this.deleteDialog = false
			await this.hierarquiaService.delete(this.hierarquia.CODHIE)

			this.hierarquia = {}

			this.$toast.add({
				severity: "success",
				summary: "Sucesso",
				detail: "Hierarquia removido com sucesso",
				life: 3000,
			})

			this.load()
		},
		exportCSV() {
			this.$refs.dt.exportCSV()
		},
		confirmDeleteSelected() {
			this.deletesDialog = true
		},
		initFilters() {
			this.filters = {
				global: { value: null, matchMode: FilterMatchMode.CONTAINS },
			}
		},
	},
}
</script>

<style scoped lang="scss">
@import "../../assets/demo/badges.scss";
</style>
