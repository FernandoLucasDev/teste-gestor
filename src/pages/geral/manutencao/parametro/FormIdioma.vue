<template>
    <div>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
          <Toast/>
              <hr />
                <div>
                <div class="formgrid grid">
    
                    <div class="field col-12">
                        <label for="name">Idioma:</label>
                        <Dropdown v-model="idioma" :options="listaIdioma" optionLabel="label" placeholder="Selecione">
                        <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                            <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                            </div>
                            <span v-else>
                            {{slotProps.placeholder}}
                            </span>
                        </template>
                        </Dropdown>
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
    import IdiomaService from '../../../../service/IdiomaService';
    import ParametroService from '../../../../service/geral/ParametroService';
    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                idiomaSelected: { label: "Selecione", value: "S" },
                idioma: {},
                listaIdioma: [],
                parametro: {
                    CODEMP: null,
                    CODIDI: null,
                },
                idiomaService: null,
                parametroService: null,
            }
        },

        created() {
            this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
            this.parametroService = new ParametroService();
            this.idiomaService = new IdiomaService();

            this.idiomaService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaIdioma.push({ label : entry.DESIDI, value : entry.CODIDI })
            )
          })
        },

        methods: {
            preencheDados(dados) {
                this.parametro = dados[0];
            },

            async save (){
                let data = this.parametro;
                data.CODEMP = this.propParametro[0].CODEMP;
                data.CODIDI = this.idioma.value;

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
                        CODIDI: null,
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