<template>
    <div class="col-12">
        <DataTable 
            :value="listParcelamentoEntrega" 
            :lazy="true" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            @sort="onSort($event)"
            responsiveLayout="scroll" 
            dataKey="CODENT"
            >      
                <template #empty v-if="!loading">
                    Nenhum registro encontrado
                </template>
                <template #loading>
                    Carregando. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODPARENT" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODPARENT}}
                    </template>
                </Column>
                <Column field="QTDPARENT" header="Quantidade" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.QTDPARENT}}
                    </template>
                </Column>
                <Column field="DESPARENT" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESPARENT}}
                    </template>
                </Column>
                <Column field="TIPPARENT" header="Tipo de Parcelamento" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.tipoParcelamento}}
                    </template>
                </Column>
                <!-- <Column field="DESDOC" header="Extensão" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESDOC}}
                    </template>
                </Column> -->
                <Column headerStyle="min-width:10rem; width:10rem;">
                <template #body="props">
                    <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(props.data)" />
                </template>
                </Column>
            
        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="product">Deseja realmente excluir este Parcelamento <b>{{parcelamentoEntrega.DESPARENT}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
                <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
            </template>
		</Dialog>
  </div>
</template>

<script>
    import ParcelamentoEntregaService from '../../../../service/financeiro/ParcelamentoEntregaService';
    export default{

        data(){
            return {
                parcelamentoEntregaService: null,
                loading: false,
                listParcelamentoEntrega: [],
                tipoParcelamento: {},
                deleteDialog: false,
                parcelamentoEntrega: {
                    CODPARENT: null,
                },
                totalRecords: null,
            };
        },


        created(){
            this.parcelamentoEntregaService = new ParcelamentoEntregaService();

            // let data = this.parcelamentoEntrega;
            // data.CODPARENT = this.parcelamentoEntrega.value;

            // (new ParcelamentoEntregaService()).search(this.parcelamentoEntrega.CODPARENT)
            //     .then(response => {
            //         this.listParcelamentoEntrega = response;
            //         this.totalRecords = response.length;
                    
            //         console.log("123", this.listParcelamentoEntrega)
            //     })
  
            this.parcelamentoEntregaService.all().then((response) => {
                this.veiculos = [];
                if (response.length) {
                  console.log("aaaaaa",response);
                  this.totalRecords = response.length;
                  response.map(
                    (entry) => this.listParcelamentoEntrega.push({
                        CODPARENT: entry.CODPARENT,
                        DESPARENT: entry.DESPARENT, 
                        QTDPARENT: entry.QTDPARENT, 
                        TIPPARENT: entry.TIPPARENT, 
                        tipoParcelamento: entry.TIPPARENT == 'M' ? 'Mês' : 'Dia',
                    })
                  );
                  this.parcelamentoEntrega = this.listParcelamentoEntrega.find(parcelamentoEntrega => parcelamentoEntrega.value == this.CODPARENT);
                }
              }
            );

        //     this.parcelamentoEntregaService.all().then((response)=>{
        //     console.log("1", response);
        //     response.map(
        //       (entry) => this.tipoParcelamento.push({ label : entry.TIPPARENT, value : entry.CODPARENT })
        //     )
        //   })

        //   this.tipoParcelamento = TIPPARENT == 'M' ? 'Mês' : 'Dia'
        },

        methods: {
            formatDate(value) {
                return value.substr(8, 2) + "/" + 
                value.substr(5, 2) + "/" + 
                value.substr(0, 4)
            },

            edit(parcelamentoEntrega) {
                this.$parent.edit(parcelamentoEntrega)
                // this.busca("");
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.parcelamentoEntregaService.delete(this.parcelamentoEntrega.CODPARENT);

                this.parcelamentoEntrega = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Parcelamento removido com sucesso', life: 3000});

                this.busca("");
                // window.location.reload();
            },

            confirmDeleteProduct(parcelamentoEntrega) {
                this.parcelamentoEntrega = parcelamentoEntrega;
                this.deleteDialog = true;
            },

            busca(DESPARENT){
                console.log("1", DESPARENT);
                this.loading = true;
                if(DESPARENT){
                    console.log("2");
                    this.parcelamentoEntregaService.search(DESPARENT ? DESPARENT: "").then((response) => {
                            this.listParcelamentoEntrega = [];
                            if (response.length) {
                            console.log("aaaaaa",response);
                            this.totalRecords = response.length;
                            response.map(
                                (entry) => this.listParcelamentoEntrega.push({
                                    CODPARENT: entry.CODPARENT,
                                    DESPARENT: entry.DESPARENT, 
                                    QTDPARENT: entry.QTDPARENT, 
                                    TIPPARENT: entry.TIPPARENT, 
                                    tipoParcelamento: entry.TIPPARENT == 'M' ? 'Mês' : 'Dia',
                                })
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.parcelamentoEntregaService.all().then((response) => {
                            this.listParcelamentoEntrega = [];
                            this.totalRecords = response.length;
                            if (response.length) {
                            response.map(
                                (entry) => this.listParcelamentoEntrega.push({
                                    CODPARENT: entry.CODPARENT,
                                    DESPARENT: entry.DESPARENT, 
                                    QTDPARENT: entry.QTDPARENT, 
                                    TIPPARENT: entry.TIPPARENT, 
                                    tipoParcelamento: entry.TIPPARENT == 'M' ? 'Mês' : 'Dia',
                                })
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }

            },

            onPage(event){
                console.log("Aquii");
                // this.busca(event);
                this.busca(event);
            },
        
        }
    }
</script>