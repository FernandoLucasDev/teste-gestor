<script setup>
import { ref, onMounted, reactive, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { FilterMatchMode } from 'primevue/api';

import ContaService from '../../../../service/financeiro/ContaService.js';
import BancoService from '../../../../service/financeiro/BancoService.js';
import AgenciaService from '../../../../service/financeiro/AgenciaService.js';
import TipoDespesaService from '../../../../service/financeiro/TipoDespesaService.js';

const router = useRouter();
const toast = useToast();

const contaService = new ContaService();
const bancoService = new BancoService();
const agenciaService = new AgenciaService();
const tipoDespesaService = new TipoDespesaService();

const loading = ref(false);
const validaCodigo = ref(false);
const validaDigito = ref(false);
const contas = ref([]);
const banco = ref([]);
const agencia = ref([]);
const tipoDespesa = ref([]);
const totalRecords = ref();
const deleteDialog = ref(false);
const conta = ref({});
const id = ref();
const filters = reactive({});
const descricao = ref();
const contaDialog = ref(false);
const submitted = ref(false);
// const filters = ref({
//  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
// });

const load = (options, nomusu = "") => {
	loading.value = true;

	options = { ...options, filters: filters.value };
	if (descricao.value) {
		options.query = {};
		options.query.nomusu = descricao.value;
	}

	if (nomusu == "") {
		contaService.all().then((response) => {
			if (response) {
				totalRecords.value = response.totalRecords;
				contas.value = response.data;
			}
		}
		).finally(() => {
			loading.value = false;

			bancoService.all().then((response) => {
				if (response) {
					banco.value = response;
				}
			}).finally(() => {
				contas.value.forEach(item => {
					let auxBanco = banco.value.find(data => data.CODBAN == item.CODBAN)
					let i = 0;
					contas.value[i].NOMBAN = auxBanco.NOMBAN;
				})
			})

			agenciaService.all().then((response) => {
				if (response) {
					agencia.value = response;
				}
			}).finally(() => {
				contas.value.forEach(item => {
					let auxAgencia = agencia.value.find(data => data.CODAGE == item.CODAGE)
					let i = 0;
					contas.value[i].NOMAGE = auxAgencia.NOMAGE;
				})
			})

			tipoDespesaService.all().then((response) => {
				if (response) {
					tipoDespesa.value = response;
				}
			});
		});			
	}
	else {
		contaService.procuraByUsuario(nomusu).then((response) => {
			contas.value = response.data
		}
		).finally(() => {
			loading.value = false;
		});
	}
}

const onPage = (event) => load(event);

const onSort = (event) => load(event);

// const novo = () => router.push({ path: '/administracao/fmtad04/novo' });

const edit = (contaEditar) => {
	conta.value = contaEditar;
	id.value = conta.value.CODCTA;
	submitted.value = false;
	contaDialog.value = true;

	let auxAgencia = agencia.value.find(data => data.CODAGE == conta.value.CODAGE)
	conta.value.CODAGE = auxAgencia;

	let auxBanco = banco.value.find(data => data.CODBAN == conta.value.CODBAN)
	conta.value.CODBAN = auxBanco;

	let auxTipoDespesa = tipoDespesa.value.find(data => data.CODTIPDES == conta.value.CODTIPDES)
	conta.value.CODTIPDES = auxTipoDespesa;

	if (conta.value.EMIPAPBAN == "S") {
		conta.value.EMIPAPBAN = true;
	}
};

const confirmDeleteProduct = (data) => {
	conta.value = data;
	deleteDialog.value = true;
}

const remove = () => {
	deleteDialog.value = false;
	loading.value = true;
	contaService.delete(conta.value)
		.then(response => {
			toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta removido com sucesso', life: 3000 });
			load();
		})
		.finally(() => {
			loading.value = false
		});
}

const applyFilter = () => {
	load();
}

onBeforeMount(() => {
	// initFilters();
	const initFilters = () => {
		filters.value = {
			'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
		}
	}
	initFilters();
	// filtraUsuario();
	load();
})

const openNew = () => {
	console.log("!");
	conta.value = {};
	submitted.value = false;
	contaDialog.value = true;
};

const formsubmit = (event) => {
	if (!conta.value.CODCTA) {
		toast.add({ severity: 'error', summary: 'Dados', detail: 'Código da conta é obrigatório.', life: 3000 });
		return false;
	}

	if (!conta.value.CODBAN) {
		toast.add({ severity: 'error', summary: 'Dados', detail: 'Banco é obrigatório.', life: 3000 });
		return false;
	}

	if (!conta.value.CODAGE) {
		toast.add({ severity: 'error', summary: 'Dados', detail: 'Agência é obrigatório.', life: 3000 });
		return false;
	}

	if (!conta.value.DIGCTA) {
		toast.add({ severity: 'error', summary: 'Dados', detail: 'Dígito é obrigatório.', life: 3000 });
		return false;
	}

	return true;
}

const save = async () => {
	if (!formsubmit()) {
		return;
	}

	loading.value = true;

	let response;
	
	let CODAGE = conta.value.CODAGE.CODAGE;
	conta.value.CODAGE = CODAGE;

	let CODBAN = conta.value.CODBAN.CODBAN;
	conta.value.CODBAN = CODBAN;

	if (conta.value.CODTIPDES) {
		let CODTIPDES = conta.value.CODTIPDES.CODTIPDES;
		conta.value.CODTIPDES = CODTIPDES;
	}

	if (conta.value.EMIPAPBAN) {
		conta.value.EMIPAPBAN = conta.value.EMIPAPBAN ? "S" : "N";
	}
	
	console.log("🚀 ~ file: Index.vue:212 ~ save ~ conta.value:", conta.value)
	if (id.value) {
		response = await contaService.update(conta.value);
	}
	else {
		response = await contaService.store(conta.value);
	}

	
	if (response) {
		setTimeout(() => contaDialog.value = false, 2000);

		toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Conta salva com sucesso.', life: 3000 });
	}
	else {
		toast.add({ severity: 'error', summary: 'Erro', detail: 'Conta não salva.', life: 3000 });
	}

	load();
	loading.value = false;
};

const validaConta = () => {
	const regex = /[a-zA-Z]/;

	if (conta.value.CODCTA) {
		if (regex.test(conta.value.CODCTA)) {
			validaCodigo.value = true
		} else {
			validaCodigo.value = false
		}
	}

	if (conta.value.DIGCTA) {
		if (regex.test(conta.value.DIGCTA)) {
			validaDigito.value = true
		} else {
			validaDigito.value = false
		}
	}
};
</script>

<template>
	<div class="p-fluid">
		<div class="grid">
			<div class="col-12">
				<div class="card">
					<Toast />
					<h5>Conta</h5>

					<Toolbar class="mb-4">
						<template v-slot:start>
							<div class="my-2">
								<Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="openNew" />
							</div>
						</template>
					</Toolbar>
					<DataTable
					  :value="contas"
					  :lazy="true"
					  :paginator="true"
					  :rows="10"
					  :loading="loading"
					  :totalRecords="totalRecords"
					  @page="onPage($event)"
					  @sort="onSort($event)"
					  responsiveLayout="scroll"
					  dataKey="CODCTA"
					  :filters="filters">

						<template #header>
							<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center md:col-4">
								<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="descricao" placeholder="Procurar..." @input="applyFilter" />
									<!-- <InputText v-model="filtraUsuario" placeholder="Procurar..." /> -->
								</span>
							</div>
						</template>
						<template #empty v-if="!loading">
							Nenhuma conta encontrada.
						</template>
						<template #loading>
							Carregando contas. Por favor, aguarde...
						</template>
						<template #footer v-if="!loading">
							Total de registros {{ totalRecords }}
						</template>
						<Column field="CODCTA" header="Conta" :sortable="true" style="width:6rem">
							<template #body="{ data }">
								{{ data.CODCTA }}-{{ data.DIGCTA }}
							</template>
						</Column>
						<Column field="CODAGE" header="Agência" :sortable="true" style="min-width:5rem; max-width: 20rem;">
							<template #body="{ data }">
								{{ data.NOMAGE }}
							</template>
						</Column>
						<Column field="CODBAN" header="Banco" :sortable="true" style="min-width:5rem; max-width: 20rem;">
							<template #body="{ data }">
								{{ data.NOMBAN }}
							</template>
						</Column>
						<Column field="CODEMPBAN" header="Empresa" :sortable="true" style="min-width:5rem">
							<template #body="{ data }">
								{{ data.CODEMPBAN }}
							</template>
						</Column>
						<!-- <Column field="IDEEMPBAN" header="Identificação" :sortable="true" style="min-width:5rem">
							<template #body="{ data }">
								{{ data.IDEEMPBAN }}
							</template>
						</Column> -->
						<Column headerStyle="min-width:10rem; width:10rem;">
							<template #body="props">
								<Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2"
									@click="edit(props.data)" />
								<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2"
									@click="confirmDeleteProduct(props.data)" />
							</template>
						</Column>
					</DataTable>

					<Dialog
					  v-model:visible="contaDialog"
					  :style="{ width: '70%' }"
					  header="Detalhes da conta"
					  :modal="true"
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
							<div class="formgrid grid">
								<div class="field col-12 sm:col-12 md:col-6 lg:col-4">
									<label for="name">Banco:</label>
									<Dropdown
										v-model="conta.CODBAN"
										:options="banco"
										optionLabel="NOMBAN"
										required="true"
										placeholder="Selecione">
										<template #value="slotProps">
											<div v-if="slotProps.value">
												<span :class="'product-badge status-' + slotProps.value">
													{{ slotProps.value.NOMBAN }}
												</span>
											</div>
											<span v-else>
												{{ slotProps.placeholder }}
											</span>
										</template>
										<template #option="slotProps">
											{{ slotProps.option.NOMBAN }}
										</template>
									</Dropdown>
									<small class="p-invalid" v-if="submitted && !banco.NOMBAN">Campo é obrigatório.</small>
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-4">
									<label for="name">Agência:</label>
									<Dropdown
										id="agencia"
										v-model="conta.CODAGE"
										:options="agencia"
										optionLabel="NOMAGE"
										required="true"
										placeholder="Selecione">
										<template #value="slotProps">
											<div v-if="slotProps.value">
												<span :class="'product-badge status-' + slotProps.value">
													{{ slotProps.value.NOMAGE }}
												</span>
											</div>
											<span v-else>
												{{ slotProps.placeholder }}
											</span>
										</template>
									</Dropdown>
									<small class="p-invalid" v-if="submitted && !banco.NOMAGE">Campo é obrigatório.</small>
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-4">
									<label class="col-6">Código</label>
									<label class="col-5" style="padding-left: 1.5rem;">Digito</label>
									<div class="p-inputgroup flex-1">
										<InputText
										  placeholder="Código"
										  v-model="conta.CODCTA"
										  maxlength="11"
											@input="validaConta"
										  required="true" />
										<span class="p-inputgroup-addon">-</span>
										<InputText
										  placeholder="Digito"
										  v-model="conta.DIGCTA"
											:useGrouping="false"
										  maxlength="1"
											@input="validaConta"
										  required="true" />
									</div>
									<small style="color: red;" v-if="validaCodigo"><b>Código não pode ter letras.</b><br></small>
									<small style="color: red;" v-if="validaDigito"><b>Dígito não pode ter letras.</b></small>
								</div>								
								<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
									<label>Empresa:</label>
									<InputText placeholder="Escreva" v-model="conta.CODEMPBAN" maxLength="50" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-6">
									<label>Identificação:</label>
									<InputText placeholder="Escreva" v-model="conta.IDEEMPBAN" maxLength="20" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Saldo inicial:</label>
									<InputNumber
										placeholder="Escreva"
										v-model="conta.SALINICTA"
										maxLength="20"
										mode="currency"
										currency="BRL"
										locale="pt-BR" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Saldo atual:</label>
									<InputNumber
										placeholder="Escreva"
										v-model="conta.SALATUCTA"
										maxLength="20"
										mode="currency"
										currency="BRL"
										locale="pt-BR" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Carteira:</label>
									<InputNumber placeholder="Escreva" v-model="conta.CODCAR" maxLength="20" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Rem. Banco:</label>
									<InputNumber placeholder="Escreva" v-model="conta.REMBAN" maxLength="20" />
								</div>								
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label for="name">Tipo de Despesa:</label>
									<Dropdown
										id="tipoDespesa"
										v-model="conta.CODTIPDES"
										:options="tipoDespesa"
										optionLabel="DESTIPDES"
										placeholder="Selecione">
										<template #value="slotProps">
											<div v-if="slotProps.value">
												<span :class="'product-badge status-' + slotProps.value">
													{{ slotProps.value.DESTIPDES }}
												</span>
											</div>
											<span v-else>
												{{ slotProps.placeholder }}
											</span>
										</template>
									</Dropdown>
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Espécie:</label>
									<InputText placeholder="Escreva" v-model="conta.ESPCTA" maxLength="10" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Espécie Doc:</label>
									<InputText placeholder="Escreva" v-model="conta.ESPDOCCTA" maxLength="10" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Aceite:</label>
									<InputText placeholder="Escreva" v-model="conta.ACECTA" maxLength="10" />
								</div>
								<div class="field col-12 sm:col-12 md:col-6 lg:col-3">
									<label>Código Contábil:</label>
									<InputText placeholder="Escreva" v-model="conta.CODCTBCTA" maxLength="30" />
								</div>
								<div class="field flex flex-column gap-3 col-12 sm:col-12 md:col-6 lg:col-3 pt-0">
									<label> Emite papaleta?</label>
									<Checkbox v-model="conta.EMIPAPBAN" :binary="true" />
								</div>
							</div>
						</div>		
						<template #footer>
							<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
							<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
						</template>			
					</Dialog>
				</div>
			</div>
		</div>
	</div>
	<Dialog v-model:visible="deleteDialog" :style="{ width: '450px' }" header="Confirmação de remoção" :modal="true">
		<div class="flex align-items-center justify-content-center">
			<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
			Deseja realmente excluir esta conta?
		</div>
		<template #footer>
			<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
			<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove" />
		</template>
	</Dialog>
</template>