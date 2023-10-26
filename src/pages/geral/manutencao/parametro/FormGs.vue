<template>
    <div>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
          <Toast/>
              <hr />
                <div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-4">
                        <label for="name">Comissão Padrão:</label>
                        <InputText v-model="parametro.PADCOMVENPAR"/>
                    </div>

                    <div class="field col-12 md:col-4">
                        <label for="name">Comissão Máxima:</label>
                        <InputText v-model="parametro.MAXCOMVENPAR"/>
                    </div>

                    <div class="field col-12 md:col-4">
                        <label for="name">Condição Mínima:</label>
                        <InputText v-model="parametro.MINCOMVENPAR"/>
                    </div>

                    <div v-if="!editando" class="field col-6 md:col-2">
                        <Button label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
                    </div>

                    <div v-if="editando" class="field col-6 md:col-2">
                        <Button label="Alterar" icon="pi pi-pencil" class="p-button-warning" style="margin-top: 15%;" @click="save" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> 
    </div>
</template>

<script>
    import ParametroService from '../../../../service/geral/ParametroService';
    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                gs: { label: "Selecione", value: "S" },
                parametro: {
                    CODEMP: null,
                    PADCOMVENPAR: null,
                    MAXCOMVENPAR: null,
                    MINCOMVENPAR: null,
                },
                parametroService:null,
            }
        },

        created() {
            this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
            this.parametroService = new ParametroService();
        },

        methods: {
            preencheDados(dados) {
                this.parametro = dados[0];
            },

            async save(){
                let data = this.parametro;
                data.CODEMP = this.propParametro[0].CODEMP;
                data.PADCOMVENPAR = this.parametro.PADCOMVENPAR;
                data.MAXCOMVENPAR = this.parametro.MAXCOMVENPAR;
                data.MINCOMVENPAR = this.parametro.MINCOMVENPAR;

                console.log("Salvando");
                console.log("this.codigo :>>", data);
                if (this.saving) return;
                this.submitted = true;
                this.saving = true;

                let response;
                if(this.editando){
                    response = await this.parametroService.update(data);
                }else{
                    response = await this.parametroService.store(data);
                }

                if (response[0]) {
                    this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Campo de documento salvo com sucesso', life: 3000});
                    this.parametro = {
                        CODEMP: null,
                        PADCOMVENPAR: null,
                        MAXCOMVENPAR: null,
                        MINCOMVENPAR: null,
                    }
                }
                else {
                    this.$toast.add({severity:'error', summary: 'Erro', detail: 'Campo de documento não salvo', life: 3000});
                }

                this.productDialog = false;
                this.saving = false;
            },
        },
    }
</script>

<style lang="scss" scoped>

</style>