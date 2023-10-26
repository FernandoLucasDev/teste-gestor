<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast />
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="tipoDocumentos" :loading="loading" v-model:selection="selectedProducts"
					dataKey="id" :paginator="true" :rows="10" :filters="filters"
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
					:rowsPerPageOptions="[5, 10, 25]"
					currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords}"
					responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Tipo Documento" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
								<i class="pi pi-search" />
								<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODTIPDOC" header="Cód." :sortable="true" headerStyle="width:43%; min-width:5em;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{ slotProps.data.CODTIPDOC }}
						</template>
					</Column>
					<Column field="DESTIPDOC" header="Descrição" :sortable="true" headerStyle="width:43%; min-width:5em;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{ slotProps.data.DESTIPDOC }}
						</template>
					</Column>
					<Column headerStyle="min-width:10em; width:10em;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2"
								@click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
								@click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{ width: '70%' }" header="Detalhes da Tipo Documento"
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
						<div class="field">
							<label for="name">Descrição</label>
							<InputText v-model.trim="tipoDocumento.DESTIPDOC" required="true" autofocus
								:class="{ 'p-invalid': submitted && !tipoDocumento.DESTIPDOC }" 
								maxLength="20"/>
							<small class="p-error" v-if="submitted && !tipoDocumento.DESTIPDOC">Este campo é obrigatório</small>
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
						<span>Deseja realmente excluir este Tipo Documento ?</span>
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
import { FilterMatchMode } from "primevue/api"
import TipoDocumentoService from "../../service/financeiro/TipoDocumentoService"
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';


export default {
	//mixins : [translate],
	data() {
		return {
			translate: null,
			loading: true,
			loading2: false,
			tipoDocumentos: null,
			tipoDocumento: {},
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
		this.tipoDocumentoService = new TipoDocumentoService()
		this.initFilters()
	},
	mounted() {
		this.load()
	},
	methods: {
		load() {
			this.loading = true
			this.tipoDocumentoService.all().then((data) => {
				this.tipoDocumentos = data
				this.loading = false
			})
		},

		validateFields() {
			this.submitted = true
			//console.log("entrou na função validateFields")
			if (
				this.tipoDocumento.DESTIPDOC == undefined ||
				this.tipoDocumento.DESTIPDOC == ""
				) {
					this.$toast.add({
						severity: "error",
						summary: "Erro",
						detail: "Preencha os campos obrigatórios!",
						life: 3000,
					})
					return false
			}

			else {
				return true
			}
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
			//console.log("Entrou na função openNew")
			this.tipoDocumento = {}
			this.submitted = false
			this.productDialog = true
		},
		hideDialog() {
			this.productDialog = false
			this.submitted = false
		},
		async save() {
			//colocar o submitted true para garantir que esteja validando o salvar
			this.submitted = true
			if (!this.validateFields()) return
			if (this.saving) return

			this.saving = true
			let response
			if (this.tipoDocumento.CODTIPDOC) {
				response = await this.tipoDocumentoService.update(this.tipoDocumento)
			} else {
				response = await this.tipoDocumentoService.store(this.tipoDocumento)
			}
			//Ao terminar de salvar recarrega os dados na tela usando a função load 
			//OBS: A FUNÇÃO LOAD NÃO DEVE FICAR DENTRO DO ELSE
			this.load();

			if (response) {
				this.$toast.add({
					severity: "success",
					summary: "Sucesso",
					detail: "Tipo Documento salvo com sucesso",
					life: 3000,
				})

			} else {
				this.$toast.add({
					severity: "error",
					summary: "Erro",
					detail: "Tipo Documento não salvo",
					life: 3000,
				})
			}

			this.productDialog = false
			this.saving = false
		},

		edit(tipoDocumento) {
			this.loading2 = true
			this.tipoDocumentoService.get(tipoDocumento.CODTIPDOC).then(
			(data) => {
				this.tipoDocumento = data
				this.loading2 = false
			})
			this.productDialog = true
		},
		confirmDeleteProduct(tipoDocumento) {
			this.tipoDocumento = tipoDocumento
			this.deleteDialog = true
		},
		async deleteFunction() {
			this.deleteDialog = false
			this.tipoDocumentoService.delete(this.tipoDocumento.CODTIPDOC)

			this.tipoDocumento = {}

			this.$toast.add({
				severity: "success",
				summary: "Sucesso",
				detail: "Tipo Documento removido com sucesso",
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
