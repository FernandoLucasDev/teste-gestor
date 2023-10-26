<template>
    <div class="col-12">
        <DataTable :value="listDocumentoCampo" 
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
                    Carregando registros. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="NUMDCA" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.NUMDCA}}
                    </template>
                </Column>
                <Column field="NOMDCA" header="Nome" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.NOMDCA}}
                    </template>
                </Column>
                <Column field="CAMDOCDCA" header="Campo do Documento" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CAMDOCDCA}}
                    </template>
                </Column>
                <Column field="CAMSISDCA" header="Campo do Sistema" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CAMSISDCA}}
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
    import DocumentoCampoService from '../../../../service/mudanca/DocumentoCampoService';
    export default{

        data(){
            return {
                documentoCampoService: null,
                loading: false,
                listDocumentoCampo: [],
            };
        },


        created(){
            this.documentoCampoService = new DocumentoCampoService();
  
            // this.documentoCampoService.all().then((response) => {
            //     this.veiculos = [];
            //     if (response.length) {
            //       console.log("aaaaaa",response);
            //       response.map(
            //         (entry) => this.listDocumentoCampo.push(entry)
            //       );
            //       this.documento = this.listDocumentoCampo.find(documento => documento.value == this.CODDOC);
            //     }
            //   }
            // );
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

            busca(CODDOC){
                console.log("CODDOC BUSCA", CODDOC);
                this.loading = true;
                if(CODDOC){
                    console.log("2");
                    this.documentoCampoService.search(CODDOC).then((response) => {
                        this.listDocumentoCampo = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            console.log("aaaaaa",response);
                            response.map(
                                (entry) => this.listDocumentoCampo.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.documentoCampoService.all().then((response) => {
                        this.listDocumentoCampo = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            response.map(
                                (entry) => this.listDocumentoCampo.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }

            }
        
        }
    }
</script>