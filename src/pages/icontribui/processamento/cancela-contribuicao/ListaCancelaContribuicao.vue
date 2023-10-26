<template>
    <div class="col-12">
        <DataTable :value="listCancelaContribuicao" 
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
                    Nenhuma mudança encontrada
                </template>
                <template #loading>
                    Carregando mudanças. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODENT" header="Entidade" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODENT}}
                    </template>
                </Column>
                <Column field="ANOCNT" header="Ano" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.ANOCNT}}
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
    import ContribuicaoService from '../../../../service/icontribui/ContribuicaoService';
    export default {
        props: ["listCancelaContribuicao"],
        data(){
          return {
            contribuicaoService: null,
            cancelaContribuicao: {},
          }; 
        },

        // created(){
        //     this.contribuicaoService = new ContribuicaoService();

        //     this.contribuicaoService.all().then((response) => {
        //         this.veiculos = [];
        //         if (response.length) {
        //           console.log("aaaaaa",response);
        //           response.map(
        //             (entry) => this.listCancelaContribuicao.push(entry)
        //           );
        //           this.cancelaContribuicao = this.listCancelaContribuicao.find(cancelaContribuicao => cancelaContribuicao.value == this.CODENT);
        //         }
        //       }
        //     );
        // },
    }
</script>

<style lang="scss" scoped>

</style>