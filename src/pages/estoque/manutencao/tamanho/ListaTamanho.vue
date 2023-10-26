<template>
    <div class="col-12">
        <DataTable :value="listTamanhos" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
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
                <Column field="CODTAM" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODTAM}}
                    </template>
                </Column>
                <Column field="DESTAM" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESTAM}}
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
						<span v-if="product">Deseja realmente excluir este Tamanho <b>{{tamanho.DESTAM}}</b>?</span>
					</div>
					<template #footer>
						<Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
						<Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
					</template>
		</Dialog>
  </div>
</template>

<script>
    import TamanhoService from '../../../../service/estoque/TamanhoService';
    export default{

        data(){
            return {
                tamanhoService: null,
                loading: false,
                listTamanhos: [],
                deleteDialog: false,
                totalRecords: 0
            };
        },


        created(){
            this.tamanhoService = new TamanhoService();
  
            this.tamanhoService.all().then((response) => {
                this.veiculos = [];
                if (response.length) {
                    this.totalRecords = response.length;
                    // console.log("aaaaaa",response);
                    response.map(
                    (entry) => this.listTamanhos.push(entry)
                    );
                    this.tamanho = this.listTamanhos.find(tamanho => tamanho.value == this.CODTAM);
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

            edit(tamanho) {
                this.$parent.edit(tamanho)
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.tamanhoService.delete(this.tamanho.CODTAM).then(()=>{
                    this.tamanho = {};
    
                    this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Tamanho removido com sucesso', life: 3000});
    
                    this.busca("");
                });

            },

            confirmDeleteProduct(tamanho) {
                this.tamanho = tamanho;
                this.deleteDialog = true;
            },

            onPage(){

            },

            busca(DESTAM){
                console.log("1", DESTAM);
                this.loading = true;
                if(DESTAM){
                    console.log("2");
                    this.tamanhoService.search(DESTAM ? DESTAM: "").then((response) => {
                        this.listTamanhos = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            console.log("aaaaaa",response);
                            response.map(
                                (entry) => this.listTamanhos.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.tamanhoService.all().then((response) => {
                        this.listTamanhos = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            response.map(
                                (entry) => this.listTamanhos.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }

            },
        
        }
    }
</script>