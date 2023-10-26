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
                        <label for="name">Ambiente NF-e:</label>
                        <Dropdown v-model="CODTAM" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-5">
                        <label for="name">Versão:</label>
                        <InputText v-model="parametro.VERNFEPAR"/>
                    </div>

                    <div class="field col-12 md:col-7">
                        <label for="name">Ambiente NFS-e:</label>
                        <Dropdown v-model="CODTAM" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-6">
                        <label for="name">Ambiente CT-e:</label>
                        <Dropdown v-model="CODTAM" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-6">
                        <label for="name">Ambiente MDF-e:</label>
                        <Dropdown v-model="CODTAM" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-5">
                        <label for="name">Versão:</label>
                        <InputText v-model="parametro.VERCTEPAR"/>
                    </div>

                    <div class="field col-12 md:col-7">
                        <label for="name">Certificado:</label>
                        <InputText v-model="parametro.NOMCERPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Senha:</label>
                        <InputText v-model="parametro.SENCERPAR"/>
                    </div>

                    <div class="field col-12">
                        <label for="name">Regime Tributário:</label>
                        <Dropdown v-model="CODTAM" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-12">
                        <label for="name">Natureza Operação NFS-e:</label>
                        <InputText v-model="parametro.NATOPEPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Regime Especial Tributaço NFS-e:</label>
                        <InputText v-model="parametro.REGESPTRIPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Optante pelo Simples Nacional NFS-e:</label>
                        <InputText v-model="parametro.OPTSIMNACPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Incentivador Cultural NFS-e:</label>
                        <InputText v-model="parametro.INCCULPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Diretório NFS-e:</label>
                        <InputText v-model="parametro.DIRPARNFE"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Layout Nota Fiscal:</label>
                        <InputText v-model="parametro.LAYNFSPAR"/>
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
                fiscal: { label: "Selecione", value: "S" },
                parametro: {
                    CODEMP: null,
                    VERNFEPAR: null,
                    VERCTEPAR: null,
                    NOMCERPAR: null,
                    SENCERPAR: null,
                    NATOPEPAR: null,
                    REGESPTRIPAR: null,
                    OPTSIMNACPAR: null,
                    INCCULPAR: null,
                    DIRPARNFE: null,
                    LAYNFSPAR: null,
                },
                parametroService: null,
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

            async save() {
                let data = this.parametro;
                data.CODEMP = this.propParametro[0].CODEMP;
                data.VERNFEPAR = this.parametro.VERNFEPAR;
                data.VERCTEPAR = this.parametro.VERCTEPAR;
                data.NOMCERPAR = this.parametro.NOMCERPAR;
                data.SENCERPAR = this.parametro.SENCERPAR;
                data.NATOPEPAR = this.parametro.NATOPEPAR;
                data.REGESPTRIPAR = this.parametro.REGESPTRIPAR;
                data.OPTSIMNACPAR = this.parametro.OPTSIMNACPAR;
                data.INCCULPAR = this.parametro.INCCULPAR;
                data.DIRPARNFE = this.parametro.DIRPARNFE;
                data.LAYNFSPAR = this.parametro.LAYNFSPAR;

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
                        VERNFEPAR: null,
                        VERCTEPAR: null,
                        NOMCERPAR: null,
                        SENCERPAR: null,
                        NATOPEPAR: null,
                        REGESPTRIPAR: null,
                        OPTSIMNACPAR: null,
                        INCCULPAR: null,
                        DIRPARNFE: null,
                        LAYNFSPAR: null,
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