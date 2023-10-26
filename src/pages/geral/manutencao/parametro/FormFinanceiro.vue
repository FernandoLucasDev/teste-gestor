<template>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
                <!-- <div class="col-12">
                    <TabMenu :model="items" />
                    <router-view />
                </div> -->
            <Toast/>
            <hr />
            <div>
              <div class="formgrid grid">
                <div class="field md:col-4 col-6">
                    <label for="name">Integra contribuição:</label>
                    <Dropdown v-model="integraContribuicao" :options="listaIntegraContribuicao" optionLabel="label" placeholder="Selecione">
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
  
                <div class="field col-6 md:col-8">
                      <label for="name">Número de dias:</label>
                      <InputText v-model="parametro.DIAMOCVEN"/>
                </div>

                <div class="field md:col-12 col-12">
                    <label for="name">Vencimento:</label>
                    <Dropdown v-model="vencimento" :options="listaVencimento" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Moeda padrão:</label>
                    <Dropdown v-model="moedaPadrao" :options="listaMoedaPadrao" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Condição de pagamento:</label>
                    <Dropdown v-model="condicaoPagamento" :options="listaCondicaoPagamento" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Despesa / Receita:</label>
                    <Dropdown v-model="despesa" :options="listaDespesa" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Tipo de documento:</label>
                    <Dropdown v-model="tipoDocumento" :options="listaTipoDocumento" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Forma de pagamento:</label>
                    <Dropdown v-model="formaPagamento" :options="listaFormaPagamento" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-4 col-12">
                    <label for="name">Centro de custo:</label>
                    <Dropdown v-model="centroCusto" :options="listaCentroCusto" optionLabel="label" placeholder="Selecione">
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

                <div class="field md:col-12 col-12">
                    <label for="name">Conta:</label>
                    <Dropdown v-model="conta" :options="listaConta" optionLabel="label" placeholder="Selecione">
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
                
                <div class="field md:col-12 col-12">
                      <label for="name">Valor mínimo:</label>
                      <InputNumber v-model="parametro.VALMINCONPAR" mode="currency" currency="BRL" locale="pt-BR"/>
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
</template>

<script>
    import MoedaService from '../../../../service/financeiro/MoedaService';
    import CondicaoPagamentoService from '../../../../service/financeiro/CondicaoPagamentoService';
    import TipoDocumentoService from '../../../../service/financeiro/TipoDocumentoService';
    import ContaService from '../../../../service/financeiro/ContaService';
    import FormaPagamentoService from '../../../../service/financeiro/FormaPagamentoService';
    import CentroCustoService from '../../../../service/financeiro/CentroCustoService';
    import ParametroService from '../../../../service/geral/ParametroService';

    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                financeiro: { label: "Selecione", value: "S" },
                opcoes: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                opcoesVencimento: [
                  { label: "Vencimento/Pagamento", value: "V" },
                  { label: "Vencimento Bancário", value: "B" },
                ],
                listaMoedaPadrao: [],
                listaCondicaoPagamento: [],
                listaTipoDocumento: [],
                listaConta: [],
                listaFormaPagamento: [],
                listaCentroCusto: [],
                listaIntegraContribuicao: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                listaVencimento: [
                  { label: "Vencimento/Pagamento", value: "V" },
                  { label: "Vencimento Bancário", value: "B" },
                ],
                listaDespesa: [],
                moedaPadrao: {},
                condicaoPagamento: {},
                tipoDocumento: {},
                conta: {},
                formaPagamento: {},
                centroCusto: {},
                integraContribuicao:{},
                vencimento: {},
                despesa: {},
                parametro: {
                  CODEMP: null,
                  CODMOE: null,
                  CODCND: null,
                  CODTIPDOC: null,
                  CODCTA: null,
                  CODFPG: null,
                  CODTIPDES: null,
                  CODCENCUS: null,
                  VENBANPAR: null,
                  VALMINCONPAR: null,
                  DIAMOCVEN: null,
                  INTCNTFINPAR: null
                },
                numeroDias: null,
                valorMinimo: null,
                moedaService: null,
                condicaoPagamentoService: null,
                tipoDocumentoService: null,
                contaService: null,
                formaPagamentoService: null,
                centroCustoService: null,
                parametroService: null,
            }
        },
        created() {
          console.log("Expose do parametro do pai :>>> ", this.propParametro)
          this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
          console.log()
            this.moedaService = new MoedaService();
            this.condicaoPagamentoService = new CondicaoPagamentoService();
            this.tipoDocumentoService = new TipoDocumentoService();
            this.contaService = new ContaService();
            this.formaPagamentoService = new FormaPagamentoService();
            this.centroCustoService = new CentroCustoService();
            this.parametroService = new ParametroService();

            this.moedaService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaMoedaPadrao.push({ label : entry.DESMOE, value : entry.CODMOE })
            )
          })

          this.condicaoPagamentoService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaCondicaoPagamento.push({ label : entry.DESCND, value : entry.CODCND })
            )
          })

          this.tipoDocumentoService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaTipoDocumento.push({ label : entry.DESTIPDOC, value : entry.CODTIPDOC })
            )
          })

          this.contaService.all().then((response)=>{
            console.log("5", response);
            response.map(
              (entry) => this.listaConta.push({ label : entry.IDEEMPBAN, value : entry.CODCTA })
            )
          })

          this.formaPagamentoService.all().then((response)=>{
            console.log("2", response);
            response.map(
              (entry) => this.listaFormaPagamento.push({ label : entry.DESFPG, value : entry.CODFPG })
            )
          })

          this.centroCustoService.all().then((response)=>{
            console.log("2", response);
            response.map(
              (entry) => this.listaCentroCusto.push({ label : entry.DESCENCUS, value : entry.CODCENCUS })
            )
          })

        },

        mounted(){
          // this.parametro = this.propParametro[0];
        },

        methods: {
          preencheDados(dados){
            console.log("Expose do parametro do pai :>>> ", dados)
            this.parametro = dados[0];
          },

          async save(){

            let data = this.parametro;
            data.CODEMP = this.propParametro[0].CODEMP;
            data.CODMOE = this.moedaPadrao.value;
            data.CODCND = this.condicaoPagamento.value;
            data.CODTIPDOC = this.tipoDocumento.value;
            data.CODCTA = this.conta.value;
            data.CODFPG = this.formaPagamento.value;
            data.CODCENCUS = this.centroCusto.value;
            data.INTCNTFINPAR = this.integraContribuicao.value;
            data.VENBANPAR = this.vencimento.value;
            data.CODTIPDES = this.despesa.value;
            data.DIAMOCVEN = this.parametro.DIAMOCVEN;
            data.VALMINCONPAR = this.parametro.VALMINCONPAR;
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
                CODMOE: null,
                CODCND: null,
                CODTIPDOC: null,
                CODCTA: null,
                CODFPG: null,
                CODTIPDES: null,
                CODCENCUS: null,
                VENBANPAR: null,
                VALMINCONPAR: null,
                DIAMOCVEN: null,
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