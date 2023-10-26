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

				<DataTable ref="dt" :value="listaApolice" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Apólice" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Apólice" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>
                    <template #empty v-if="!loading">
                        Nenhum apólice encontrado
                    </template>
                    <template #loading>
                        Carregando apólices. Por favor, aguarde...
                    </template>
                    <!-- <template #footer v-if="!loading">
                    Total de registros {{ totalRecords}}
                    </template> -->

					<Column field="NUMAPO" header="Número" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Name</span> -->
							{{data.NUMAPO}}
						</template>
					</Column>
                    <Column field="DATINIAPO" header="Data" :sortable="true" headerStyle="width:40%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Name</span> -->
							{{formatDateTabela(data.DATINIAPO)}}
						</template>
					</Column>
					<Column headerStyle="width:10%; min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" v-tooltip.top="'Excluir'" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Apólice" :modal="true" class="p-fluid">
					<div>
                        <div class="field">
							<label for="name">Número:</label>
							<InputText v-model.trim="apolice.NUMAPO" required="true" autofocus :class="{'p-invalid': submitted && !apolice.NUMAPO}" maxlength="20"/>
							<small class="p-invalid" v-if="submitted && !apolice.NUMAPO">Preencha o campo.</small>
						</div>
                        <!-- <div class="field">
                            <label for="name">Entidade:</label>
                            <Dropdown v-model="entidade" :options="listaEntidade" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                        </div> -->
                        <div class="field">
                            <label for="name">Entidade:</label>
                            <EntidadeBox :selected="entidade" v-model="entidade" class='min-w-full'/>
                        </div>
                        <div class="field">
                            <label for="name">Tipo:</label>
                            <Dropdown v-model="tipoBeneficio" :options="listaTipoBeneficio" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <!-- <small class="p-invalid" v-if="submitted && !apolice.CODTBE">Preencha o campo.</small> -->
                        </div>						
                        <div class="field">
							<label for="name">Data Inicial:</label>
							<InputMask id="data" mask="99/99/9999" v-model="apolice.DATINIAPO" />
							<!-- <small class="p-invalid" v-if="submitted && !apolice.DATINIAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Valor do seguro:</label>
							<InputNumber v-model="apolice.VALSEGAPO" required="true" autofocus/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.VALSEGAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Capital do seguro:</label>
							<InputNumber v-model="apolice.CAPSEGAPO" required="true" autofocus/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.CAPSEGAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Limite para o cadastro:</label>
							<InputNumber v-model="apolice.DIALIMAPO" required="true" autofocus maxlength="6"/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.DIALIMAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Dia de Corte:</label>
							<InputNumber v-model="apolice.DIACORAPO" required="true" autofocus maxlength="6"/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.DIACORAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Idade Máxima:</label>
							<InputNumber v-model="apolice.ANOMAXAPO" required="true" autofocus maxlength="6"/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.ANOMAXAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Mês Máximo</label>
                            <Calendar v-model="apolice.MESMAXAPO" view="month" dateFormat="mm" />
							<!-- <InputNumber v-model="apolice.MESMAXAPO" required="true" autofocus maxlength="6"/> -->
							<!-- <small class="p-invalid" v-if="submitted && !apolice.MESMAXAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Idade Mínima</label>
							<InputNumber v-model="apolice.ANOMINAPO" required="true" autofocus maxlength="6"/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.ANOMINAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
							<label for="name">Mês Mínimo</label>
							<InputNumber v-model="apolice.MESMINAPO" required="true" autofocus maxlength="6"/>
							<!-- <small class="p-invalid" v-if="submitted && !apolice.MESMINAPO">Preencha o campo.</small> -->
						</div>
                        <div class="field">
                            <label for="name">Permitir idade mínima?</label>
                            <Dropdown v-model="permitirIdadeMinima" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <!-- <small class="p-invalid" v-if="submitted && !apolice.PERMINAPO">Preencha o campo.</small> -->
                        </div>
                        <div class="field">
                            <label for="name">Apólice Obrigatória?</label>
                            <Dropdown v-model="apoliceObrigatoria" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <!-- <small class="p-invalid" v-if="submitted && !apolice.OBRAPO">Preencha o campo.</small> -->
                        </div>
                        <div class="field">
                            <label for="name">Tipo de Pagamento</label>
                            <Dropdown v-model="tipoPagamento" :options="opcoesTipoPagamento" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <!-- <small class="p-invalid" v-if="submitted && !apolice.TIPPAGAPO">Preencha o campo.</small> -->
                        </div>
                        <div class="field">
                            <label for="name">Terceirizada?</label>
                            <Dropdown v-model="terceirizada" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <!-- <small class="p-invalid" v-if="submitted && !apolice.TERAPO">Preencha o campo.</small> -->
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
						<span>Deseja realmente excluir o Apólice <b>{{apolice.NUMAPO}}</b>?</span>
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
    import ApoliceService from '../../../../service/ApoliceService';
    import TipoBeneficioService from '../../../../service/rh/TipoBeneficioService';
    import EntidadeService from '../../../../service/EntidadeService'
    import { mapDropdownSearch } from '../../../../defaults/map';
    export default {
        
        
        data(){
            return{
                translate : null,
                loading : true,
                loading2 : false,
                listaApolice : null,
                apolice : {},
                tipoBeneficio: {},
                entidade: {},
                permitirIdadeMinima: null,
                apoliceObrigatoria: null,
                tipoPagamento: null,
                terceirizada: null,
                productDialog: false,
                deleteDialog: false,
                deletesDialog: false,
                selectedProducts: null,
                apoliceService: null,
                tipoBeneficioService: null,
                entidadeService: null,
                listaTipoBeneficio: [],
                partesData: [],
                partesDataEdit: [],
                partesDataMesMaximo: [],
                listaEntidade: [],
                filters: {},
                submitted: false,
                saving : false,
                editando : false,
                statuses: [
                    {label: 'INSTOCK', value: 'instock'},
                    {label: 'LOWSTOCK', value: 'lowstock'},
                    {label: 'OUTOFSTOCK', value: 'outofstock'}
                ],
                opcoesSimNao: [
                    { label: "Sim", value: "S" },
                    { label: "Não", value: "N" },
                ],
                opcoesTipoPagamento: [
                    { label: "Pré-pago", value: "1" },
                    { label: "Pós-pago", value: "2" },
                ],
            }
        },

        created(){
            this.apoliceService = new ApoliceService();
            this.tipoBeneficioService = new TipoBeneficioService();
            this.entidadeService = new EntidadeService();
		    this.initFilters();

            this.tipoBeneficioService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaTipoBeneficio.push({ label : entry.DESTBE, value : entry.CODTBE })
            )
          })

        //     this.entidadeService.all().then((response)=>{
        //     console.log("2", response);
        //     response.map(
        //       (entry) => this.listaEntidade.push({ label : entry.NOMENT, value : entry.CODENT })
        //     )
        //   })

        },

        mounted(){
            this.load();
        },

        methods:{
            formatDate(value) {
                console.log("Entrou no formatDate");
                // return value.substr(5, 4) + "-" + 
                // value.substr(3, 2) + "-" + 
                // value.substr(1, 2) 
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
                console.log("this.apolice.DATINIAPO =>", value);
                this.partesDataEdit = value.split("-");
                let ano = this.partesDataEdit[0];
                let mes = this.partesDataEdit[1];
                let dia = this.partesDataEdit[2];
                return dia + "/" + mes + "/" + ano;
            },
            formatDateTabela(value){
                if(value){
                    this.partesDataEdit = value.split("-");
                    let ano = this.partesDataEdit[0];
                    let mes = this.partesDataEdit[1];
                    let dia = this.partesDataEdit[2];
                    return dia + "/" + mes + "/" + ano; 
                }
                return
            },
            formatDatee(value){
                if (value) {
                    let ano = value.splice(0, 1);
                    let mes = value.splice(2, 3);
                    let dia = value.splice(4, 7);
                    // this.partesData = value.slice();
                    return dia + "/" + mes + "/" + ano;
                }
            },
            // formatMonth(value){
            //     this.partesDataMesMaximo = value.split("/");
            //     var mes = this.partesDataMesMaximo[0];
            //     return mes;
            // },
            load() {
                this.loading = true;
                this.apoliceService.all().then(
                    (data) => {
                        console.log("DATA =>", data);
                        // this.listaApolice = data
                        if(data){
                            this.listaApolice = data.map((item)=>{
                                return {
                                    NUMAPO: item.NUMAPO,
                                    DATINIAPO: item.DATINIAPO,
                                    VALSEGAPO: item.VALSEGAPO,
                                    CAPSEGAPO: item.CAPSEGAPO,
                                    DIALIMAPO: item.DIALIMAPO,
                                    DIACORAPO: item.DIACORAPO,
                                    ANOMAXAPO: item.ANOMAXAPO,
                                    MESMAXAPO: item.MESMAXAPO,
                                    ANOMINAPO: item.ANOMINAPO,
                                    MESMINAPO: item.MESMINAPO,
                                    PERMINAPO: item.PERMINAPO,
                                    TIPPAGAPO: item.TIPPAGAPO,
                                    CODTBE: item.CODTBE,
                                    OBRAPO: item.OBRAPO,
                                    TERAPO: item.TERAPO,
                                    tipoBeneficio: this.listaTipoBeneficio.find(element => element.value == item.CODTBE)
                                }
                            })
                        }
                        console.log("listaApolice", this.listaApolice);
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
                this.apolice = {};
                this.permitirIdadeMinima = {},
                this.apoliceObrigatoria = {};
                this.tipoPagamento = {};
                this.terceirizada = {};
                this.tipoBeneficio = {};
                this.submitted = false;
                this.productDialog = true;
                this.editando = false;
            },
            hideDialog() {
                this.productDialog = false;
                this.submitted = false;
            },
            async save() {
                if (this.saving) return;
                // if (!this.validaCampos()) return

                if (this.apolice.DATINIAPO) {
                    if (this.apolice.DATINIAPO.includes("/")) {
                        this.apolice.DATINIAPO = this.formatDate(this.apolice.DATINIAPO);
                    } else {
                        console.log(this.apolice.DATINIAPO);
                        this.apolice.DATINIAPO = this.formatDatee(this.apolice.DATINIAPO);
                    }
                }

                // if (this.apolice.MESMAXAPO) {
                //     this.apolice.MESMAXAPO = this.formatDate(this.apolice.MESMAXAPO);
                // }

                let data = this.apolice;
                data.CODTBE = this.tipoBeneficio.value;
                data.PERMINAPO = this.permitirIdadeMinima.value;
                data.OBRAPO = this.apoliceObrigatoria.value;
                data.TIPPAGAPO = this.tipoPagamento.value;
                data.TERAPO = this.terceirizada.value;
                if (this.apolice.MESMAXAPO) {
                //   data.MESMAXAPO = this.apolice.MESMAXAPO.getMonth();
                }
                console.log("this.apolice", this.apolice);
                
                this.submitted = true;
                this.saving = true;

                let response;
                if (this.editando) {
                    response = await this.apoliceService.update(this.apolice);
                }
                else {
                    response = await this.apoliceService.store(this.apolice);
                }			

                if (response) {
                    this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
                    this.load();
                }
                else {
                    this.$toast.add({severity:'error', summary: 'Erro', detail: 'Apólice não salvo', life: 3000});
                }

                this.productDialog = false;
                this.saving = false;
            },
            edit(dados) {
                console.log("dados edit =>", dados);
                this.loading2 = true;
                // this.apolice = dados;
                for (const key in dados) {
                    this.apolice[key] = dados[key]
                    if (key == "MESMAXAPO"){
                        this.apolice[key] = new Date(2000, dados[key] - 1, 1)
                    }
                }
                // this.tipoBeneficio = this.listaTipoBeneficio.find(element => element.value == dados.CODTBE);
                this.tipoBeneficio = dados.tipoBeneficio;
                this.permitirIdadeMinima = this.opcoesSimNao.find(element => element.value == dados.PERMINAPO);
                this.tipoPagamento = this.opcoesTipoPagamento.find(element => element.value == dados.TIPPAGAPO);
                // this.tipoPagamento = dados.tipoPagamento;
                this.apoliceObrigatoria = this.opcoesSimNao.find(element => element.value == dados.OBRAPO);
                this.terceirizada = this.opcoesSimNao.find(element => element.value == dados.TERAPO);
                this.apolice.DATINIAPO = this.formatDateEdit(this.apolice.DATINIAPO);
                this.productDialog = true;
                this.editando = true;
            },
            confirmDeleteProduct(apolice) {
                this.apolice = apolice;
                this.deleteDialog = true;
            },
            async deleteFunction() {
                this.deleteDialog = false;
                console.log("this.apolice", this.apolice)			
                await this.apoliceService.delete(this.apolice);

                this.apolice = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Apólice removido com sucesso', life: 3000});

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
            changeMesMaximo() {
                if (this.apolice.MESMAXAPO != 1) {
                    return null;
                }
            }
            // validaCampos() {
            //     if(this.apolice.DESGRAINS == "" || this.apolice.DESGRAINS == undefined || this.apolice.NIVGRAINS == "" || this.apolice.COMGRAINS == ""){
            //         this.submitted = true;
            //         this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios', life: 3000});
            //         return false;
            //     }
            //     else {
            //         this.submitted = false;
            //         return true;
            //     }
            // },
        }


    }
</script>

<style lang="scss" scoped>

</style>