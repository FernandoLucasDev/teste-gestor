<template>
  <div>
    <div class="p-fluid">
      <div class="grid">  
        <div class="col-12">
          <Toast/>
              <hr />
                <div>
                <div class="formgrid grid">
                    <div class="field col-12 md:col-6">
                        <label for="name">Unifica Entidade?</label>
                        <Dropdown v-model="unificaEntidade" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Visualizar entidades de outras empresas?</label>
                        <Dropdown v-model="visualizarEntidade" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">E-mail padrão:</label>
                        <InputText v-model="parametro.EMAPADPAR"/>
                    </div>

                    <div class="field col-6 md:col-6">
                        <label for="name">Dia vencimento padrão:</label>
                        <InputNumber v-model="parametro.VENPADPAR"/>
                    </div>

                    <div class="field col-6">
                        <label for="name">Exibir aba "Detalhes" no cadastro de entidade?</label>
                        <Dropdown v-model="abaDetalhes" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Todos os textos em caixa alta?</label>
                        <Dropdown v-model="caixaAlta" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Textos aceitam acentuação?</label>
                        <Dropdown v-model="acentuacao" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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

                    <div class="field col-6 md:col-6">
                        <label for="name">Tempo Atualização:</label>
                        <InputNumber v-model="parametro.TEMATUCADPAR"/>
                    </div>

                    <div class="field col-6">
                        <label for="name">O campo "Endereço" no cadastro de entidade é obrigatório?</label>
                        <Dropdown v-model="enderecoObrigatorio" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Utilizar Empresa:</label>
                        <InputText v-model="parametro.EMPUTIPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Utilizar Empresa no RH:</label>
                        <InputText v-model="parametro.ERHUTIPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Utilizar Empresa no Financeiro:</label>
                        <InputText v-model="parametro.EFIUTIPAR"/>   
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Logomarca:</label>
                        <FileUpload v-model="logomarca" v-on="showFile(file)" name="demo[]" url="./upload.php" accept="image/*, .pdf" :maxFileSize="1000000"/>
                    </div>

                    <div class="field col-12">
                        <label for="name">Diretório Adobe Reader:</label>
                        <InputText v-model="parametro.DIRPDFPAR"/>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="name">Estado:</label>
                        <InputText v-model="parametro.ESTDEFPAR"/>
                    </div>

                    <div class="field col-12 md:col-6">
                        <label for="name">Cidade:</label>
                        <InputText v-model="parametro.CIDDEFPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Diretório de SMS:</label>
                        <InputText v-model="parametro.DIRSMSPAR"/>
                    </div>

                    <div class="field col-6">
                        <label for="name">Faixa Fornecedor?</label>
                        <Dropdown v-model="faixaFornecedor" :options="opcoesSimNao" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Fim do Ciclo?</label>
                        <Dropdown v-model="fimCiclo" :options="listaFimCiclo" optionLabel="label" placeholder="Selecione">
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
                        <label for="name">Horas Produtivas:</label>
                        <InputText v-model="parametro.HORPROPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Idade da Aposentadoria:</label>
                        <InputText v-model="parametro.IDAAPOPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Expectativa de Vida:</label>
                        <InputText v-model="parametro.IDAMAXVIDPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">% para Inventário:</label>
                        <InputText v-model="parametro.PERIVEPAR"/>
                    </div>

                    <div class="field col-12 md:col-12">
                        <label for="name">Valor Barracão:</label>
                        <InputText v-model="parametro.VALBARPAR"/>
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
import FileUpload from 'primevue/fileupload';
import ParametroService from '../../../../service/geral/ParametroService';
// import { file } from '@babel/types';

    export default {
        props:["editando", "propParametro"],
        data() {
            return {
                geral: { label: "Selecione", value: "S" },
                unificaEntidade: {},
                visualizarEntidade: {},
                abaDetalhes: {},
                caixaAlta: {},
                acentuacao: {},
                enderecoObrigatorio: {},
                faixaFornecedor: {},
                fimCiclo: {},
                logomarca: {},
                opcoesSimNao: [
                  { label: "Sim", value: "S" },
                  { label: "Não", value: "N" },
                ],
                file: [],
                listaFimCiclo: [
                //   { label: "Digitação do Pedido", value: "0" },
                  { label: "Fechamento do Pedido", value: "1" },
                  { label: "Entrega do Pedido", value: "2" },
                ],
                parametro: {
                  CODEMP: null,
                  UNIENTPAR: null,
                  VISOUTEMPPAR: null,
                  EMAPADPAR: null,
                  VENPADPAR: null,
                  CAIALTPAR: null,
                  ACEACEPAR: null,
                  TEMATUCADPAR: null,
                  EMPUTIPAR: null,
                  ERHUTIPAR: null,
                  EFIUTIPAR: null,
                //   LOGMARPAR: null,
                  DIRPDFPAR: null,
                  ESTDEFPAR: null,
                  CIDDEFPAR: null,
                  DIRSMSPAR: null,
                  FAIFORPAR: null,
                  FINCICPAR: null,
                  HORPROPAR: null,
                  IDAAPOPAR: null,
                  IDAMAXVIDPAR: null,
                  PERIVEPAR: null,
                  VALBARPAR: null,
                },
                parametroService: null,
            }
        },

        created() {
            this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
            this.parametroService = new ParametroService();
        },
        
        methods: {
            showFile(file) {
                // console.log("1123");
                // console.log(file);
            },

            preencheDados(dados) {
                this.parametro = dados[0];
            },

            async save(){
                let data = this.parametro;
                data.CODEMP = this.propParametro[0].CODEMP;
                data.UNIENTPAR = this.unificaEntidade.value;
                data.VISOUTEMPPAR = this.visualizarEntidade.value;
                data.EMAPADPAR = this.parametro.EMAPADPAR;
                data.VENPADPAR = this.parametro.VENPADPAR;
                data.ABADETPAR = this.abaDetalhes.value;
                data.CAIALTPAR = this.caixaAlta.value;
                data.ACEACEPAR = this.acentuacao.value;
                data.TEMATUCADPAR = this.parametro.TEMATUCADPAR
                data.ENDOBRENT = this.enderecoObrigatorio.value;
                data.EMPUTIPAR = this.parametro.EMPUTIPAR;
                data.ERHUTIPAR = this.parametro.ERHUTIPAR;
                data.EFIUTIPAR = this.parametro.EFIUTIPAR;
                // data.LOGMARPAR = this.logomarca.value;
                data.DIRPDFPAR = this.parametro.DIRPDFPAR;
                data.ESTDEFPAR = this.parametro.ESTDEFPAR;
                data.CIDDEFPAR = this.parametro.CIDDEFPAR;
                data.DIRSMSPAR = this.parametro.DIRSMSPAR;
                data.FAIFORPAR = this.faixaFornecedor.value;
                data.FINCICPAR = this.fimCiclo.value;
                data.HORPROPAR = this.parametro.HORPROPAR;
                data.IDAAPOPAR = this.parametro.IDAAPOPAR;
                data.IDAMAXVIDPAR = this.parametro.IDAMAXVIDPAR;
                data.PERIVEPAR = this.parametro.PERIVEPAR;
                data.VALBARPAR = this.parametro.VALBARPAR;

                // console.log("Salvando");
                // console.log("this.codigo :>>", data);
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
                        UNIENTPAR: null,
                        VISOUTEMPPAR: null,
                        EMAPADPAR: null,
                        VENPADPAR: null,
                        ABADETPAR: null,
                        CAIALTPAR: null,
                        ACEACEPAR: null,
                        TEMATUCADPAR: null,
                        EMPUTIPAR: null,
                        ERHUTIPAR: null,
                        EFIUTIPAR: null,
                        // LOGMARPAR: null,
                        DIRPDFPAR: null,
                        ESTDEFPAR: null,
                        CIDDEFPAR: null,
                        DIRSMSPAR: null,
                        FAIFORPAR: null,
                        FINCICPAR: null,
                        HORPROPAR: null,
                        IDAAPOPAR: null,
                        IDAMAXVIDPAR: null,
                        PERIVEPAR: null,
                        VALBARPAR: null,
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