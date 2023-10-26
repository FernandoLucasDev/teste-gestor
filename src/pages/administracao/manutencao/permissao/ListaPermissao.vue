<template>
    <div class="col-12">
        <DataTable 
            :value="listTarefa" 
            :lazy="true" 
            :paginator="true" 
            :rows="totalRecords"
            :loading="load"
            :totalRecords="totalRecords"
            @page="onPage($event)"
            @sort="onSort($event)"
            responsiveLayout="scroll"
            dataKey="CODCON"
            >      
                <template #empty v-if="!load">
                    Nenhuma mudança encontrada
                </template>
                <template #loading>
                    Carregando mudanças. Por favor, aguarde...
                </template>
                <template #footer v-if="!load">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODTAR" header="Código tarefa" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODTAR}}
                    </template>
                </Column>
                <Column field="CODSIS" header="Código sistema" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODSIS}}
                    </template>
                </Column>
                <Column field="DESTAR" header="Descrição" :sortable="false" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESTAR}}
                    </template>
                </Column>
                <Column header="Permissão" headerStyle="min-width:10rem; width:10rem;">
                    <template #body="{data}">
                        <!-- <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data)" /> -->
                        <Checkbox v-model="data.temPermissao" :disabled="!habilita" :binary="true" @click="editaPermissao(data)" />
                    </template>
                </Column>
            
        </DataTable>
  </div>
</template>

<script>
    import PermissaoService from "../../../../service/PermissaoService"
    export default{
        props: ["listTarefa", "totalRecords", "habilita"],
        expose: ["load", "listTarefa", "totalRecords"],

        data(){
            return {
                usuarioService: null,
                load: false,
                permissaoService: null
            };
        },


        created(){
            this.permissaoService = new PermissaoService()
        },

        methods: {
            formatDate(value) {
                return value.substr(8, 2) + "/" + 
                value.substr(5, 2) + "/" + 
                value.substr(0, 4)
            },

            editaPermissao(evento) {
                console.log('evento :>> ', evento);
                this.$parent.editaPermissao(evento);
            },

            
            onPage(event){
                this.$parent.buscaPermissao(event);
            },
        }
    }
</script>