<template>
    <div>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
          <Toast/>
              <hr />
                <div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-12">
                        <label for="name">Valor Padrão do Condomínio:</label>
                        <InputNumber v-model="parametro.VALCNDPAR"/>
                    </div>

                    <div class="field col-12">
                        <label for="name">Tipo da Taxa de Condomínio:</label>
                        <Dropdown v-model="gravaLogQuery" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12">
                        <label for="name">Taxa de Condomínio:</label>
                        <Dropdown v-model="gravaLogQuery" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12">
                        <label for="name">Fundo de Reserva:</label>
                        <Dropdown v-model="gravaLogQuery" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-4">
                        <label for="name">Sindico Isento?</label>
                        <Dropdown v-model="sindicoIsento" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-4">
                        <label for="name">Rateia GAS?</label>
                        <Dropdown v-model="rateiaGas" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-12 md:col-4">
                        <label for="name">Rateia Água?</label>
                        <Dropdown v-model="rateiaAgua" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
    import ParametroService from '../../../../service/geral/ParametroService';
    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                condominio: { label: "Selecione", value: "S" },
                sindicoIsento: {},
                rateiaGas: {},
                rateiaAgua: {},
                opcoesSimNao: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                parametro: {
                    CODEMP: null,
                    VALCNDPAR: null,
                    SINISEPAR: null,
                    RATGASPAR: null,
                    RATAGUPAR: null,
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
                data.VALCNDPAR = this.parametro.VALCNDPAR;
                data.SINISEPAR = this.sindicoIsento.value;
                data.RATGASPAR = this.rateiaGas.value;
                data.RATAGUPAR = this.rateiaAgua.value;

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
                        VALCNDPAR: null,
                        SINISEPAR: null,
                        RATGASPAR: null,
                        RATAGUPAR: null,
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