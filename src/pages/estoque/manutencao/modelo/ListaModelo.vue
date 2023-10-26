<template>
    <div class="col-12">
        <DataTable :value="listModelos" 
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
                <Column field="CODMOD" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODMOD}}
                    </template>
                </Column>
                <Column field="DESMOD" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESMOD}}
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
                <span v-if="product">Deseja realmente excluir este Modelo <b>{{modelo.DESMOD}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
                <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
            </template>
		</Dialog>
  </div>
</template>

<script>
    import ModeloService from '../../../../service/estoque/ModeloService';
    export default{

        data(){
            return {
                modeloService: null,
                loading: false,
                listModelos: [],
                deleteDialog: false,
            };
        },


        created(){
            this.modeloService = new ModeloService();
  
            this.modeloService.all().then((response) => {
                this.veiculos = [];
                if (response.length) {
                  console.log("aaaaaa",response);
                  response.map(
                    (entry) => this.listModelos.push(entry)
                  );
                  this.modelo = this.listModelos.find(modelo => modelo.value == this.CODMOD);
                }
              }
            );
        },

        methods: {
            formatDate(value) {
                return value.substr(8, 2) + "/" + 
                value.substr(5, 2) + "/" + 
                value.substr(0, 4)
            },

            edit(modelo) {
                this.$parent.edit(modelo)
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.modeloService.delete(this.modelo.CODMOD);

                this.modelo = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Modelo removido com sucesso', life: 3000});

                this.busca("");
            },

            confirmDeleteProduct(modelo) {
                this.modelo = modelo;
                this.deleteDialog = true;
            },

            busca(DESMOD){
                console.log("1", DESMOD);
                this.loading = true;
                if(DESMOD){
                    console.log("2");
                    this.modeloService.search(DESMOD ? DESMOD: "").then((response) => {
                            this.listModelos = [];
                            if (response.length) {
                            console.log("aaaaaa",response);
                            response.map(
                                (entry) => this.listModelos.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.modeloService.all().then((response) => {
                            this.listModelos = [];
                            if (response.length) {
                            response.map(
                                (entry) => this.listModelos.push(entry)
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