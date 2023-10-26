<template>
    <div class="p-fluid">
        <div class="grid">
            <div class="col-12">
                <Toast/>
                <hr />
                <div class="formgrid grid">
                    <div class="field col-6 md:col-4">
                        <label for="name">Início:</label>
                        <InputMask id="hora" mask="99:99:99" v-model="parametro.INIOCOPAR" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                    </div>
                    <div class="field col-6 md:col-4">
                        <label for="name">Fim:</label>
                        <InputMask id="hora" mask="99:99:99" v-model="parametro.FINOCOPAR" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                    </div>
                    <div class="field col-12 md:col-4">
                        <label for="name">Tempo:</label>
                        <InputMask id="hora" mask="99:99:99" v-model="parametro.TEMOCOPAR" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="name">Tipo:</label>
                        <Dropdown v-model="tipo" :options="listaTipo" optionLabel="label" placeholder="Selecione">
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
                    <div class="field col-6 md:col-3">
                        <label for="name">Mostra Abertas:</label>
                        <Dropdown v-model="mostraAbertas" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                    <div class="field col-6 md:col-3">
                        <label for="name">Mostra Semana:</label>
                        <Dropdown v-model="mostraSemana" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                    <div class="field col-6 md:col-4">
                        <label for="name">Mostra Dia:</label>
                        <Dropdown v-model="mostraDia" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                    <div class="field col-6 md:col-4">
                        <label for="name">Mostra Hora:</label>
                        <Dropdown v-model="mostraHora" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Mostra Equipamento:</label>
                        <Dropdown v-model="mostraEquipamento" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Início Fim de Semana:</label>
                        <InputMask id="hora" mask="99:99:99" v-model="parametro.INIFDSPAR" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                    </div>
                    <div class="field col-12 md:col-6">
                        <label for="name">Final Fim de Semana:</label>
                        <InputMask id="hora" mask="99:99:99" v-model="parametro.FINFDSPAR" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
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
</template>

<script>
    import ParametroService from '../../../../service/geral/ParametroService';
    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                crm: { label: "Selecione", value: "S" },
                horaInicial: null,
                opcoesSimNao: [
                    { label: "Sim", value: "S" },
                    { label: "Não", value: "N" },
                ],
                listaTipo: [
                    { label: "Dia", value: "D" },
                    { label: "Semana", value: "S" },
                ],
                mostraAbertas: {},
                mostraSemana: {},
                mostraDia: {},
                mostraHora: {},
                mostraEquipamento: {},
                tipo: {},
                parametro: {
                  CODEMP: null,
                  INIOCOPAR: null,
                  FINOCOPAR: null,
                  TEMOCOPAR: null,
                  TIPOCOPAR: null,
                  MOSABEPAR: null,
                  MOSSEMPAR: null,
                  MOSDIAPAR: null,
                  MOSHORPAR: null,
                  MOSEQUPAR: null,
                  INIFDSPAR: null,
                  FINFDSPAR: null,
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
                data.INIOCOPAR = this.parametro.INIOCOPAR;
                data.FINOCOPAR = this.parametro.FINOCOPAR;
                data.TEMOCOPAR = this.parametro.TEMOCOPAR;
                data.TIPOCOPAR = this.tipo.value;
                data.MOSABEPAR = this.mostraAbertas.value;
                data.MOSSEMPAR = this.mostraSemana.value;
                data.MOSDIAPAR = this.mostraDia.value;
                data.MOSHORPAR = this.mostraHora.value;
                data.MOSEQUPAR = this.mostraEquipamento.value;
                data.INIFDSPAR = this.parametro.INIFDSPAR;
                data.FINFDSPAR = this.parametro.FINFDSPAR;
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
                        INIOCOPAR: null,
                        FINOCOPAR: null,
                        TEMOCOPAR: null,
                        TIPOCOPAR: null,
                        MOSABEPAR: null,
                        MOSSEMPAR: null,
                        MOSDIAPAR: null,
                        MOSHORPAR: null,
                        MOSEQUPAR: null,
                        INIFDSPAR: null,
                        FINFDSPAR: null,
                    }
                }
                else {
                    this.$toast.add({severity:'error', summary: 'Erro', detail: 'Campo de documento não salvo', life: 3000});
                }

                this.productDialog = false;
                this.saving = false;
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>