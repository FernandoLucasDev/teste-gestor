<template>
    <div class="grid">
		<div class="col-12">
			<div class="card">
                <h4><Translate text="Grau Instrução" /></h4>
				<Toast/>
				<Toolbar class="mb-4">
					<template v-slot:start>
						<div class="my-2">
							<Button label="Nova" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
						</div>
					</template>
				</Toolbar>

				<DataTable ref="dt" :value="listaGrauInstrucao" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Grau Instrução" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<!-- <h5 class="m-0">
								<Translate text="Grau Instrução" />
							</h5> -->
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

					<Column field="CODGRAINS" header="Código" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Name</span> -->
							{{data.CODGRAINS}}
						</template>
					</Column>
                    <Column field="DESGRAINS" header="Descrição" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Name</span> -->
							{{data.DESGRAINS}}
						</template>
					</Column>
					<Column headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'Excluir'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Grau Instrução" :modal="true" class="p-fluid">
					<div class="formgrid grid">						
                        <div class="field col-12 sm:col-12 md:col-12 lg:col-6">
							<label for="name">Descrição</label>
							<InputText v-model.trim="grauInstrucao.DESGRAINS" required="true" autofocus :class="{'p-invalid': submitted && !grauInstrucao.DESGRAINS}" maxLength="50"/>
							<small class="p-invalid" v-if="submitted && !grauInstrucao.DESGRAINS">Preencha o campo.</small>
						</div>
                        <div class="field col-12 sm:col-12 md:col-12 lg:col-3">
                            <label for="name">Nível Grau Instrução</label>
                            <Dropdown v-model="nivelGrauInstrucao" :options="listaNivelGrauInstrucao" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <small class="p-invalid" v-if="submitted && !grauInstrucao.NIVGRAINS">Preencha o campo.</small>
                        </div>
                        <div class="field col-12 sm:col-12 md:col-12 lg:col-3">
                            <label for="name">Completo?</label>
                            <Dropdown v-model="completoGrauInstrucao" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <small class="p-invalid" v-if="submitted && !grauInstrucao.COMGRAINS">Preencha o campo.</small>
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
						<span>Deseja realmente excluir o Grau Instrução <b>{{grauInstrucao.DESGRAINS}}</b>?</span>
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
    import GrauInstrucaoService from '../../../../service/GrauInstrucaoService';
    import NivelEducacaoService from '../../../../service/rede-seguro-facil/NivelEducacaoService';
    import { mapDropdownSearch } from '../../../../defaults/map';
    export default {
        
        
        data(){
            return{
                translate : null,
                loading : true,
                loading2 : false,
                listaGrauInstrucao : null,
                grauInstrucao : {},
                nivelGrauInstrucao: {},
                completoGrauInstrucao: null,
                productDialog: false,
                deleteDialog: false,
                deletesDialog: false,
                selectedProducts: null,
                grauInstrucaoService: null,
                nivelEducacaoService: null,
                listaNivelGrauInstrucao: [],
                filters: {},
                submitted: false,
                saving : false,
                statuses: [
                    {label: 'INSTOCK', value: 'instock'},
                    {label: 'LOWSTOCK', value: 'lowstock'},
                    {label: 'OUTOFSTOCK', value: 'outofstock'}
                ],
                opcoesSimNao: [
                    { label: "Sim", value: "S" },
                    { label: "Não", value: "N" },
                ],
            }
        },

        created(){
            this.grauInstrucaoService = new GrauInstrucaoService();
            this.nivelEducacaoService = new NivelEducacaoService();
		    this.initFilters();

            this.nivelEducacaoService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaNivelGrauInstrucao.push({ label : entry.DESNIVEDU, value : entry.CODNIVEDU })
            )
          })

        },

        mounted(){
            this.load();
        },

        methods:{
            load() {
                this.loading = true;
                this.grauInstrucaoService.all().then(
                    (data) => {
                        console.log("DATA =>", data);
                        // this.listaGrauInstrucao = data
                        this.listaGrauInstrucao = data.map((item)=>{
                            return {
                                CODGRAINS: item.CODGRAINS,
                                DESGRAINS: item.DESGRAINS,
                                NIVGRAINS: item.NIVGRAINS,
                                COMGRAINS: item.COMGRAINS,
                                nivelGrauInstrucao: this.listaNivelGrauInstrucao.find(element => element.value == item.CODGRAINS)
                            }
                        })
                        console.log("listaGrauInstrucao", this.listaGrauInstrucao);
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
                this.grauInstrucao = {};
                this.completoGrauInstrucao = {};
                this.nivelGrauInstrucao = {};
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

                let data = this.grauInstrucao;
                data.NIVGRAINS = this.nivelGrauInstrucao.value;
                data.COMGRAINS = this.completoGrauInstrucao.value;
                console.log("this.grauInstrucao", this.grauInstrucao);
                
                this.submitted = true;
                this.saving = true;

                let response;
                if (this.grauInstrucao.CODGRAINS) {
                    response = await this.grauInstrucaoService.update(this.grauInstrucao);
                }
                else {
                    response = await this.grauInstrucaoService.store(this.grauInstrucao);
                }			

                if (response) {
                    this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
                    this.load();
                }
                else {
                    this.$toast.add({severity:'error', summary: 'Erro', detail: 'Grau Instrução não salvo', life: 3000});
                }

                this.productDialog = false;
                this.saving = false;
            },
            edit(dados) {
                console.log("dados edit =>", dados);
                console.log("this.grauInstrucao.NIVGRAINS", this.grauInstrucao.NIVGRAINS);
                this.loading2 = true;
                this.grauInstrucao = dados;
                this.nivelGrauInstrucao = this.listaNivelGrauInstrucao.find(element => element.value == dados.NIVGRAINS);
                // this.completoGrauInstrucao = (dados.COMGRAINS == "S" || dados.COMGRAINS == "s" ? "Sim" : "Não");
                this.completoGrauInstrucao = this.opcoesSimNao.find(element => element.value == dados.COMGRAINS);
                this.productDialog = true;
            },
            confirmDeleteProduct(grauInstrucao) {
                this.grauInstrucao = grauInstrucao;
                this.deleteDialog = true;
            },
            async deleteFunction() {
                this.deleteDialog = false;
                console.log("this.grauInstrucao", this.grauInstrucao)			
                await this.grauInstrucaoService.delete(this.grauInstrucao);

                this.grauInstrucao = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Grau Instrução removido com sucesso', life: 3000});

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
                if(this.grauInstrucao.DESGRAINS == "" || this.grauInstrucao.DESGRAINS == undefined || this.nivelGrauInstrucao.value == undefined || this.completoGrauInstrucao.value == undefined){
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

<style lang="scss" scoped>

</style>