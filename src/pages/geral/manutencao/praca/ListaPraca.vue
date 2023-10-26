<template>
    <div class="col-12">
        <DataTable :value="listPraca" 
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
                    Nenhuma mudança encontrada
                </template>
                <template #loading>
                    Carregando mudanças. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODPRA" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODPRA}}
                    </template>
                </Column>
                <Column field="DESPRA" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESPRA}}
                    </template>
                </Column>
                <Column field="SIGEST" header="Sigla do Estado" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.SIGEST}}
                    </template>
                </Column>
                <Column field="RAIPRA" header="Raio da Praça" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.RAIPRA}}
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
                <span v-if="product">Deseja realmente excluir esta Praça <b>{{praca.DESPRA}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
                <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
            </template>
		</Dialog>
  </div>
</template>

<script>
  import PracaService from '../../../../service/geral/PracaService';
  export default{

        data(){
            return {
                pracaService: null,
                loading: false,
                listPraca: [],
                deleteDialog: false,
                totalRecords: null,
            };
        },


        created(){
            this.pracaService = new PracaService();
  
            this.pracaService.all().then((response) => {
                this.veiculos = [];
                if (response.length) {
                    this.totalRecords = response.length;
                  // console.log("123",response);
                  response.map(
                    (entry) => this.listPraca.push({
                        CODPRA: entry.CODPRA,
                        DESPRA: entry.DESPRA, 
                        SIGEST: entry.SIGEST,
                        RAIPRA: entry.RAIPRA,
                        REPCORPRA: entry.REPCORPRA,
                        QTDREPCORPRA: entry.QTDREPCORPRA,
                        REPCORDIFPRA: entry.REPCORDIFPRA,
                        QTDREPCORDIFPRA: entry.QTDREPCORDIFPRA,
                    })
                  );
                  this.praca = this.listPraca.find(praca => praca.value == this.CODPARENT);
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

            edit(praca) {
                this.$parent.edit(praca)
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.pracaService.delete(this.praca.CODPRA);

                this.praca = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Praça removida com sucesso', life: 3000});

                this.busca("");
            },

            confirmDeleteProduct(praca) {
                this.praca = praca;
                this.deleteDialog = true;
            },

            busca(DESPRA){
                // console.log("1", DESPRA);
                this.loading = true;
                if(DESPRA){
                    // console.log("2");
                    this.pracaService.search(DESPRA ? DESPRA: "").then((response) => {
                        this.listPraca = [];
                        if (response.length) {
                            this.totalRecords = response.length;
                            // console.log("aaaaaa",response);
                            response.map(
                                (entry) => this.listPraca.push(entry)
                            );
                        }
                    }
                    ).finally(()=>{
                        this.loading = false;
                    })
                }else{
                    this.pracaService.all().then((response) => {
                        this.listPraca = [];
                        if (response.length) {
                                this.totalRecords = response.length;
                            response.map(
                                (entry) => this.listPraca.push(entry)
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