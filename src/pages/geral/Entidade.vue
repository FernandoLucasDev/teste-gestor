<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<Toast/>
				<h4>
					<Translate text="Entidade" />
				</h4>				
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="entidades" :loading="loading" v-model:filters="selectedProducts"
					:lazy="true"
					@page="onPage($event)"
					@sort="onSort($event)"
					dataKey="id"
					paginator
					:rows="10"
					:totalRecords="totalRecords" 
					:filters="filters" 
					paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" 
					currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} entidades" >
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<!-- <InputText v-model="filters['global'].value" placeholder="Procurar..." @input="filtra()"/> -->
									<InputText v-model="filters" placeholder="Procurar..."/>
							</span>
						</div>
					</template>

					<Column field="CODENT" header="Cód." :sortable="true" headerStyle="width:14%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Code</span>
							{{slotProps.data.CODENT}}
						</template>
					</Column>
					<Column field="NOMENT" header="Nome" :sortable="true" headerStyle="width:80%; min-width:10rem;">
						<template #body="slotProps">
							<span class="p-column-title">Name</span>
							{{slotProps.data.NOMENT}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>
				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" :modal="true" class="p-fluid">
					<template #header>
						<h4>
							Detalhes de <Translate text="Entidade" />
						</h4>
					</template>
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
							<div class="field col-12">
								<label for="name"><Translate text="Razão Social" /></label>
								<InputText v-model.trim="entidade.NOMENT" required="true" autofocus maxlength="100" :class="{'p-invalid': submitted && !entidade.NOMENT}" />
								<small class="p-invalid" v-if="submitted && !entidade.NOMENT">Nome é obrigatório.</small>
							</div>

							<div class="field col-12">
								<label for="description"><Translate text="Nome Fantasia" /></label>
								<InputText v-model.trim="entidade.NOMRESENT" maxlength="40" />
							</div>
							
							<div class="field col-12 sm:col-12 md:col-3">
								<label for="tipoDocumento">Tipo de Documento</label>
								<Dropdown id="tipoDocumento" v-model="objTipoDocumento" :options="tiposDocumento" optionLabel="label" placeholder="Selecione" @change="() => {entidade.TIPDOCENT = objTipoDocumento.value}">
									<template #value="slotProps">
										<div v-if="slotProps.value && slotProps.value.value">
											<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
										</div>
										<span v-else>
											{{slotProps.placeholder}}
										</span>
									</template>
								</Dropdown>
								<small class="p-invalid" v-if="this.validaDropdown">Tipo de Documento é obrigatório.</small>
							</div>
							<div class="field col-12 lg:col-6">
								<label>Documento</label>
								<InputText 
										v-model.trim="entidade.DOCENT" 
										@input="onKeyUpDocumento" 
										required="true" 
										autofocus 
										:disabled="!entidade || (!objTipoDocumento && objTipoDocumento == undefined || (objTipoDocumento.label == undefined || objTipoDocumento.label == 'NI'))" />
									<small class="p-invalid" v-if="submitted && !entidade.DOCENT">Documento é obrigatório.</small>
							</div>
							<div class="field col-12 lg:col-3">
								<label>Telefone</label>
								<InputText v-model="entidade.TELENT" maxlength="15" @input="formataTELENT" />
								<!-- <InputMask mask="(99) 99999-9999" v-model="entidade.TELENT" maxlength="15" /> -->
							</div>
							<div class="field col-12 sm:col-12 md:col-4" v-if="parametros.CODEMP == 52">
								<label for="corretor">Corretor</label>
								<Dropdown id="tipoDocumento" v-model="objCorretor" :options="listaCorretores" optionLabel="label" placeholder="Selecione" @change="() => entidade.corretor_id = objCorretor.value">
									<template #value="slotProps">
										<div v-if="slotProps.value && slotProps.value.value">
											<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
										</div>
										<span v-else>
											{{slotProps.placeholder}}
										</span>
									</template>
								</Dropdown>
							</div>
						</div>

							<div class="col-12">
								<TabView>
									<TabPanel header="Endereço">								
										<div class="formgrid grid">
											<div class="field col-12 sm:col-12 lg:col-3">
												<label>CEP</label>
												<InputMask mask="99.999-999" v-model.trim="entidade.CEPENDENT" />
											</div>
											<div class="field col-6 md:col-2">
												<Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchCEPOrigem" >
													<ProgressSpinner style="height: 25px;" stroke-width="4" aria-label="Custom ProgressSpinner" animationDuration="1s" v-if="loading3" />
												</Button>
											</div>
											<div class="field col-12 sm:col-12 lg:col-5" v-if="this.parametros.ENDOBRENT == 'S'" >
												<label>Endereço</label>
												<InputText 
													v-model.trim="entidade.NOMLOG"
													required="true" 
													:class="{'p-invalid': submitted && !entidade.NOMLOG}" maxlength="255" />
												<small class="p-invalid" v-if="submitted && !entidade.NOMLOG">Endereço é obrigatório.</small>
											</div>
											<div class="field col-12 sm:col-12 lg:col-5" v-else>
												<label>Endereço</label>
												<InputText v-model.trim="entidade.NOMLOG" />
											</div>
											
											<div class="field col-12 sm:col-12 lg:col-2" v-if="this.parametros.ENDOBRENT == 'S'">
												<label>Número</label>
												<InputNumber 
													v-model="entidade.NUMENDENT" 
													required="true" 
													:class="{'p-invalid': submitted && !entidade.NUMENDENT}" />
												<small class="p-invalid" v-if="submitted && !entidade.NUMENDENT">Número é obrigatório.</small>
											</div>
											<div class="field col-12 sm:col-12 lg:col-2" v-else>
												<label>Número</label>
												<InputNumber v-model="entidade.NUMENDENT" />
											</div>
											<!-- <div class="grid"> -->
												<div class="field col-12 sm:col-12 lg:col-4" v-if="this.parametros.ENDOBRENT == 'S'">
													<label>Bairro</label>
													<InputText 
														v-model.trim="entidade.DESBAI" 
														required="true" 
														:class="{'p-invalid': submitted && !entidade.DESBAI}" />
													<small class="p-invalid" v-if="submitted && !entidade.DESBAI">Bairro é obrigatório.</small>
												</div>
												<div class="field col-12 sm:col-12 lg:col-4" v-else>
													<label>Bairro</label>
													<InputText v-model.trim="entidade.DESBAI" />
												</div>
												<div class="field col-12 sm:col-12 lg:col-4" v-if="this.parametros.ENDOBRENT == 'S'">
													<label>Cidade</label>
													<InputText 
														v-model.trim="entidade.DESCID"
														required="true" 
														:class="{'p-invalid': submitted && !entidade.DESCID}" />
													<small class="p-invalid" v-if="submitted && !entidade.DESCID">Cidade é obrigatório.</small>
												</div>
												<div class="field col-12 sm:col-12 lg:col-4" v-else>
													<label>Cidade</label>
													<InputText v-model.trim="entidade.DESCID" />
												</div>
												<div class="field col-12 sm:col-12 lg:col-4">
													<label for="name">Sigla do Estado</label>
													<Dropdown v-model="entidade.SIGEST" :options="listaSiglaEstado" optionLabel="label" optionValue="value" placeholder="Selecione" @change="log">
														<!-- <template #value="slotProps">
															<div v-if="slotProps.value && slotProps.value.value">
																<span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
															</div>
															<span v-else>
																{{slotProps.placeholder}}
															</span>
														</template> -->
													</Dropdown>
												</div>
												<div class="field col-12 sm:col-12 lg:col-8">
													<label>Referência</label>
													<InputText v-model.trim="entidade.REFENDENT" maxlength="100"/>
												</div>
											<!-- </div>										 -->
										</div>						
									</TabPanel>
									<TabPanel header="Detalhes" v-if="this.parametros.ABADETPAR == 'S'">
										<div class="grid">
											<div class="field col-4">
												<label for="situacao">Situação</label>
												<Dropdown id="situacao" v-model="entidade.CODSIT" :options="situacoes" optionLabel="DESSIT" placeholder="Selecione">
													<template #value="slotProps">
														<div v-if="slotProps.value && slotProps.value.CODSIT">
															<span :class="'product-badge status-' +slotProps.value.CODSIT">{{slotProps.value.DESSIT}}</span>
														</div>
														<span v-else>
															{{slotProps.placeholder}}
														</span>
													</template>
												</Dropdown>
											</div>
										</div>
									</TabPanel>
									<TabPanel header="Documentos">
										<div class="grid">
											<div class="field col-12">
												<label>Inscrição Estadual</label>
												<InputText v-model.trim="entidade.INSESTENT" maxlength="9" />
											</div>
											<div class="field col-12">
												<label>Inscrição Municipal</label>
												<InputText v-model.trim="entidade.INSMUNENT" maxlength="11" />
											</div>
										</div>
									</TabPanel>
									<TabPanel header="Observações">
										<div class="grid">
											<div class="field col-12">
												<label>Observações</label>
												<Textarea v-model="entidade.OBSENT" rows="6" />
											</div>											
										</div>
									</TabPanel>
								</TabView>
							</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog v-model:visible="deleteEntidadeDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Deseja realmente excluir esta entidade <b>{{entidade.NOMENT}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteEntidadeDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteEntidade" />
					</template>
				</Dialog>

				<Dialog v-model:visible="deleteEntidadesDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
					<div class="flex align-items-center justify-content-center">
						<i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
						<span v-if="product">Are you sure you want to delete the selected products?</span>
					</div>
					<template #footer>
						<Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteEntidadesDialog = false"/>
						<Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteSelectedProducts" />
					</template>
				</Dialog>

				<Dialog v-model:visible="cepConfirmDialog" :style="{width: '450px'}" header="Confirmação de CEP" :modal="true">
    
					<p>{{ endereco }}</p>
					<p>{{ bairro }}</p>
					<p>{{ cidade }} - {{ uf }}</p>
					<p><strong>O endereço</strong>  está correto?</p>
				
				<template #footer>
					<Button label="Não" icon="pi pi-times" class="p-button-text" @click="noConfirmCEP"/>
					<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmCEP" />
				</template>
				</Dialog>
			</div>
		</div>
	</div>
</template>

<script>
import {FilterMatchMode} from 'primevue/api';
import ProductService from '../../service/ProductService';
import EntidadeService from '../../service/EntidadeService';
import SituacaoService from '../../service/SituacaoService';
import ParametroService from '../../service/geral/ParametroService';
import CorretorService from '../../service/geral/CorretorService';
import CepService from '../../service/CepService';
import { cpfMask, cepMask, cnpjMask, ceiMask, telefoneMask } from '../../defaults/mask';
import { mapDropdownSearch } from '../../defaults/map';
import { switchCase } from '@babel/types';

export default {
	//mixins : [translate],
	data() {
		return {
			translate : null,
			products: null,
			parametros: null,
			loading : true,
			loading2 : false,
			loading3: false,
			entidades : null,
			endereco: null,
			bairro: null,
			cidade: null,
			uf: null,
			cepConfirm: true,
			entidade : {},
			situacoes : [],
			listaCorretores : [],
			objCorretor: null,
			siglaEstado: {},
			productDialog: false,
			deleteEntidadeDialog: false,
			deleteEntidadesDialog: false,
			cepConfirmDialog: false,
			product: {},
			selectedProducts: null,
			filters: "",
			submitted: false,
			saving : false,
			statuses: [
				{label: 'INSTOCK', value: 'instock'},
				{label: 'LOWSTOCK', value: 'lowstock'},
				{label: 'OUTOFSTOCK', value: 'outofstock'}
			],
			tiposDocumento : [
				{label : 'NI', value : 1},
				{label : 'CPF', value : 2},
				{label : 'CNPJ', value : 3},
				{label : 'CEI', value : 4},
			],
			objTipoDocumento: null,
			validaDropdown: false,
			// DataTable
      totalRecords : 0,
			optionsSSR: {},
			listaSiglaEstado: [
				{ label: "AC", value: "AC" },
				{ label: "AL", value: "AL" },
				{ label: "AP", value: "AP" },
				{ label: "AM", value: "AM" },
				{ label: "BA", value: "BA" },
				{ label: "CE", value: "CE" },
				{ label: "DF", value: "DF" },
				{ label: "ES", value: "ES" },
				{ label: "GO", value: "GO" },
				{ label: "MA", value: "MA" },
				{ label: "MT", value: "MT" },
				{ label: "MS", value: "MS" },
				{ label: "MG", value: "MG" },
				{ label: "PA", value: "PA" },
				{ label: "PB", value: "PB" },
				{ label: "PR", value: "PR" },
				{ label: "PE", value: "PE" },
				{ label: "PI", value: "PI" },
				{ label: "RJ", value: "RJ" },
				{ label: "RN", value: "RN" },
				{ label: "RS", value: "RS" },
				{ label: "RO", value: "RO" },
				{ label: "RR", value: "RR" },
				{ label: "SC", value: "SC" },
				{ label: "SP", value: "SP" },
				{ label: "SE", value: "SE" },
				{ label: "TO", value: "TO" },       
			],
		}
	},
	productService: null,
	situacaoService : null,
	parametroService: null,
	corretorService: null,
	cepService: null,
	entidadeService: null,
	async created() {
		this.productService = new ProductService();
		this.entidadeService = new EntidadeService();
		this.situacaoService = new SituacaoService();
		this.parametroService = new ParametroService();
		this.corretorService = new CorretorService();
		this.cepService = new CepService();

		this.parametros = await this.parametroService.all()
		this.parametros = this.parametros[0]

		if(this.parametros.CODEMP == 52){
			this.corretorService.all().then((data) => {
				this.listaCorretores = data.map((entry)=>{
					return {
						label: entry.NOMCOR,
						value: entry.id
					}
				})
			});
		}
		// this.initFilters();
	},
	mounted() {
		this.productService.getProducts().then(data => this.products = data);

		this.load();

		this.situacaoService.all()
		.then((response) => this.situacoes = response);
	},
	watch: {
    filters: function () {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.filtra();
      }, 800);
    }
  },
	methods: {
		log(){
			// // console.log(this.entidade.siglaEstado)
		},

		validaCampo(item){
			if (item) {
				return true;
			} else {
				return false;
			}
		},

		onKeyUpDocumento(ev) {
			// // console.log('this.entidade.TIPDOCENT :>> ', this.entidade.TIPDOCENT.label);
			// this.entidade.DOCENT = cpfMask(ev.target.value);
			// this.entidade.DOCENT = cnpjMask(ev.target.value);
			switch (this.objTipoDocumento.label) {
				case 'CPF':
					this.entidade.DOCENT = cpfMask(ev.target.value);
					break;

				case 'CNPJ':
					this.entidade.DOCENT = cnpjMask(ev.target.value);
					break;
				
				case 'CEI':
					this.entidade.DOCENT = ceiMask(ev.target.value);
					break;

				default:
					break;
			}
		},

		formataDocumento(documento) {
			// // console.log('this.entidade.TIPDOCENT :>> ', this.entidade.TIPDOCENT.label);
			if(this.objTipoDocumento){
				switch (this.objTipoDocumento.label) {
					case 'CPF':
						return cpfMask(documento);
						// break;
	
					case 'CNPJ':
						return cnpjMask(documento);
						// break;
					
					case 'CEI':
						return ceiMask(documento);
						// break;
	
					default:
						break;
				}
			}
		},

		formataTELENT(ev) {
			this.entidade.TELENT = telefoneMask(ev.target.value);
			ev.target.value = telefoneMask(ev.target.value);
		},

		onPage(event) {
			// // console.log("onpage >> ", event);
      this.load(event);
    },
    
		onSort(event) {
			// // console.log("onsort >> ", event);
      this.load(event);
    },

		load(options) {			
      if (!options) {
        options = {};
      }

//			// // console.log("A");
//			// // console.log(this.DataTable.options);
			this.loading = true;
			(new EntidadeService()).all(options).then(
				response => {
					this.totalRecords = response.totalRecords;
					this.entidades = response.data
					// this.loading = false;
				}
			).finally(() => {
        this.loading = false;
      })
		},

		filtra(options) {
      if (!options) {
        options = {};
      }
			let filtro = this.filters;
			this.loading = true;
			(new EntidadeService()).procura(options, filtro).then(
				response => {
					this.totalRecords = response.totalRecords;
					this.entidades = response.data
					// this.loading = false;
				}
			).finally(() => {
				this.loading = false;
			})
			
		},

		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.product = {};
			this.entidade = {};
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

				if (this.entidade.CEPENDENT) {
					this.entidade.CEPENDENT = this.entidade.CEPENDENT.toString().replace(/\,/g, "").replace(/\-/g, "").replace(/\./g, "");
				}

				// // console.log("🚀 ~ file: Entidade.vue:462 ~ save ~ this.entidade.TIPDOCENT:", this.entidade.TIPDOCENT)
				// if (this.entidade.TIPDOCENT) {
				// 	this.entidade.TIPDOCENT = this.entidade.TIPDOCENT.value;
				// }
				// // console.log("🚀 ~ file: Entidade.vue:462 ~ save ~ this.entidade.TIPDOCENT:", this.entidade.TIPDOCENT)
				
				if (this.entidade.CODSIT) {
					this.entidade.CODSIT = this.entidade.CODSIT.CODSIT;
				}

				if (!this.entidade.NOMLOG){
					this.entidade.NOMLOG = null;
				}
				else if (this.entidade.NOMLOG == 0 || this.entidade.NOMLOG == "0"){
					this.entidade.NOMLOG = null;
				}
	
				let response;
	
				if (this.entidade.CODENT) {
					// // console.log("Entrou no update");
					response = await this.entidadeService.update(this.entidade);
				}
				else if(this.entidade.NOMENT && this.entidade.DOCENT){
					// // console.log("Entrou no store");
					response = await this.entidadeService.store(this.entidade);
				}			

				// // console.log("responseeee", response);
				
				if (response) {
					this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Registro salvo com sucesso', life: 3000});
					this.hideDialog();
					this.load();				
				}
				else {
					this.$toast.add({severity:'error', summary: 'Erro', detail: 'Registro não salvo', life: 3000});
					// if (!this.entidade) {
					// } else {
					// 	this.validaDropdown = true;
					// 	this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preenchas os campos obrigatórios', life: 3000});
					// }
				}

			this.saving = false;
		},

		edit(entidade) {
			// console.log("editar",  entidade);
			this.loading2 = true;
			this.entidadeService.get(entidade.CODENT).then(
				(data) => {
					this.entidade = data
					// this.objTipoDocumento = this.tiposDocumento[this.entidade.TIPDOCENT-1];
					this.objTipoDocumento = this.tiposDocumento.find((item) => this.entidade.TIPDOCENT == item.value);
					this.entidade.CEPENDENT = ((data.CEPENDENT.toString()).replace(".","")).padStart(8, "0");
					// console.log(this.entidade.CEPENDENT)
					this.entidade.DOCENT = this.formataDocumento(this.entidade.DOCENT);
					// this.entidade.CEPENDENT = "31.255-700";

					if (this.entidade.NOMLOG == 0 || this.entidade.NOMLOG == "0"){
						this.entidade.NOMLOG = null;
					}

					if (this.entidade.corretor_id){
						this.objCorretor = this.listaCorretores.find(corretor => corretor.value == this.entidade.corretor_id);
					}

					if (this.entidade.CODSIT) {
						this.entidade.CODSIT = this.findSituacao(this.entidade.CODSIT);
					}

					this.loading2 = false;
				}
			);
			this.productDialog = true;
		},
		confirmDeleteProduct(entidade) {
			this.entidade = entidade;
			this.deleteEntidadeDialog = true;
		},
		async deleteEntidade() {
			this.deleteEntidadeDialog = false;			
			this.entidadeService.delete(this.entidade.CODENT);

			this.entidade = {};

			this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Registro removido com sucesso', life: 3000});

			this.load();
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.products.length; i++) {
				if (this.products[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		findSituacao(id) {
			let _situacao;
			this.situacoes.map(
				(situacao) => {
					if (situacao.CODSIT == id) {
						_situacao = situacao;
					}
				}
			);

			return _situacao;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteEntidadesDialog = true;
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProducts.includes(val));
			this.deleteEntidadesDialog = false;
			this.selectedProducts = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		},
		initFilters() {
			// this.filters = {
			// 		'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
			// }
		},
		searchCEPOrigem() {
			this.loading3 = true;
			// this.cepConfirmDialog = true;
			(new CepService()).get(this.entidade.CEPENDENT.replace(".", ""))
				.then(response => {
				this.endereco = response.dados[0].logradouroDNEC;
				this.bairro = response.dados[0].bairro;
				this.cidade = response.dados[0].localidade;
				this.uf = response.dados[0].uf;
				// this.siglaEstado = mapDropdownSearch(this.listaSiglaEstado, this.entidade.SIGEST);
			})
				.finally(() => {
				this.cepConfirmDialog = true;
				this.loading3 = false;
			});
		},
		noConfirmCEP() {
            this.cepConfirmDialog = false;
			// this.cepConfirm = false;
        },
		confirmCEP() {
            // this.cepConfirm = true;
			(new CepService()).get(this.entidade.CEPENDENT.replace(".", ""))
				.then(response => {
				// let data = this.entidade;
          		// data.SIGEST = this.siglaEstado.value;
				this.entidade.NOMLOG = this.endereco = response.dados[0].logradouroDNEC;
				this.entidade.DESBAI = this.bairro = response.dados[0].bairro;
				this.entidade.DESCID = this.cidade = response.dados[0].localidade;
				this.entidade.SIGEST = this.uf = response.dados[0].uf;
				this.siglaEstado = mapDropdownSearch(this.listaSiglaEstado, this.entidade.SIGEST);
			})
				.finally(() => {
				this.cepConfirmDialog = false;
			});
		},
	}
}
</script>

<style scoped lang="scss">
@import '../../assets/demo/badges.scss';
</style>
