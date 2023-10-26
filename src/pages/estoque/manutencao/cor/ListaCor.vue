<template>
    <div class="col-12">
        <DataTable :value="listCor" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
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
                <Column field="CODCOR" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODCOR}}
                    </template>
                </Column>
                <Column field="DESCOR" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESCOR}}
                    </template>
                </Column>
                <Column field="DESDOC" header="Extensão" :sortable="true" style="min-width:12rem;">
                    <template #body="{data}">
                        <!-- {{data.IMGCOR}} -->
                        <img v-if="data.SRCIMGCOR != '' && (data.SRCIMGCOR != null || data.SRCIMGCOR != undefined)" :src="data.SRCIMGCOR" alt="" style="height: 2rem; width: 100px;" >
                    </template>
                </Column>
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
                <span v-if="product">Deseja realmente excluir esta Cor <b>{{cor.DESCOR}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
                <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
            </template>
		</Dialog>
  </div>
</template>

<script>
    import CorService from '../../../../service/estoque/CorService';
    export default{

        data(){
            return {
                corService: null,
                loading: false,
                listCor: [],
                deleteDialog: false,
                totalRecords: 0,
            };
        },


        created(){
            this.corService = new CorService();
  
            this.corService.all().then((response) => {
                this.veiculos = [];
                if (response.length) {
                    this.totalRecords = response.length;
                  console.log("aaaaaa",response);
                  response.map(
                    // (entry) => this.listCor.push(entry)
                    (entry) => {
                        if(entry.IMGCOR != null){
                                        let base64String = entry.IMGCOR;
                                        // Decodifica a string base64 em um array de bytes
                                        let byteCharacters = window.atob(base64String.split(',')[1]);
                                        let byteNumbers = new Array(byteCharacters.length);
                                        for (let i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                        }
                                        let byteArray = new Uint8Array(byteNumbers);
    
                                        // Cria um objeto Blob a partir do array de bytes
                                        let blob = new Blob([byteArray], { type: "image/png" });
    
                                        // Cria um URL de objeto a partir do objeto Blob
                                        let objectURL = URL.createObjectURL(blob);
                                        this.listCor.push({CODCOR: entry.CODCOR, DESCOR: entry.DESCOR, IMGCOR: entry.IMGCOR, SRCIMGCOR: objectURL })
                                    }else{
                                        this.listCor.push({CODCOR: entry.CODCOR, DESCOR: entry.DESCOR, IMGCOR: entry.IMGCOR, SRCIMGCOR: "" })
                                    }
                    }
                  );
                  this.cor = this.listCor.find(cor => cor.value == this.CODCOR);
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

            edit(cor) {
                this.$parent.edit(cor)
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.corService.delete(this.cor.CODCOR);

                this.cor = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Cor removida com sucesso', life: 3000});

                this.busca("");
            },

            confirmDeleteProduct(cor) {
                this.cor = cor;
                this.deleteDialog = true;
            },

            busca(DESCOR){
                console.log("1", DESCOR);
                this.loading = true;
                if(DESCOR){
                    console.log("2");
                    this.corService.search(DESCOR ? DESCOR: "").then((response) => {
                        this.listCor = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            console.log("aaaaaa",response);
                            response.map(
                                (entry) => this.listCor.push(entry)
                            );
                            let str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYAQMAAACguBAzAAAAA1BMVEX/oLqcUe9MAAAAUUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8G+y4AAFJyw/RAAAAAElFTkSuQmCC";
                            let formatado = fetch(str).then(function(res){return res.arrayBuffer();})
                            .then(function(buf){return new File([buf], "img.png",{type:'image/png'});})
                            console.log("formatadoformatadoformatadoformatado",formatado);
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.corService.all().then((response) => {
                        this.listCor = [];
                        if (response.length) {
                                this.totalRecords = response.length;
                            response.map(
                                (entry) => {
                                    if(entry.IMGCOR != null){
                                        let base64String = entry.IMGCOR;
                                        // Decodifica a string base64 em um array de bytes
                                        let byteCharacters = window.atob(base64String.split(',')[1]);
                                        let byteNumbers = new Array(byteCharacters.length);
                                        for (let i = 0; i < byteCharacters.length; i++) {
                                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                                        }
                                        let byteArray = new Uint8Array(byteNumbers);
    
                                        // Cria um objeto Blob a partir do array de bytes
                                        let blob = new Blob([byteArray], { type: "image/png" });
    
                                        // Cria um URL de objeto a partir do objeto Blob
                                        let objectURL = URL.createObjectURL(blob);
                                        this.listCor.push({CODCOR: entry.CODCOR, DESCOR: entry.DESCOR, IMGCOR: entry.IMGCOR, SRCIMGCOR: objectURL })
                                    }else{
                                        this.listCor.push({CODCOR: entry.CODCOR, DESCOR: entry.DESCOR, IMGCOR: entry.IMGCOR, SRCIMGCOR: "" })
                                    }

                                    console.log("val", this.urltoFile(entry.IMGCOR, 'img.png','image/png'));
                                }
                            );
                            let str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAJYAQMAAACguBAzAAAAA1BMVEX/oLqcUe9MAAAAUUlEQVR42u3BAQ0AAADCoPdPbQ8HFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8G+y4AAFJyw/RAAAAAElFTkSuQmCC";
                            this.urltoFile(str, 'img.png','image/png').then(function(file){ 
                                console.log(file);
                                let content = URL.createObjectURL(file);
                                console.log("content",content);
                            });
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }

            },

            urltoFile(url, filename, mimeType){
                return (fetch(url)
                    .then(function(res){return res.arrayBuffer();})
                    .then(function(buf){return new File([buf], filename,{type:mimeType});})
                );
            }
        
        }
    }
</script>