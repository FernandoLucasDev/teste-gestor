<template>
    <div class="col-12">
        <DataTable :value="listDocumentos" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            responsiveLayout="scroll" 
            dataKey="CODENT"
            >      
                <template #empty v-if="!loading">
                    Nenhum registro encontrado.
                </template>
                <template #loading>
                    <!-- Carregando mudanças. Por favor, aguarde... -->
                    <ProgressSpinner style="height: 50px;" />
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODDOC" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODDOC}}
                    </template>
                </Column>
                <Column field="NOMDOC" header="Nome" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.NOMDOC}}
                    </template>
                </Column>
                <Column field="DESDOC" header="Extensão" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESDOC}}
                    </template>
                </Column>
                <Column headerStyle="min-width:10rem; width:10rem;">
                <template #body="props">
                    <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data)" />
                </template>
                </Column>
            
        </DataTable>
  </div>
</template>

<script>
    import DocumentoService from '../../../../service/mudanca/DocumentoService';
    export default{

        data(){
            return {
                documentoService: null,
                listDocumentos: [],
                loading: false,
                totalRecords: null
            };
        },


        created(){
            this.documentoService = new DocumentoService();
            // this.listDocumentos = this.listaDocumentos;
            // this.loading = this.load
            this.busca();
        },

        methods: {
            formatDate(value) {
                return value.substr(8, 2) + "/" + 
                value.substr(5, 2) + "/" + 
                value.substr(0, 4)
            },

            edit(documento) {
                this.$parent.edit(documento)
            },

            onPage(options){
                this.busca(options);
            },

            busca(options){
                // if(!options){
                //     options = {};
                // }
                
                this.loading = true;
                // if(NOMDOC){
                //     this.documentoService.search(NOMDOC ? NOMDOC: "").then((response) => {
                //         this.listDocumentos = [];
                //         if (response.data.length) {
                //             console.log("aaaaaa",response);
                //             this.totalRecords = response.totalRecords;
                //             response.data.map(
                //                 (entry) => this.listDocumentos.push(entry)
                //             );
                //         }
                //     }
                //     ).finally(()=>{
                //         this.loading = false;
                //     })
                // }else{
                    this.documentoService.all().then((response) => {
                            this.listDocumentos = [];

                            console.log("response do lista ",response);
                            // window.open(response, "_blank")
                            // var win = window.open();
                            // win.document.write('<iframe src="' + response  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; margin: 0px;" allowfullscreen></iframe>');

                        this.totalRecords = response.length;
                        if (response.length) {
                            response.map(
                                (entry) => this.listDocumentos.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }

            // }
        
        }
    }
</script>