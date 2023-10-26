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
                    <label for="name">Cargo dos Homologadores:</label>
                    <Dropdown v-model="cargo" :options="listaCargo" optionLabel="label" placeholder="Selecione">
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
                    <label for="name">Grupo dos Advogados:</label>
                    <Dropdown v-model="grupoUsuario" :options="listaGrupoUsuario" optionLabel="label" placeholder="Selecione">
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
  
                <div class="field col-6">
                      <label for="name">Qtd. dias atendimento on-line:</label>
                      <InputNumber v-model="parametro.QTDDIAAGEPAR"/>
                </div>

                <div class="field col-6">
                      <label for="name">Qtd. atendimentos por dia (on-line):</label>
                      <InputNumber v-model="parametro.QTDAGEDIAPAR"/>
                </div>

                <div class="field col-12 md:col-4">
                    <label for="name">Benefícios obrigatório em cascata?</label>
                    <Dropdown v-model="beneficiosObrigatorios" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                    <label for="name">Matrícula Única para segurado?</label>
                    <Dropdown v-model="matriculaUnicaSegurado" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                    <label for="name">Matrícula Única para associação?</label>
                    <Dropdown v-model="matriculaUnicaAssociacao" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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

                <div class="field col-6">
                      <label for="name">Qtd.mínima de caracteres em obs.da cobrança?</label>
                      <InputNumber v-model="parametro.MINCARCOBPAR"/>
                </div>

                <div class="field col-6">
                      <label for="name">Tempo, em anos, para verificar inadimplência?</label>
                      <InputNumber v-model="parametro.TEMVERINAPAR"/>
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
    import CargoService from '../../../../service/icontribui/CargoService';
    import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
    import ParametroService from '../../../../service/geral/ParametroService';

    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                icontribui: { label: "Selecione", value: "S" },
                opcoesSimNao: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                beneficiosObrigatorios: {},
                matriculaUnicaSegurado: {},
                matriculaUnicaAssociacao: {},
                parametro: {
                  CODEMP: null,
                  CARHOMPAR: null,
                  GRPUSUADVPAR: null,
                  QTDDIAAGEPAR: null,
                  QTDAGEDIAPAR: null,
                  REGBENCASPAR: null,
                  MATUNISEGPAR: null,
                  MATUNIASSPAR: null,
                  MINCARCOBPAR: null,
                  TEMVERINAPAR: null,
                },
                cargo: {},
                grupoUsuario: {},
                listaCargo: [],
                listaGrupoUsuario: [],
                cargoService: null,
                grupoUsuarioService: null,
                parametroService: null,
            }
        },

        created() {
            this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
            this.cargoService = new CargoService();
            this.grupoUsuarioService = new GrupoUsuarioService();
            this.parametroService = new ParametroService();

            this.cargoService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaCargo.push({ label : entry.DESCAR, value : entry.CODCAR })
            )
          })

          this.grupoUsuarioService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaGrupoUsuario.push({ label : entry.DESGRPUSU, value : entry.CODGRPUSU })
            )
          })
        },

        methods: {
          preencheDados(dados) {
            this.parametro = dados[0];
            },

          async save() {
            let data = this.parametro;
            data.CODEMP = this.propParametro[0].CODEMP;
            data.CARHOMPAR = this.cargo.value;
            data.GRPUSUADVPAR = this.grupoUsuario.value;
            data.QTDDIAAGEPAR = this.parametro.QTDDIAAGEPAR;
            data.QTDAGEDIAPAR = this.parametro.QTDAGEDIAPAR;
            data.REGBENCASPAR = this.beneficiosObrigatorios.value;
            data.MATUNISEGPAR = this.matriculaUnicaSegurado.value;
            data.MATUNIASSPAR = this.matriculaUnicaAssociacao.value;
            data.MINCARCOBPAR = this.parametro.MINCARCOBPAR;
            data.TEMVERINAPAR = this.parametro.TEMVERINAPAR;

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
                  CARHOMPAR: null,
                  GRPUSUADVPAR: null,
                  QTDDIAAGEPAR: null,
                  QTDAGEDIAPAR: null,
                  REGBENCASPAR: null,
                  MATUNISEGPAR: null,
                  MATUNIASSPAR: null,
                  MINCARCOBPAR: null,
                  TEMVERINAPAR: null,
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