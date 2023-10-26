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

				<DataTable ref="dt" :value="traducoes" :loading="loading" v-model:selection="selectedProducts" dataKey="id" :paginator="true" :rows="10" :filters="filters"
						paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5,10,25]"
						currentPageReportTemplate="Exibindo {first} de {last} de {totalRecords} Tradução" responsiveLayout="scroll">
					<template #header>
						<div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
							<h5 class="m-0">
								<Translate text="Tradução" />
							</h5>
							<span class="block mt-2 md:mt-0 p-input-icon-left">
									<i class="pi pi-search" />
									<InputText v-model="filters['global'].value" placeholder="Procurar..." />
							</span>
						</div>
					</template>

                    <Column field="DESIDI" header="Idioma" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Code</span> -->
							{{data.idioma ? data.idioma.label : ""}}
						</template>
					</Column>
					<Column field="ORITRA" header="Origem" :sortable="true" headerStyle="width:20%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Code</span> -->
							{{data.ORITRA}}
						</template>
					</Column>
					<Column field="DESTRA" header="Destino" :sortable="true" headerStyle="width:50%; min-width:10rem;">
						<template #body="{data}">
							<!-- <span class="p-column-title">Name</span> -->
							{{data.DESTRA}}
						</template>
					</Column>
					<Column headerStyle="min-width:10rem;">
						<template #body="slotProps">
							<Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
							<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(slotProps.data)" />
						</template>
					</Column>

				</DataTable>

				<Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes da Traducão" :modal="true" class="p-fluid">
					<div>						
						<div class="field">
                            <label for="name">Idioma</label>
                            <Dropdown v-model="idioma" :options="listaIdioma" optionLabel="label" placeholder="Selecione">
                            <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                </div>
                                <span v-else>
                                {{slotProps.placeholder}}
                                </span>
                            </template>
                            </Dropdown>
                            <small class="p-invalid" v-if="submitted && !traducao.CODIDI">Preencha o campo.</small>
                        </div>
						<div class="field">
							<label for="name">Origem</label>
							<InputText v-model.trim="traducao.ORITRA" required="true" autofocus :class="{'p-invalid': submitted && !traducao.ORITRA}" maxLength="100"/>
							<small class="p-invalid" v-if="submitted && !traducao.ORITRA">Preencha o campo.</small>
						</div>
                        <div class="field">
							<label for="name">Destino</label>
							<InputText v-model.trim="traducao.DESTRA" required="true" autofocus :class="{'p-invalid': submitted && !traducao.DESTRA}" maxLength="100"/>
							<small class="p-invalid" v-if="submitted && !traducao.DESTRA">Preencha o campo.</small>
						</div>
					</div>		
					<template #footer>
						<Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						<Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					</template>			
				</Dialog>

				<Dialog
                    v-model:visible="deleteDialog"
                    :style="{ width: '450px' }"
                    header="Confirmação de remoção"
                    :modal="true"
                    >
                    <div class="flex align-items-center justify-content-center">
                        <i
                            class="pi pi-exclamation-triangle mr-3"
                            style="font-size: 2rem"
                            />
                            <span
                            >Deseja realmente excluir este registro? <br />
                            Registro: </span>
                    </div>
                    <template #footer>
                        <Button
                            label="Não"
                            icon="pi pi-times"
                            class="p-button-text"
                            @click="deleteDialog = false" />
                        <Button
                            label="Sim"
                            icon="pi pi-check"
                            class="p-button-text"
                            @click="deleteFunction" />
                    </template>
                </Dialog>
			</div>
		</div>
	</div>
</template>

<script>
    import {FilterMatchMode} from 'primevue/api';
    import TraducaoService from '../../../../service/TraducaoService';
    import IdiomaService from '../../../../service/IdiomaService';
    import { mapDropdownSearch } from '../../../../defaults/map';
    export default {
        
        
        data(){
            return{
                translate : null,
                loading : true,
                loading2 : false,
                traducoes : null,
                traducao : {},
                idioma: {},
                descIdioma: {},
                productDialog: false,
                deleteDialog: false,
                deletesDialog: false,
                selectedProducts: null,
                traducaoService: null,
                idiomaService: null,
                listaIdioma: [],
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

        created(){
            this.traducaoService = new TraducaoService();
            this.idiomaService = new IdiomaService();
		    this.initFilters();

            this.idiomaService.all().then((response)=>{
            // // console.log("1", response);
            response.map(
              (entry) => this.listaIdioma.push({ label : entry.DESIDI, value : entry.CODIDI })
            )
          })

        //   if (this.traducao.CODIDI != null) {
        //     // console.log("this.idioma =>", this.idioma);
        //     this.idioma = mapDropdownSearch(this.listaIdioma, this.traducao.CODIDI);
        //     // console.log("this.idioma =>", this.idioma);
        // }

        //   this.traducaoService.all().then((response) => {
        //         this.veiculos = [];
        //         if (response.length) {
        //           // console.log("aaaaaa",response);
        //           response.map(
        //             (entry) => this.traducoes.push(entry)
        //           );
        //           this.traducao = this.traducoes.find(traducao => traducao.value == this.SEQTRA);
        //         }
        //       }
        //     );
        // // console.log("this.traducao.CODIDI", this.traducao.CODIDI);
        // // console.log("this.idioma.CODIDI", this.idioma.CODIDI);

        // if (this.traducao.CODIDI == 1) {
        //     // console.log("this.traducao.CODIDI", this.traducao.CODIDI);
        //     this.descIdioma = { label: "Português", value: "1" }
        //   }
        // else if (this.traducao.CODIDI == 2) {
        //     this.descIdioma = { label: "Inglês", value: "2" }
        //   }
        },

        mounted(){
            this.load();
        },

        methods:{
            load() {
                this.loading = true;
                this.traducaoService.all().then(
                    (data) => {
                        // // console.log("DATA =>", data);
                        // this.traducoes = data
                        this.traducoes = data.map((item)=>{
                            // console.log("ITEM", this.listaIdioma.find(element => element.value == item.CODIDI));
                            return {
                                CODIDI: item.CODIDI,
                                DESTRA: item.DESTRA,
                                ORITRA: item.ORITRA,
                                SEQTRA: item.SEQTRA,
                                idioma: this.listaIdioma.find(element => element.value == item.CODIDI)
                            }
                        })
                        // // console.log("traducoes", this.traducoes);
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
                // console.log("!");
                this.traducao = {};
                this.idioma = {};
                // this.idioma = {
                //     CODIDI: null,
                // };
                // this.traducao = {}
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

                let data = this.traducao;
                data.CODIDI = this.idioma.value;
                // console.log("this.traducao", this.traducao);

                // if (this.traducao.CODIDI) {
                //     this.traducao.CODIDI = this.idioma.label;
                // }
                
                this.submitted = true;
                this.saving = true;

                let response;
                if (this.traducao.CODIDI && this.traducao.SEQTRA) {
                    response = await this.traducaoService.update(this.traducao);
                }
                else {
                    response = await this.traducaoService.store(this.traducao);
                }			

                if (response) {
                    this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Sucesso - Registro Salvo com sucesso', life: 3000});
                    this.load();
                }
                else {
                    this.$toast.add({severity:'error', summary: 'Erro', detail: 'Tradução não salva', life: 3000});
                }

                this.productDialog = false;
                this.saving = false;
            },
            edit(dados) {
                // console.log (dados)
                this.loading2 = true;
                // this.traducaoService.get(traducao.SEQTRA).then(
                //     (data) => {
                //         this.traducao = data
                //         this.loading2 = false;
                //     }
                // );
                // this.traducao = dados[0];
                this.traducao = dados;
                this.idioma = this.listaIdioma.find(element => element.value == this.traducao.CODIDI);
                this.productDialog = true;
            },
            confirmDeleteProduct(traducao) {
                this.traducao = traducao;
                this.deleteDialog = true;
            },
            async deleteFunction() {
                this.deleteDialog = false;			
                await this.traducaoService.delete(this.traducao);

                this.traducao = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Tradução removida com sucesso', life: 3000});

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
                if(this.traducao.ORITRA == "" || this.traducao.ORITRA == undefined || this.traducao.DESTRA == "" || this.traducao.DESTRA == undefined){
                    this.submitted = true;
                    this.$toast.add({severity:'warn', summary: 'Atenção', detail: 'Preencha os campos obrigatórios', life: 3000});
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