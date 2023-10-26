<template>
  <div>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
          <Toast/>
              <hr />
                <div>
                <div class="formgrid grid">
                    <div class="field md:col-6 col-12">
                        <label for="name">Tabela de Preço:</label>
                        <Dropdown v-model="tabelaPreco" :options="listaTabelaPreco" optionLabel="label" placeholder="Selecione">
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
    
                    <div class="field md:col-6 col-12">
                        <label for="name">Tipo de pedido:</label>
                        <Dropdown v-model="tipoPedido" :options="listaTipoPedido" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Máximo de itens:</label>
                        <InputNumber v-model="parametro.MAXITEPEDPAR"/>
                    </div>

                    <div class="field md:col-4 col-12">
                        <label for="name">Valor Pedido?:</label>
                        <Dropdown v-model="valorPedido" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Apenas admins alteram valor pedido?:</label>
                        <Dropdown v-model="alterarValorPedido" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">WsReport:</label>
                        <Dropdown v-model="wsreport" :options="listaWsreport" optionLabel="label" placeholder="Selecione">
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
                        <span style="font-size: 20px; margin: 21px 0;">Análise de clientes sem vendas</span>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="name">Máximo de dias:</label>
                        <InputText v-model="parametro.MAXDIAACOPAR"/>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="name">Últimos dias:</label>
                        <InputText v-model="parametro.DIAACOPAR"/>
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
    import TipoPedidoService from '../../../../service/comercial/TipoPedidoService';
    import WsreportService from '../../../../service/comercial/WsreportService';
    import ParametroService from '../../../../service/geral/ParametroService';

    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                comercial: { label: "Selecione", value: "S" },
                valorPedido: {},
                alterarValorPedido: {},
                tabelaPreco: {},
                parametro: {
                  CODEMP: null,
                  CODTABPRE: null,
                  CODTIPPED: null,
                  MAXITEPEDPAR: null,
                  VALPEDPAR: null,
                  ADMVALPROPAR: null,
                  WSRPEDPAR: null,
                  MAXDIAACOPAR: null,
                  DIAACOPAR: null,
                },
                opcoesSimNao: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                listaTabelaPreco: [
                  { label: "Sem Nota", value: "0" },
                  { label: "Com Nota", value: "1" },
                ],
                listaTipoPedido: [],
                listaWsreport: [],
                tipoPedido: [],
                wsreport: [],
                tipoPedidoService: null,
                wsreportService: null,
                parametroService: null,
            }
        },
        created() {
            this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
            this.tipoPedidoService = new TipoPedidoService();
            this.wsreportService = new WsreportService();
            this.parametroService = new ParametroService();

            this.tipoPedidoService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaTipoPedido.push({ label : entry.DESTIPPED, value : entry.CODTIPPED })
            )
          })

          this.wsreportService.all().then((response)=>{
            console.log("1", response);
            response.map(
              (entry) => this.listaWsreport.push({ label : entry.DESWSR, value : entry.CODWSR })
            )
          })

        },

        methods: {
            preencheDados(dados) {
                this.parametro = dados[0];
            },

            async save(){
                let data = this.parametro;
                data.CODEMP = this.propParametro[0].CODEMP;
                data.CODTABPRE = this.tabelaPreco.value;
                data.CODTIPPED = this.tipoPedido.value;
                data.MAXITEPEDPAR = this.parametro.MAXITEPEDPAR;
                data.VALPEDPAR = this.valorPedido.value;
                data.ADMVALPROPAR = this.alterarValorPedido.value;
                data.WSRPEDPAR = this.wsreport.value;
                data.MAXDIAACOPAR = this.parametro.MAXDIAACOPAR;
                data.DIAACOPAR = this.parametro.DIAACOPAR;

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
                        CODTABPRE: null,
                        CODTIPPED: null,
                        MAXITEPEDPAR: null,
                        VALPEDPAR: null,
                        ADMVALPROPAR: null,
                        WSRPEDPAR: null,
                        MAXDIAACOPAR: null,
                        DIAACOPAR: null,
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