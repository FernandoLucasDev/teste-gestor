<template>
    <div class="col-12">
        <DataTable :value="listGrupoUsuario" 
            :paginator="true" 
            :rows="10"
            :loading="loading"
            :totalRecords="totalRecords"
            responsiveLayout="scroll" 
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
                <Column field="CODGRPUSU" header="Código" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODGRPUSU}}
                    </template>
                </Column>
                <Column field="DESGRPUSU" header="Descrição" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESGRPUSU}}
                    </template>
                </Column>
                <Column field="ADMGRPUSU" header="Administrador" style="min-width:12rem">
                    <template #body="slotProps">
                        {{(slotProps.data.ADMGRPUSU == "S" || slotProps.data.ADMGRPUSU == "s" ? "Sim" : "Não")}}
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
                <span v-if="product">Deseja realmente excluir este Grupo de Usuário <b>{{grupoUsuario.DESGRPUSU}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
                <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
            </template>
		</Dialog>
  </div>
</template>

<script>
    import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
    export default{

        props:["listaGrupoUsuario"],

        data(){
            return {
                grupoUsuarioService: null,
                loading: false,
                listGrupoUsuario: [],
                deleteDialog: false,
            };
        },


        created(){
            this.grupoUsuarioService = new GrupoUsuarioService();
            
            (new GrupoUsuarioService()).all()
                .then(response => {
                    this.listGrupoUsuario = response;
                    this.totalRecords = response.length;
                    
                    console.log("123", this.listGrupoUsuario)
                })
        },

        methods: {
            formatDate(value) {
                return value.substr(8, 2) + "/" + 
                value.substr(5, 2) + "/" + 
                value.substr(0, 4)
            },

            edit(grupoUsuario) {
                this.$parent.edit(grupoUsuario)
            },

            async deleteFunction() {
                this.deleteDialog = false;		
                this.grupoUsuarioService.delete(this.grupoUsuario.CODGRPUSU);

                this.grupoUsuario = {};

                this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Grupo de Usuário removido com sucesso', life: 3000});

                this.busca("");
            },

            confirmDeleteProduct(grupoUsuario) {
                this.grupoUsuario = grupoUsuario;
                this.deleteDialog = true;
            },

            busca(DESGRPUSU){
                console.log("1", DESGRPUSU);
                this.loading = true;
                this.grupoUsuarioService.search(DESGRPUSU ? DESGRPUSU: "").then((response) => {
                        this.listGrupoUsuario = [];
                        if (response.length) {
                        console.log("123",response);
                        response.map(
                            (entry) => this.listGrupoUsuario.push(entry)
                        );
                    }
                }
                ).finally(()=>{
                    this.loading = false;
                })
                

            },
        
        }
    }
</script>