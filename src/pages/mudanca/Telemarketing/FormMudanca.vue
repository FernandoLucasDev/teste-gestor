<template>
	<div class="grid relative">
    <div class="carrega" v-if="carregandoDados">
      <ProgressSpinner style="height: 50px;" stroke-width="4"/>
      <h3>Carregando...</h3>
    </div>

    <Dialog v-model:visible="documentDialog" :style="{width: '70%'}" header="Impressão de documentos" :modal="true" class="p-fluid">
      <div>
        <ImpressaoDocumento :dadosMudanca="mudancaSelected"/>
      </div>
    </Dialog>
	  
    <div class="col-12">
      <div class="p-fluid">

        <div v-if="loading1">
          <ProgressSpinner style="height: 50px;" />
        </div>
        
        <div class="formgrid grid">
          <div class="field col-6 md:col-9">
            <div class="flex col-12 align-items-center justify-content-center">
              <font-awesome-icon icon="fa-solid fa-truck" size="lg" :style="{color: statusMudancaColor}" />
              <!-- <span style="color: Tomato;">
                <i class="fa-solid fa-truck"></i>
              </span> -->
              <label style="text-align: center; font-size: 20px; font-weight: bold; padding-left: 7px" id="status" icon="pi-truck" v-text="statusMudanca" :style="{color: statusMudancaColor}"></label>
            </div>
          </div>
          <div class="field col-6 md:col-3">
            <label for="name">Valor Total</label>
            <InputNumber v-model="valorTotal" mode="currency" currency="BRL" locale="pt-BR" :disabled="true" />
          </div>
        </div>

        <div class="formgrid grid">
          <div class="col-12">
            <TabView>
              <TabPanel header="Orçamento">
                <div class="formgrid grid">
                  <div class="field col-12">
                    <label for="descricao">Responsável</label>
                    <!-- <InputText v-model.trim="mudancaSelected.NOMRESMUD" requerida="true" autofocus /> -->
                    <Dropdown id="veiculo" v-model="funcionario" :options="funcionarios" optionLabel="label" placeholder="Selecione" :disabled="desabilitar">
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
                    <label for="tipoMudanca">Mudança</label>
                    <Dropdown id="tipoMudanca" v-model="tipoMudanca" :options="tiposMudanca" :disabled="tipoMudancaDisabled" optionLabel="label" placeholder="Selecione">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !tipoMudanca">Tipo de Mudança é requeridao.</small>
                  </div>
                  <div class="field field col-6 md:col-3">
                    <label for="convenio">Convênio</label>
                    <Dropdown id="convenio" v-model="convenio" :options="convenios" :disabled="desabilitar" optionLabel="label" placeholder="Selecione" @change="changeConvenio">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !convenio">Convênio é requerida.</small>
                  </div>
                  <div class="field field col-6 md:col-3">
                    <label for="name">Data</label>
                    <Calendar v-model="dataAtual" dateFormat="dd/mm/yy" :disabled="true" />
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.DATATU">Data é requerida.</small>
                  </div>
                  <div class="field field col-6 md:col-3">
                    <label for="name">Hora</label>
<!--                    <Calendar v-model="entidadeSelected.HORATU" dateFormat="hh:ii:ss" />   -->
<!--                    <VueTimepicker v-model="entidadeSelected.HORATU" ></VueTimepicker>   -->
                    <InputMask id="hora" mask="99:99:99" v-model="horaAtual" :disabled="desabilitar" />
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.HORATU">Hora é requerida.</small>
                  </div>
                </div>
                
                <div class="formgrid grid">
                  <div class="field col-6 md:col-4">
                    <label for="vistoria">Vistoria?</label>
                    <Dropdown id="vistoria" v-model="vistoria" :options="opcoes" :disabled="desabilitar" optionLabel="label" placeholder="Selecione" @change="changeType">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMCON">Vistoria é requerida.</small>
                  </div>
                  <div class="field col-6 md:col-4">
                    <label for="name">Data Vistoria:</label>
                    <Calendar v-model="this.dataVistoria" :disabled="desabilitar || vistoria.value == 'N'" dateFormat="dd/mm/yy" @date-select="changeHorarioVistoria" />
                    <small class="p-invalid" v-if="submitted && !this.dataVistoria">Data da vistoria é requerida.</small>
                  </div>
                  <div class="field col-12 md:col-4">
                    <label for="name">Horarios Disponíveis:</label>
                    <Dropdown id="horarioVistoria" v-model="horarioVistoria" :disabled="desabilitar || vistoria.value == 'N'" :options="horariosVistoria" optionLabel="label" placeholder="Selecione">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.HORVISMUD">Horário de Vistoria é requerido.</small>
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col-6 md:col-3">
                    <label for="name">Data de Apanha:</label>
                    <Calendar v-model="dataApanha" dateFormat="dd/mm/yy" :disabled="desabilitar" />
                    <small class="p-invalid" v-if="submitted && !dataApanha">Data da Apanha é requerida.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Data de Entrega:</label>
                    <Calendar v-model="dataEntrega" dateFormat="dd/mm/yy" :disabled="desabilitar"/>
                    <small class="p-invalid" v-if="submitted && !dataEntrega">Data da Apanha é requerida.</small>
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col-6 md:col-3">
                    <label for="convenioMudanca">Convênio</label>
                    <Dropdown id="convenioMudanca" :disabled="desabilitar" v-model="convenioMudanca" :options="conveniosMudanca" optionLabel="label" placeholder="Selecione" @change="changeConvenioMudanca">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMCON">Name is requerida.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Valor</label>
                    <!-- <InputNumber v-model="valor" requerida="true" autofocus :class="{'p-invalid': submitted && !valor}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal" @blur="calculaTotal" /> -->
                    <InputNumber v-model="valor" requerida="true" autofocus :class="{'p-invalid': submitted && !valor}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @update:modelValue="calculaTotal()" />
                    <small class="p-invalid" v-if="submitted && !valor">Valor é requerido.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Valor apr</label>
                    <InputNumber v-model="valorApr" requerida="true" autofocus :class="{'p-invalid': submitted && !valorApr}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal"/>
                    <small class="p-invalid" v-if="submitted && !valorApr">Valor do Aproveitamento requerido.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Seguro</label>
                    <InputNumber v-model="valorSeguro" requerida="true" autofocus :class="{'p-invalid': submitted && !valorSeguro}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal"/>
                    <small class="p-invalid" v-if="submitted && !valorSeguro">Valor do Seguro é requerido.</small>
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col-6 md:col-3">
                    <label for="name">Valor Assegurado</label>
                    <InputNumber v-model="valorAssegurado" requerida="true" autofocus :class="{'p-invalid': submitted && !valorAssegurado}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal" />
                    <small class="p-invalid" v-if="submitted && !valorAssegurado">Valor assegurado é requerido.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Valor Embalamento</label>
                    <InputNumber v-model="valorEmbalamento" requerida="true" autofocus :class="{'p-invalid': submitted && !valorEmbalamento}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal" @blur="calculaTotal" />
                    <small class="p-invalid" v-if="submitted && !valorEmbalamento">Valor do embalamento é requerido.</small>
                  </div>
                  <div class="field col-6 md:col-3">
                    <label for="name">Valor Içamento</label>
                    <InputNumber v-model="valorIcamento" requerida="true" autofocus :class="{'p-invalid': submitted && !valorIcamento}" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" @input="calculaTotal" @blur="calculaTotal" />
                    <small class="p-invalid" v-if="submitted && !valorIcamento">Valor do Içamento requerida.</small>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Cliente">
                <div class="col-12">
                  <div class="formgrid grid">
                    <div class="field col-12">
                      <label for="name">Cliente</label>
                      <InputText v-model.trim="entidadeSelected.NOMENT" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.NOMENT}" maxlength="100"/>
                      <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMENT">Nome é requerido.</small>
                    </div>
                  </div>

                  <div class="formgrid grid">
                    <div class="field col-6 md:col-3">
                      <label for="telefone">Telefone</label>
                      <InputText v-model.trim="entidadeSelected.TELENT" :disabled="desabilitar" autofocus maxlength="14" @change="formataTELENT" />
                    </div>
                    <div class="field col-6 md:col-3">
                      <label for="telefone">Celular</label>
                      <InputText v-model.trim="entidadeSelected.CELENT" :disabled="desabilitar" autofocus maxlength="14" @change="formataCELENT" />
                    </div>
                    <div class="field col-12 md:col-6">
                      <label for="telefone">E-mail</label>
                      <InputText v-model.trim="entidadeSelected.EMAENT" :disabled="desabilitar" autofocus maxlength="200"/>
                    </div>
                    <div class="field col-12 md:col-3">
                      <label for="cpf">CPF</label>
                      <div v-if="entidadeSelected.TIPDOCENT && entidadeSelected.TIPDOCENT == 2">
                        <InputMask id="CPFENT" mask="999.999.999-99" v-model="entidadeSelected.DOCENT"></InputMask>
                      </div>
                      <div v-else-if="entidadeSelected.TIPDOCENT && entidadeSelected.TIPDOCENT == 3">
                        <InputMask id="CNPJENT" mask="99.999.999/9999-99" v-model="entidadeSelected.DOCENT"></InputMask>
                      </div>
                      <div v-else>
                        <InputText v-model.trim="entidadeSelected.DOCENT" :disabled="desabilitar" autofocus />
                      </div>
                    </div>
                    <div v-if="loading4"  class="field col-3">
                      <ProgressSpinner style="height: 30px; margin-top : 20%" />
                    </div>
                  </div>

                </div>


                <TabView>
                  <TabPanel header="Origem">
                    <div class="formgrid grid">
                      <div class="col-12">
                        <div class="formgrid grid">
                          <div class="field col-6 md:col-3">
                            <label for="cep">CEP</label>
                            <!-- <InputText v-model.trim="mudancaSelected.CEPORIMUD" requerida="true" :disabled="desabilitar" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CEPORIMUD}" /> -->
                            <InputMask mask="99999-999" v-model.trim="mudancaSelected.CEPORIMUD" />
                          </div>
                          <div class="col-6 md:col-2">
                              <Button :loading="loading3" label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchCEPOrigem" />
                          </div>
                          <div class="field col-12 md:col-3">
                            <label for="estado">Estado</label>
                            <Dropdown id="estado" v-model="estadoOrigem" :options="estados" :disabled="desabilitar" optionLabel="label" placeholder="Selecione" >
                              <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                  <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.value}}</span>
                                </div>
                                <span v-else>
                                  {{slotProps.placeholder}}
                                </span>
                              </template>
                            </Dropdown>

                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12 md:col-12 lg:col-6">
                            <label for="cidade">Cidade</label>
                            <InputText v-model.trim="mudancaSelected.CIDORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CIDORIMUD}" maxlength="60"/>
                          </div>
                        <!-- </div>
                        
                        <div class="formgrid grid"> -->
                          <div class="field col-12 md:col-12 lg:col-6">
                            <label for="bairro">Bairro</label>
                            <InputText v-model.trim="mudancaSelected.BAIORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.BAIORIMUD}" maxlength="40"/>
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12 md:col-9">
                            <label for="logradouro">Logradouro</label>
                            <InputText v-model.trim="mudancaSelected.LOGORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.LOGORIMUD}" maxlength="200"/>
                          </div>
                        <!-- </div>
                        
                        <div class="formgrid grid"> -->
                          <div class="field col-12 md:col-3">
                            <label for="numorimud">Número</label>
                            <InputText id="numorimud" name="numorimud" v-model.trim="mudancaSelected.NUMORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': erroNum['NUMORIMUD']}" @change="validaNum"/>
                            <small class="p-error" v-if="erroNum['NUMORIMUD']">O campo deve conter número válido.</small>
                          </div>
                          <div class="field col-12 md:col-12">
                            <label for="cpf">Complemento</label>
                            <InputText v-model.trim="mudancaSelected.COMORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.COMORIMUD}" maxlength="20"/>
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">Referência</label>
                            <InputText v-model.trim="mudancaSelected.REFORIMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.REFORIMUD}" maxlength="250"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel header="Destino">

                    <div class="formgrid grid">
                      <div class="col-12">
                        <div class="formgrid grid">
                          <div class="field col-6 md:col-3">
                            <label for="cpf">CEP</label>
                            <!-- <InputText v-model.trim="mudancaSelected.CEPDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CEPDESMUD}" /> -->
                            <InputMask mask="99999-999" v-model.trim="mudancaSelected.CEPDESMUD" />
                          </div>
                          <div class="field col-6 md:col-2">
                              <Button :loading="loading6" label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchCEPDestino" />
                          </div>
                          <div class="field col-12 md:col-3">
                            <label for="estado">Estado</label>
                            <Dropdown id="estado" v-model="estadoDestino" :options="estados" optionLabel="label" placeholder="Selecione" @change="onChange" >
                              <template #value="slotProps">
                                <div v-if="slotProps.value && slotProps.value.value">
                                  <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.value}}</span>
                                </div>
                                <span v-else>
                                  {{slotProps.placeholder}}
                                </span>
                              </template>
                            </Dropdown>

                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12 md:col-12 lg:col-6">
                            <label for="cpf">Cidade</label>
                            <InputText v-model.trim="mudancaSelected.CIDDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CIDDESMUD}" maxlength="60"/>
                          </div>
                        <!-- </div>
                        
                        <div class="formgrid grid"> -->
                          <div class="field col-12 md:col-12 lg:col-6">
                            <label for="cpf">Bairro</label>
                            <InputText v-model.trim="mudancaSelected.BAIDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.BAIDESMUD}" maxlength="40"/>
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12 md:col-9">
                            <label for="cpf">Logradouro</label>
                            <InputText v-model.trim="mudancaSelected.LOGDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.LOGDESMUD}" maxlength="200"/>
                          </div>
                        <!-- </div>
                        
                        <div class="formgrid grid"> -->
                          <div class="field col-5 md:col-3">
                            <label for="numdesmud">Número</label>
                            <InputText id="numdesmud" name="numdesmud" v-model.trim="mudancaSelected.NUMDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': erroNum['NUMDESMUD']}" @change="validaNum" />
                            <small class="p-error" v-if="erroNum['NUMDESMUD']">O campo deve conter número válido.</small>
                          </div>
                          <div class="field col-12 md:col-12">
                            <label for="cpf">Complemento</label>
                            <InputText v-model.trim="mudancaSelected.COMDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.COMDESMUD}" />
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">Referência</label>
                            <InputText v-model.trim="mudancaSelected.REFDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.REFDESMUD}" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </TabPanel>
                  <TabPanel header="Contato">

                    <div class="formgrid grid">
                      <div class="col-12">
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">Nome</label>
                            <InputText v-model.trim="mudancaSelected.PESCONMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.PESCONMUD}" maxlength="30"/>
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">Telefone</label>
                            <InputText v-model.trim="mudancaSelected.TELCONMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.TELCONMUD}" />
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">E-mail</label>
                            <InputText v-model.trim="mudancaSelected.EMACONMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.EMACONMUD}" maxlength="50"/>
                          </div>
                        </div>
                        
                        <div class="formgrid grid">
                          <div class="field col-12">
                            <label for="cpf">Ordem de Compra</label>
                            <InputText v-model.trim="mudancaSelected.ORDCOMMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.ORDCOMMUD}" maxlength="45"/>
                          </div>
                        </div>

                      </div>
                    </div>

                  </TabPanel>
                </TabView>
                



                

              </TabPanel>

              <TabPanel header="Moveis">
                <div class="formgrid grid">
                  <div class="col-12">
                    
                    <div class="formgrid grid">
                      <div class="field col-12">
                        <label for="descricao">Descrição</label>
                        <InputText v-model.trim="movel.DESDMU" :disabled="desabilitar" :class="{'p-invalid': this.erroMovel.DESDMU}" />
                        <small class="p-error" v-if="erroMovel.DESDMU">Campo obrigatório.</small>
                      </div>
                    </div>
                    <div class="formgrid grid">
                      <div class="field col-6 md:col-3">
                        <label for="valor">Valor</label>
                        <!-- <InputText v-model.trim="movel.VALUNIDMU" :disabled="desabilitar" requerida="true" autofocus /> -->
                        <InputNumber v-model="movel.VALUNIDMU" :disabled="desabilitar" mode="currency" currency="BRL" locale="pt-BR" />
                      </div>
                      <div class="field col-6 md:col-3">
                        <label for="quantidade">Quantidade</label>
                        <InputText v-model.trim="movel.QTDDMU" :disabled="desabilitar" :class="{'p-invalid': this.erroMovel.QTDDMU}" />
                        <small class="p-error" v-if="erroMovel.QTDDMU">Campo obrigatório.</small>
                      </div>
                    </div>
                    <div class="formgrid grid">
                      <div class="field col-12">
                        <label for="observacao">Obs</label>
                        <InputText v-model.trim="movel.OBSDMU" :disabled="desabilitar" requerida="true" autofocus />
                      </div>
                    </div>
                    <div class="formgrid grid">
                      <div class="field col-6 md:col-2">
                          <Button v-if="movel.IDX >= 0" label="Alterar" icon="pi pi-pencil" class="p-button-warning" style="margin-top: 15%;" @click="alteraMovel" />
                          <Button v-else label="Adicionar" icon="pi pi-plus" class="p-button-info" style="margin-top: 15%;" @click="addMovel" />
                      </div>
                    </div>

                    <div class="formgrid grid">
                      <div class="field col-12">
                        <DataTable :value="moveis" :paginator="true" class="p-datatable-gridlines" :rows="10" :rowHover="true" 
                              filterDisplay="menu" :loading="loadingDep" responsiveLayout="scroll" >
                          <template #empty>
                              Nenhum dependente encontrado
                          </template>
                          <template #loading>
                              Carregando...
                          </template>

                          <Column field="descricao" header="Descrição" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.DESDMU}}
                            </template>
                          </Column>

                          <Column field="valor" header="Valor" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.VALUNIDMU.toLocaleString("pt-BR",{ style: 'currency', currency: 'BRL' })}}
                            </template>
                          </Column>

                          <Column field="quantidade" header="Quantidade" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.QTDDMU}}
                            </template>
                          </Column>

                          <Column field="observacao" header="Observação" style="min-width:12rem">
                            <template #body="{data}">
                                {{data.OBSDMU}}
                            </template>
                          </Column>

                          <Column headerStyle="min-width:10rem; width:10rem;">
                            <template #body="props">
                              <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editMovel(props)" />
                              <Button icon="pi pi-trash" class="p-button-rounded p-button-danger mr-2" @click="removeMovel(props)" />
                            </template>
                          </Column>
                        </DataTable>
                      </div>
                    </div>

                  </div>
                </div>

              </TabPanel>

              <TabPanel header="Fechamento">
                <div class="formgrid grid">
                  <div class="col-12">
                    
                    <div class="formgrid grid">
                      <!-- <div class="field col-12">
                        <label for="descricao">Responsável</label>
                        <InputText v-model.trim="mudancaSelected.NOMRESMUD" requerida="true" autofocus />
                      </div> -->

                      <div class="col-12 md:col-12">
                        <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                          
                          <Translate text="Transporte" />

                          <hr  style='border: 1px solid #6366F1;' />

                          <div class="formgrid grid">
                            <div class="field col-12 md:col-6">
                              <label for="name">Veículo:</label>
                              <Dropdown id="veiculo" v-model="veiculo" :disabled="desabilitar" :options="veiculos" optionLabel="label" placeholder="Selecione">
                                <template #value="slotProps">
                                  <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                  </div>
                                  <span v-else>
                                    {{slotProps.placeholder}}
                                  </span>
                                </template>
                              </Dropdown>
                              <small class="p-invalid" v-if="submitted && !veiculo">Veículo não selecionado.</small>
                            </div>

                            <div class="field col-12 md:col-6">
                              <label for="name">Funcionário:</label>
                              <Dropdown id="veiculo" v-model="funcionario" :disabled="desabilitar" :options="funcionarios" optionLabel="label" placeholder="Selecione">
                                <template #value="slotProps">
                                  <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                  </div>
                                  <span v-else>
                                    {{slotProps.placeholder}}
                                  </span>
                                </template>
                              </Dropdown>
                              <small class="p-invalid" v-if="submitted && !funcionario">Funcionário não selecionado.</small>
                            </div>
                          </div>

                          <div class="formgrid grid">
                            <div class="field col-12 md:col-6">
                              <label for="name">Período:</label>
                              <Dropdown id="veiculo" v-model="periodo" :disabled="desabilitar" :options="periodos" optionLabel="label" placeholder="Selecione">
                                <template #value="slotProps">
                                  <div v-if="slotProps.value && slotProps.value.value">
                                    <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                                  </div>
                                  <span v-else>
                                    {{slotProps.placeholder}}
                                  </span>
                                </template>
                              </Dropdown>
                              <small class="p-invalid" v-if="submitted && !periodo">Período não selecionado.</small>
                            </div>

                            <div class="field col-12 md:col-6">
                              <label for="name">Qtd. Dias</label>
                              <InputNumber v-model="mudancaSelected.QTDPERMUD" integeronly :disabled="desabilitar" />
                            </div>
                          </div>

                        </div>
                      </div>

                      <div class="col-12 md:col-12">
                        <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                          
                          <Translate text="Horários" />

                          <hr  style='border: 1px solid #6366F1;' />

                          <div class="formgrid grid">
                            <div class="field col-6">
                              <label for="name">Data Inicial:</label>
                              <Calendar v-model="mudancaSelected.DATINIMUD" dateFormat="dd/mm/yy" :disabled="desabilitar"/>
                              <small class="p-invalid" v-if="submitted && !dataInicial">Data Inicial é requerida.</small>
                            </div>

                            <div class="field col-6">
                              <label for="name">Hora:</label>
                              <InputMask id="hora" mask="99:99:99" v-model="mudancaSelected.HORINIMUD" :disabled="desabilitar" />
                              <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                            </div>
                          </div>

                          <div class="formgrid grid">
                            <div class="field col-6">
                              <label for="name">Data Final:</label>
                              <Calendar v-model="mudancaSelected.DATFINMUD" dateFormat="dd/mm/yy" :disabled="desabilitar"/>
                              <small class="p-invalid" v-if="submitted && !dataFinal">Data Final é requerida.</small>
                            </div>

                            <div class="field col-6">
                              <label for="name">Hora:</label>
                              <InputMask id="hora" mask="99:99:99" v-model="mudancaSelected.HORFINMUD" :disabled="desabilitar" />
                              <small class="p-invalid" v-if="submitted && !horaFinal">Hora Final é requerida.</small>
                            </div>
                          </div>
                          <div class="formgrid grid">
                            <div class="card col-12 md:col-6" style='border: 2px solid #6366F1; padding-top: 10px'>
                              <Translate text="Desconto de tempo" />
                              <hr  style='border: 1px solid #6366F1;' />
                              <div class="formgrid grid">
                                <div class="field col-12">
                                  <label for="descricao">Tempo de Inatividade</label>
                                  <InputText v-model.trim="mudancaSelected.NOMRESMUD" :disabled="desabilitar" requerida="true" autofocus maxlength="100"/>
                                </div>
                              </div>
                            </div>
                            <div class="field col-12 md:col-6">
                              <label for="descricao">Número de Horas</label>
                              <InputText v-model.trim="mudancaSelected.NOMRESMUD" :disabled="desabilitar" requerida="true" autofocus />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="col-12 md:col-12">
                        <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                          
                          <Translate text="Quilometragem" />

                          <hr  style='border: 1px solid #6366F1;' />

                          <div class="formgrid grid">
                            <div class="field col-6 md:col-4">
                              <label for="name">Inicial:</label>
                              <InputNumber v-model="mudancaSelected.QUIINIMUD" :disabled="desabilitar" integeronly />
                              <!-- <small class="p-invalid" v-if="submitted && !dataInicial">Data Inicial é requerida.</small> -->
                            </div>

                            <div class="field col-6 md:col-4">
                              <label for="name">Final:</label>
                              <InputNumber v-model="mudancaSelected.QUIFINMUD" :disabled="desabilitar" @blur="calculaKmTotal" :class="{'p-invalid': erroKm}" />
                              <small class="p-error" v-if="erroKm">Corrija o valor</small>
                            </div>

                            <div class="field col-6 md:col-4">
                              <label for="name">Total Rodado:</label>
                              <InputNumber v-model="totalRodado" :disabled="desabilitar" />
                              <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="field col-12">
                        <label for="descricao">Observação</label>
                        <InputText v-model.trim="mudancaSelected.OBSMUD" :disabled="desabilitar" requerida="true" autofocus />
                      </div>
                    </div>
                  </div>
                </div>

              </TabPanel>

              <TabPanel header="Guarda Móveis">
                <div class="formgrid grid">
                  <div class="field col-6 md:col-4">
                    <label for="utilizaGuardaMoveis">Utiliza guarda móveis?</label>
                    <Dropdown id="vistoria" v-model="utilizaGuardaMoveis" :disabled="desabilitar" :options="opcoes" optionLabel="label" placeholder="Selecione" @change="changeUtilizaGuardaMoveis">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMCON">Vistoria é requerida.</small>
                  </div>
                </div>
                
                <div class="col-12 md:col-12">
                  <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                    
                    <Translate text="Valores" />

                    <hr  style='border: 1px solid #6366F1;' />

                    <div class="formgrid grid">
                      <div class="field col-6 md:col-4">
                        <label for="name">Valor:</label>
                        <InputNumber v-model="mudancaSelected.VALGMO" mode="currency" currency="BRL" locale="pt-BR" :disabled="utilizaGuardaMoveis.value == 'N'" />
                        <small class="p-invalid" v-if="submitted && !dataInicial">Data Inicial é requerida.</small>
                      </div>

                      <div class="field col-6 md:col-4">
                        <label for="name">Entrega:</label>
                        <Calendar v-model="horaInicial" dateFormat="dd/mm/yy" :disabled="utilizaGuardaMoveis.value == 'N'" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                      </div>
                    </div>
                
                    <div class="formgrid grid">
                      <div class="field col-12 md:col-4">
                        <label for="utilizaGuardaMoveis">Primeiro Mês Grátis?</label>
                        <Dropdown id="vistoria" v-model="primeiroMesGratis" :disabled="desabilitar" :options="opcoes" optionLabel="label" placeholder="Selecione" @change="changeUtilizaGuardaMoveis">
                          <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                              <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                            </div>
                            <span v-else>
                              {{slotProps.placeholder}}
                            </span>
                          </template>
                        </Dropdown>
                        <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMCON">Vistoria é requerida.</small>
                      </div>

                      <div class="field col-12 md:col-4">
                        <label for="utilizaGuardaMoveis">Valor a combinar?</label>
                        <Dropdown id="vistoria" v-model="valorACombinar" :disabled="desabilitar" :options="opcoes" optionLabel="label" placeholder="Selecione" @change="changeUtilizaGuardaMoveis">
                          <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                              <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                            </div>
                            <span v-else>
                              {{slotProps.placeholder}}
                            </span>
                          </template>
                        </Dropdown>
                        <small class="p-invalid" v-if="submitted && !entidadeSelected.NOMCON">Vistoria é requerida.</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-12 md:col-12">
                  <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                    
                    <Translate text="Período de Utilização" />

                    <hr  style='border: 1px solid #6366F1;' />

                    <div class="formgrid grid">
                      <div class="field col-6 md:col-4">
                        <label for="name">De:</label>
                        <Calendar v-model="this.dataInicioGuardaMoveis" dateFormat="dd/mm/yy" :disabled="utilizaGuardaMoveis.value == 'N'" />
                        <small class="p-invalid" v-if="submitted && !dataInicial">Data Inicial é requerida.</small>
                      </div>

                      <div class="field col-6 md:col-4">
                        <label for="name">Até:</label>
                        <Calendar v-model="this.dataFimGuardaMoveis" dateFormat="dd/mm/yy" :disabled="utilizaGuardaMoveis.value == 'N'" />
                        <small class="p-invalid" v-if="submitted && !horaInicial">Hora Inicial é requerida.</small>
                      </div>
                      <!-- <div class="field col-6 md:col-4">
                        <label for="name">Ação:</label>
                        <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="log" />
                      </div> -->
                    </div>
                
                    
                  </div>
                </div>

                <div class="col-12 md:col-12">
                  <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                    
                    <Translate text="Endereço de Entrega" />

                    <hr  style='border: 1px solid #6366F1;' />

                    <div class="formgrid grid">
                      <div class="field col-6 md:col-2">
                        <label for="cpf">CEP</label>
                        <InputText v-model.trim="mudancaSelected.CEPDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CEPORIMUD}" />
                      </div>
                      <!-- <div class="field col-6 md:col-2">
                          <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchCEPOrigem" />
                      </div> -->
                      <div class="field col-12 md:col-2">
                        <label for="estado">Estado</label>
                        <Dropdown id="estado" v-model="estadoDestino" :disabled="desabilitar" :options="estados" optionLabel="label" placeholder="Selecione" @change="onChange" >
                          <template #value="slotProps">
                            <div v-if="slotProps.value && slotProps.value.value">
                              <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.value}}</span>
                            </div>
                            <span v-else>
                              {{slotProps.placeholder}}
                            </span>
                          </template>
                        </Dropdown>

                      </div>
                    </div>
                    
                    <div class="formgrid grid">
                      <div class="field col-12 md:col-12">
                        <label for="cpf">Cidade</label>
                        <InputText v-model.trim="mudancaSelected.CIDDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CIDORIMUD}" />
                      </div>
                    </div>
                    
                    <div class="formgrid grid">
                      <div class="field col-12 md:col-12">
                        <label for="cpf">Bairro</label>
                        <InputText v-model.trim="mudancaSelected.BAIDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.BAIORIMUD}" />
                      </div>
                    </div>
                    
                    <div class="formgrid grid">
                      <div class="field col-12 md:col-12">
                        <label for="cpf">Logradouro</label>
                        <InputText v-model.trim="mudancaSelected.LOGDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.LOGORIMUD}" />
                      </div>
                    </div>
                    
                    <div class="formgrid grid">
                      <div class="field col-5 md:col-3">
                        <label for="cpf">Número</label>
                        <InputText v-model.trim="mudancaSelected.NUMDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.NUMORIMUD}" />
                      </div>
                      <div class="field col-7 md:col-9">
                        <label for="cpf">Complemento</label>
                        <InputText v-model.trim="mudancaSelected.COMDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.COMDESMUD}" maxlength="20"/>
                      </div>
                    </div>
                    
                    <div class="formgrid grid">
                      <div class="field col-12 md:col-12">
                        <label for="cpf">Referência</label>
                        <InputText v-model.trim="mudancaSelected.REFDESMUD" :disabled="desabilitar" requerida="true" autofocus :class="{'p-invalid': submitted && !mudancaSelected.REFDESMUD}" maxlength="250"/>
                      </div>
                    </div>
                  
                    
                  </div>
                </div>



              </TabPanel>

              <TabPanel header="Contato">
                <div class="col-12">
                  <div class="formgrid grid">
                    <div class="field col-12 md:col-12">
                      <label for="name">Informações do Contato</label>
                      <Textarea v-model.trim="mudancaSelected.INFMUD" :disabled="desabilitar" requerida="true" autofocus rows="20" />
                    </div>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Ajudantes">
                <div class="formgrid grid">
                  <div class="field col-12 md:col-4">
                    <label for="name">Selecione o funcionário:</label>
                    <Dropdown showClear filter v-model="ajudante" :options="funcionarios" :class="{'p-invalid': campoFuncionarioErro && !ajudante}" optionLabel="label" :disabled="desabilitar" placeholder="Selecione" @change="changeAjudante">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                      <template #emptyfilter>
                        Nenhum funcionário encontrado
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="campoFuncionarioErro && !ajudante">Campo obrigatório.</small>
                  </div>

                  <!-- <div class="field col-12 md:col-4">
                    <label for="name">Ou Digite o Nome:</label>
                    <InputText v-model.trim="mudancaSelected.REFORIMUD" :disabled="!campoFuncionarioErro && ajudante" :class="{'p-invalid': campoFuncionarioErro && !ajudante}" />
                    <small class="p-invalid" v-if="campoFuncionarioErro && !ajudante">Campo alternativo.</small>
                  </div> -->
                </div>
            
                <div class="formgrid grid">
                  <div class="field col-6 md:col-2">
                      <Button label="Adicionar" icon="pi pi-plus" class="p-button-info" style="margin-top: 15%;" @click="addAjudante" />
                  </div>
                </div>

                <div class="formgrid grid">
                  <div class="field col-12">
                    <DataTable :value="ajudantes" :paginator="true" class="p-datatable-gridlines" :rows="10" :rowHover="true" 
                          filterDisplay="menu" :loading="loadingDep" responsiveLayout="scroll" >
                      <template #empty>
                          Nenhum ajudante encontrado
                      </template>
                      <template #loading>
                          Carregando...
                      </template>

                      <Column field="CODFUN" header="Código">
                        <template #body="{data}">
                            {{data.CODFUN}}
                        </template>
                      </Column>

                      <Column field="NOMFUN" header="Nome" style="min-width:75%">
                        <template #body="{data}">
                            {{data.NOMFUN}}
                        </template>
                      </Column>
                      
                      <Column style="min-width:1rem; text-align: center;">
                        <template #body="props">
                          <Button icon="pi pi-times" v-tooltip.top="'Remover'" class="p-button-rounded p-button-danger mr-2" @click="removeAjudante(props.data)" />
                        </template>
                      </Column>

                    </DataTable>
                  </div>
                </div>


              </TabPanel>

              <TabPanel header="Pagamento">

                <div class="col-12 md:col-12">
                  <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                    
                    <Translate text="Pagamento" />

                    <hr  style='border: 1px solid #6366F1;' />

                    <div class="formgrid grid">
                      <div class="field col-12 md:col-4">
                        <label for="name">Condição:</label>
                        <Dropdown id="vistoria" v-model="condicaoPagamento" :options="condicoesPagamento" optionLabel="label" :disabled="desabilitar" placeholder="Selecione" @change="calculaParcelaMudanca()">
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
                        <label for="name">Forma:</label>
                        <Dropdown id="vistoria" v-model="formaPagamento" :options="formasPagamento" optionLabel="label" :disabled="desabilitar" placeholder="Selecione">
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
                        <label for="name">Tipo de Documento:</label>
                        <Dropdown id="vistoria" v-model="tipoDeDocumento" :options="tiposDeDocumento" optionLabel="label" :disabled="desabilitar" placeholder="Selecione">
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
                    </div>

                    <div class="formgrid grid">
                      <div class="field col-12 md:col-4">
                        <label for="name">Centro de Custo:</label>
                        <Dropdown id="vistoria" v-model="centroDeCusto" :options="centrosDeCusto" optionLabel="label" :disabled="desabilitar" placeholder="Selecione">
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
                        <label for="name">Tipo de Despesa:</label>
                        <Dropdown id="vistoria" v-model="tipoDeDespesa" :options="tiposDeDespesa" optionLabel="label" :disabled="desabilitar" placeholder="Selecione" @change="changeUtilizaGuardaMoveis">
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

                    </div>

                  </div>
                </div>

                <div class="formgrid grid">
                  <div class="field col-12">
                    <DataTable :value="pagamentos" :paginator="true" class="p-datatable-gridlines" :rows="10" :rowHover="true" 
                          filterDisplay="menu" :loading="loadingDep" responsiveLayout="scroll" >
                      <template #empty>
                          Nenhum pagamento encontrado
                      </template>
                      <template #loading>
                          Carregando...
                      </template>

                      <Column field="DIFPARCND" header="Data" style="min-width:12rem">
                        <template #body="{data}">
                            {{data.DIFPARCND}}
                        </template>
                      </Column>

                      <Column field="VALTOTMUD" header="Valor" style="min-width:12rem">
                        <template #body="{data}">
                            {{ data.VALTOTMUD.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }}
                        </template>
                      </Column>

                      
                    </DataTable>
                  </div>
                </div>

                <div class="col-12 md:col-12">
                  <div class="card col-12" style='border: 2px solid #6366F1; padding-top: 10px'>
                    
                    <Translate text="Valores" />

                    <hr  style='border: 1px solid #6366F1;' />

                    <div class="formgrid grid">
                      <div class="field col-6 md:col-4">
                        <label for="name">Acrescimo:</label>
                        <Dropdown id="vistoria" v-model="acrescimo" :options="opcoes" optionLabel="label" :disabled="desabilitar" placeholder="Selecione"  @change="changeAcrescimo">
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
                        <label for="name">Tipo:</label>
                        <Dropdown id="vistoria" v-model="tipoAcrescimo" :options="optionsTipoValor" optionLabel="label" placeholder="Selecione" :disabled="acrescimoDisabled">
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
                        <label for="name">Valor Acrescimo:</label>
                        <InputNumber v-if="tipoAcrescimo.value = 'V'" v-model="valorAcrescimo" mode="currency" currency="BRL" locale="pt-BR" :disabled="acrescimoDisabled" />
                        <InputNumber v-else v-model="mudancaSelected.VALACRMUD" locale="pt-BR" :disabled="acrescimoDisabled" />
                      </div>
                    </div>

                    <div class="formgrid grid">
                      <div class="field col-6 md:col-4">
                        <label for="name">Desconto:</label>
                        <Dropdown id="vistoria" v-model="desconto" :options="opcoes" optionLabel="label" :disabled="desabilitar" placeholder="Selecione" @change="changeDesconto">
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
                        <label for="name">Tipo:</label>
                        <Dropdown id="vistoria" v-model="tipoDesconto" :options="optionsTipoValor" optionLabel="label" placeholder="Selecione" :disabled="descontoDisabled">
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
                        <label for="name">Valor Desconto:</label>
                        <InputNumber v-if="tipoDesconto.value = 'V'" v-model="valorDesconto" mode="currency" currency="BRL" locale="pt-BR" :disabled="descontoDisabled"/>  
                        <InputNumber v-else v-model="valorDesconto" locale="pt-BR" :disabled="descontoDisabled"/>  
                      </div>
                    </div>

                    
                  </div>
                </div>

              </TabPanel>

              <TabPanel header="Avarias">
                <div class="col-12">
                  <div class="formgrid grid">
                    <div class="field col-12 md:col-12">
                      <label for="name">Informações das Avarias</label>
                      <Textarea v-model.trim="mudancaSelected.INFAVAMUD" :disabled="desabilitar" requerida="true" autofocus rows="20" maxlength="255"/>
                    </div>
                  </div>
                </div>
              </TabPanel>
              
            </TabView>
          </div>
        </div>
        <div class="formgrid grid">
          <div class="col-6 md:col-2">
            <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
          </div>
          <div class="col-6 md:col-3 lg:col-2">
            <Button label="Documentos" icon="pi pi-file" class="p-button-secondary" style="margin-top: 15%;" @click="openDocumentos" />
          </div>
          <div class="col-6 md:col-2">
            <Button :loading="loadingSave" label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
          </div>
          <div class="col-6 md:col-3 lg:col-2" v-if="statusMudanca == 'Orçamento'">
            <Button label="Salvar e Fechar" icon="pi pi-check" class="p-button bg-yellow-400 border-yellow-400" style="margin-top: 15%;" @click="fechar" />
          </div>
          <div class="col-6 md:col-2" v-if="statusMudanca == 'Mudança em Andamento' || statusMudanca == 'Mudança Fechada'">
            <Button label="Cancelar" icon="pi pi-times" class="p-button bg-red-500 border-red-500" style="margin-top: 15%;" @click="cancela" />
          </div>
          <div class="col-2" v-if="loading5">
            <ProgressSpinner style="height: 50px;" />
          </div>
        </div>
      </div>
	  </div>
	</div>
  
  <Dialog v-model:visible="cepConfirmDialog" :style="{width: '450px'}" header="Confirmação de CEP" :modal="true">
    
      <p>{{ endereco }}</p>
      <p>{{ bairro }}</p>
      <p>{{ cidade }} - {{ uf }}</p>
      <p><strong>O endereço</strong>  está correto?</p>
    
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="noConfirmCEP"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmCEP" />
    </template>
  </Dialog>
</template>

<script>
import ImpressaoDocumento from './ImpressaoDocumento.vue';
import CepService from '../../../service/CepService';
import MudancaService from '../../../service/mudanca/MudancaService';
import EntidadeService from '../../../service/EntidadeService';
import DependenteService from '../../../service/DependenteService';
import ConvenioService from '../../../service/ConvenioService';
import ModalidadeService from '../../../service/ModalidadeService';
import ApoliceService from '../../../service/ApoliceService';
import PremioService from '../../../service/PremioService';
import VeiculoService from '../../../service/logistica/VeiculoService';
import FuncionarioService from '../../../service/rh/FuncionarioService';
import HorarioVistoriaService from '../../../service/mudanca/HorarioVistoriaService';
import CargoService from '../../../service/CargoService';
// import GrauParentescoService from '../../../service/geral/GrauParentescoService';
import GrauInstrucaoService from '../../../service/GrauInstrucaoService';
import EstadoService from '../../../service/EstadoService';
import CondicaoPagamentoService from '../../../service/financeiro/CondicaoPagamentoService';
import FormaPagamentoService from '../../../service/financeiro/FormaPagamentoService';
import CentroCustoService from '../../../service/financeiro/CentroCustoService';
import TipoDocumentoService from '../../../service/financeiro/TipoDocumentoService';
import TipoDespesaService from '../../../service/financeiro/TipoDespesaService';
import { cpfMask, cepMask, telefoneMask } from '../../../defaults/mask';
import { toNumber } from '../../../defaults/number';
import { mapDropdownSearch } from '../../../defaults/map';
import moment from "moment";
moment.locale("pt-BR");
import Datepicker from '@vuepic/vue-datepicker';
import VueTimepicker from 'vue3-timepicker';

import '@vuepic/vue-datepicker/dist/main.css'

export default {
    props: ["entidade", "mudanca"],
    components:{
      ImpressaoDocumento
    },
    
    data() {
        return {
          movel: {
            IDX: -1,
            DESDMU: "",
            VALUNIDMU: "",
            QTDDMU: "",
            OBSDMU: ""
          },
          documentDialog: false,
          moveis: [],
          loading1: false,
          loading2: false,
          loading3: false,
          loading4: false,
          loading5: false,
          loading6: false,
          loading7: false,
          loadingSave: false,
          carregandoDados: false,
          loadingDep: false,
          erroKm: false,
          erroNum:{
            NUMORIMUD: false,
            NUMDESMUD: false
          },
          erroMovel: {
            DESDMU: false,
            QTDDMU: false
          },
          statusMudanca: "Orçamento",
          statusMudancaColor: "#CC0066",
          corIcone: "color: #FF0000;",
          dataInicioGuardaMoveis: "",
          dataFimGuardaMoveis: "",
          dataAtual: "",
          horaAtual: "",
          beneficios: [],
          horariosVistoria: [],
          horarioVistoria: {},
          entidadeSelected: {},
          mudancaSelected: {},
          dependenteSelected: {},
          horaInicial: null,
          horaFinal: null,
          quilometragemInicial: null,
          quilometragemFinal: null,
          totalRodado: null,
          dependenteIndex: null,
          dialogDependente: false,
          cepConfirmDialog: false,
          cepConfirm: true,
          calendar: null,
          tipo: null,
          typeSelected: null,
          subtypeSelected: null,
          endereco: null,
          bairro: null,
          cidade: null,
          uf: null,
          CodCnvDep: null,
          CodModDep: null,
          dia: 0,
          diaFormatado: 0,
          mes: 0,
          mesFormatado: 0,
          ano: 0,
          anoFormatado: 0,
          preco: 0,
          precoFormatado: 0,
          desabilitar: false,
          typeLabel: "",
          subtypeLabel: "",
          optionsBeneficio: [],
          optionsSubBeneficio: [],
          optionsBeneficioDep: [],
          optionsSubBeneficioDep: [],
          cargos: [],
          grausParentesco: [],
          grausInstrucao: [],
          estados: [],
          tipos: [
              { label: "Associação", value: "A" },
              { label: "Seguro", value: "S" },
          ],
          veiculo: {},
          veiculos: [],
          funcionario: {},
          funcionarios: [],
          periodo: { label: "Manhã", value: "M" },
          periodos: [
              { label: "Manhã", value: "M" },
              { label: "Tarde", value: "T" },
              { label: "Noite", value: "N" }
          ],
          tipoMudanca: { label: "Aproveitamento", value: "A" },
          tiposMudanca: [
              { label: "Exclusiva", value: "E" },
              { label: "Aproveitamento", value: "A" },
          ],
          tipoMudancaDisabled : true,
          convenio: { label: "Local", value: "L" },
          convenios: [
              { label: "Local", value: "L" },
              { label: "Viagem", value: "V" },
          ],
          vistoria: { label: "Não", value: "N" },
          utilizaGuardaMoveis: { label: "Não", value: "N" },
          opcoes: [
              { label: "Sim", value: "S" },
              { label: "Não", value: "N" },
          ],
          primeiroMesGratis: { label: "Não", value: "N" },
          valorACombinar: { label: "Não", value: "N" },
          dataApanha: "",
          dataEntrega: "",
          estadoOrigem: "",
          estadoDestino: "",
          convenioMudanca: {},
          conveniosMudanca: [
              { label: "Valor Fixo", value: "F" },
              { label: "Valor Hora", value: "H" },
          ],
          valor: 0,
          valorApr: 0,
          valorSeguro: 0,
          valorAssegurado: 0,
          valorEmbalamento: 0,
          valorIcamento: 0,
          valorTotal: 0,
          valorMudanca: 0,
          optionsSex: [
              { label: "Feminino", value: "F" },
              { label: "Masculino", value: "M" },
          ],
          optionsTipoValor: [
            { label: "Valor", value: "V" },
            { label: "Porcentagem", value: "P" },
          ],
          acrescimo: { label: "Não", value: "N" },
          acrescimoDisabled: true,
          desconto: { label: "Não", value: "N" },
          descontoDisabled: true,
          condicao: { label: "Não", value: "N" },
          forma: { label: "Não", value: "N" },
          tipoDeDespesa: null,
          tiposDeDespesa: [],
          valorAcrescimo: null,
          valorDesconto: null,
          tipoDesconto: { label: "Valor", value: "V" },
          tipoAcrescimo: { label: "Valor", value: "V" },
          ajudante: null,
          ajudantes: [],
          condicaoPagamento: null,
          condicoesPagamento: [],
          formaPagamento: null,
          formasPagamento: [],
          tipoDeDocumento: null,
          tiposDeDocumento: [],
          centroDeCusto: null,
          centrosDeCusto: [],
          condicaoPagamentoService: null,
          formaPagamentoService: null,
          centroCustoService: null,
          tipoDocumentoService: null,
          tipoDespesaService: null,
          // Validação
          campoFuncionarioErro: false,
          pagamentos: [],
          parcelas: [],
        };
    },
    entidadeService: null,
    horarioVistoriaService: null,
    dependenteService: null,
    mudancaService: null,
    veiculoService: null,
    funcionarioService: null,
    created() {
      this.carregandoDados = true;
      var currentDate = new Date()

      this.dataAtual = currentDate.toLocaleDateString()
      this.horaAtual = currentDate.toTimeString().substring(0,8)

      this.entidadeService = new EntidadeService();
      this.estadoService = new EstadoService();
      this.horarioVistoriaService = new HorarioVistoriaService();
      this.dependenteService = new DependenteService();
      this.mudancaService = new MudancaService();
      this.veiculoService = new VeiculoService();
      this.funcionarioService = new FuncionarioService();
      this.condicaoPagamentoService = new CondicaoPagamentoService();
      this.formaPagamentoService = new FormaPagamentoService();
      this.centroCustoService = new CentroCustoService();
      this.tipoDocumentoService = new TipoDocumentoService();
      this.tipoDespesaService = new TipoDespesaService();
      this.entidadeSelected = this.entidade;
      this.mudancaSelected = this.mudanca;
      console.log('this.mudanca :>> ', this.mudanca);
      console.log('this.entidade :>> ', this.entidade);
      console.log('this.mudancaSelected :>> ', this.mudancaSelected);

      if(this.entidadeSelected.DDDENT && this.entidadeSelected.TELENT && this.entidadeSelected.TELENT.length < 10){
        this.entidadeSelected.TELENT = telefoneMask(this.entidadeSelected.DDDENT.toString() + this.entidadeSelected.TELENT);
      }

      if(this.mudancaSelected.QUIINIMUD && this.mudancaSelected.QUIFINMUD){
        this.totalRodado = this.mudancaSelected.QUIFINMUD - this.mudancaSelected.QUIINIMUD;
      }

      this.estadoService.all()
        .then(
          (response) => {
            this.estados = [];
            if (response.length) {
              response.map(
                (entry) => this.estados.push({label : entry.SIGEST, value : entry.SIGEST})
              );

              
              if (this.mudancaSelected.ESTORIMUD){
                this.estadoOrigem = this.findEstado(this.mudancaSelected.ESTORIMUD);
              }
              if (this.mudancaSelected.ESTDESMUD){
                this.estadoDestino = this.findEstado(this.mudancaSelected.ESTDESMUD);
              }

            }
          }
        );

        this.veiculoService.all()
            .then(
              (response) => {
                this.veiculos = [];
                if (response.length) {
                  response.map(
                    (entry) => this.veiculos.push({label : entry.PLAVEI, value : entry.CODVEI})
                  );
                  this.veiculo = this.veiculos.find(veiculo => veiculo.value == this.mudanca.CODVEI);
                }
              }
            );

          this.funcionarioService.all()
            .then(
              (response) => {
                this.funcionarios = [];
                if (response.length) {
                  response.map(
                    (entry) => this.funcionarios.push({label : entry.NOMFUN, value : entry.CODFUN})
                  );
                  this.funcionario = this.funcionarios.find(funcionario => funcionario.value == this.mudanca.CODFUN);
                }
              }
            );

          // this.mudancaService.all().then((response)=>{
          //   if(response.length != 0){
          //       this.mudancaSelected = response;
          //       // this.editando = true;
          //       this.preencheDados(response);
          //   }


          // })

          this.condicaoPagamentoService.all().then((response)=>{
            console.log("reponse condicao pagamento", response);
            response.map(
              (entry) => this.condicoesPagamento.push({ label : entry.DESCND, value : entry.CODCND, QTDPARCND: entry.QTDPARCND, DIFPARCND: entry.DIFPARCND, TIPDIFCND: entry.TIPDIFCND })
              )
              this.condicaoPagamento = this.condicoesPagamento.find(condicaoPagamento => condicaoPagamento.value == this.mudanca.CODCND);
              if(this.condicaoPagamento != undefined){
                this.calculaParcelaMudanca();
              }
          });

          this.formaPagamentoService.all().then((response)=>{
            response.map(
              (entry) => this.formasPagamento.push({ label : entry.DESFPG, value : entry.CODFPG })
              )
              this.formaPagamento = this.formasPagamento.find(formaPagamento => formaPagamento.value == this.mudanca.CODFPG);
          });

          this.tipoDocumentoService.all().then((response)=>{
            response.map(
              (entry) => this.tiposDeDocumento.push({ label : entry.DESTIPDOC, value : entry.CODTIPDOC })
              )
              this.tipoDeDocumento = this.tiposDeDocumento.find(tipoDeDocumento => tipoDeDocumento.value == this.mudanca.CODTIPDOC);
          });

          this.centroCustoService.all().then((response)=>{
            response.map(
              (entry) => this.centrosDeCusto.push({ label : entry.DESCENCUS, value : entry.CODCENCUS })
              )
              this.centroDeCusto = this.centrosDeCusto.find(centroDeCusto => centroDeCusto.value == this.mudanca.CODCENCUS);
          });

          this.tipoDespesaService.all().then((response)=>{
            if(response){
              response.map(
                (entry) => this.tiposDeDespesa.push({ label : entry.DESTIPDES, value : entry.CODTIPDES })
              )
              this.tipoDeDespesa = this.tiposDeDespesa.find(tipoDeDespesa => tipoDeDespesa.value == this.mudanca.CODTIPDES);
            }
          });

      if (this.mudancaSelected.CANMUD == "S") {
        this.statusMudanca = "Mudança Cancelada"
        this.statusMudancaColor = "#FF0000"
        // this.desabilitar = true
      } 
      else {
        if (this.mudancaSelected.DATFINMUD != null) {
          this.statusMudanca = "Mudança Efetuada"
          this.statusMudancaColor = "#008000"
          // this.desabilitar = true
        }
        else if (this.mudancaSelected.DATINIMUD != null){
          this.statusMudanca = "Mudança em Andamento"
          this.statusMudancaColor = "#FFA500"
          // this.desabilitar = false
        }
        else if (this.mudancaSelected.DATFECMUD != null){
          this.statusMudanca = "Mudança Fechada"
          this.statusMudancaColor = "#eec137"
          // this.desabilitar = true
        }
        else {
          this.statusMudanca = "Orçamento"
          this.statusMudancaColor = "#800080"
          // this.desabilitar = false
        }
      }
      this.$parent.corBorda(this.statusMudancaColor);

      if (this.mudancaSelected.DATINIMUD) {
        this.mudancaSelected.DATINIMUD = moment(this.mudancaSelected.DATINIMUD).format("DD/MM/YYYY");
        // let data = new Date(this.mudancaSelected.DATINIMUD);
        // this.mudancaSelected.DATINIMUD = ((data.getUTCDate().toString().padStart(2, '0'))) + "/" + ((data.getUTCMonth() + 1).toString().padStart(2, '0')) + "/" + data.getUTCFullYear();
      }

      if (this.mudancaSelected.DATFINMUD) {
        this.mudancaSelected.DATFINMUD = moment(this.mudancaSelected.DATFINMUD).format("DD/MM/YYYY");
        // let data = new Date(this.mudancaSelected.DATFINMUD);
        // this.mudancaSelected.DATFINMUD = ((data.getUTCDate().toString().padStart(2, '0') )) + "/" + ((data.getUTCMonth() + 1).toString().padStart(2, '0')) + "/" + data.getUTCFullYear(); 
      }
      
      if (this.mudancaSelected.DATINIGMO) {
        let data = new Date(this.mudancaSelected.DATINIGMO);
        this.mudancaSelected.DATINIGMO = ((data.getUTCDate().toString().padStart(2, '0') )) + "/" + ((data.getUTCMonth() + 1).toString().padStart(2, '0')) + "/" + data.getUTCFullYear(); 
      }

      if (this.mudancaSelected.DATFINGMO) {
        let data = new Date(this.mudancaSelected.DATFINGMO);
        this.mudancaSelected.DATFINGMO = ((data.getUTCDate().toString().padStart(2, '0') )) + "/" + ((data.getUTCMonth() + 1).toString().padStart(2, '0')) + "/" + data.getUTCFullYear(); 
      }

      if (this.mudancaSelected.TIPMUD == "L") {
        this.convenio = { label: "Local", value: "L" }
      }
      else if (this.mudancaSelected.TIPMUD == "V") {
        this.convenio = { label: "Viagem", value: "V" }
      }

      if (this.mudancaSelected.EXCMUD == "S") {
        this.tipoMudanca = { label: "Exclusiva", value: "E" }
      }
      else if (this.mudancaSelected.EXCMUD == "N") {
        this.tipoMudanca = { label: "Aproveitamento", value: "A" }
      }
      
      if (this.mudancaSelected.TPGMUD == "F") {
        this.convenioMudanca = { label: "Valor Fixo", value: "F" }
      }
      else if (this.mudancaSelected.TPGMUD == "H") {
        this.convenioMudanca = { label: "Valor Hora", value: "H" }
      }
      if(this.mudancaSelected.moveis){
        this.moveis = this.mudancaSelected.moveis;
      }
      if(this.mudancaSelected.ajudantes){
        this.ajudantes = this.mudancaSelected.ajudantes;
      }

      this.utilizaGuardaMoveis = this.mudanca.UTIGMO == "S" ? {label: "Sim", value: "S"} : {label: "Não", value: "N"};
      this.primeiroMesGratis = this.mudanca.PMGGMO == "S" ? {label: "Sim", value: "S"} : {label: "Não", value: "N"};
      this.valorACombinar = this.mudanca.ACOVALGMO == "S" ? {label: "Sim", value: "S"} : {label: "Não", value: "N"};

      this.valorTotal = this.mudancaSelected.VALTOTMUD
      this.valor = this.mudancaSelected.VALMUD
      this.valorSeguro = this.mudancaSelected.VALSEGMUD
      this.valorApr = this.mudancaSelected.VALAPRMUD
      this.valorAssegurado = this.mudancaSelected.VALASSMUD
      this.valorIcamento = this.mudancaSelected.VALICAMUD
      this.valorEmbalamento = this.mudancaSelected.VALEMBMUD
      this.valorAcrescimo = this.mudancaSelected.VALACRMUD
      this.valorDesconto = this.mudancaSelected.VALDSCMUD
      this.quilometragemInicial = this.mudancaSelected.QUIINIMUD
      this.quilometragemFinal = this.mudancaSelected.QUIFINMUD
      // this.condicaoPagamento = this.mudancaSelected.CODCND
      this.formaPagamento = this.mudancaSelected.CODFPG
      this.tipoDeDocumento = this.mudancaSelected.CODTIPDOC
      this.centroDeCusto = this.mudancaSelected.CODCENCUS
      this.tipoDeDespesa = this.mudancaSelected.CODTIPDES
      this.dataApanha = this.mudancaSelected.DATAPAMUD ? moment(this.mudancaSelected.DATAPAMUD, true).format("DD/MM/YYYY") : null;
      // this.dataEntrega = this.mudancaSelected.DATENTMUD ? moment(this.mudancaSelected.DATENTMUD).format("DD/MM/YYYY") : null;
      // this.dataApanha = this.mudancaSelected.DATAPAMUD;
      console.log("dataapanha",typeof(this.dataApanha));
      this.dataEntrega = this.mudancaSelected.DATENTMUD ? moment(this.mudancaSelected.DATENTMUD).format("DD/MM/YYYY") : null;
      // this.dataInicioGuardaMoveis = this.mudancaSelected.DATINIGMO ? moment(this.mudancaSelected.DATINIGMO).format("DD/MM/YYYY") : null;
      this.dataInicioGuardaMoveis = this.mudancaSelected.DATINIGMO;
      // this.dataFimGuardaMoveis = this.mudancaSelected.DATFINGMO ? moment(this.mudancaSelected.DATFINGMO).format("DD/MM/YYYY") : null;
      this.dataFimGuardaMoveis = this.mudancaSelected.DATFINGMO;
      if (this.mudancaSelected.VISMUD) {
        if (this.mudancaSelected.VISMUD == "S") {
          this.vistoria = { label: "Sim", value: "S" }
        }
        else {
          this.vistoria = { label: "Não", value: "N" }
        }
      }

      this.acrescimo = this.mudancaSelected.VALACRMUD > 0 ? { label: "Sim", value: "S" } : { label: "Não", value: "N" }
      if (this.mudancaSelected.DATVISMUD) {
        this.dataVistoria = moment(this.mudancaSelected.DATVISMUD).format("DD/MM/YYYY")
        this.horarioVistoria = {}
        this.changeHorarioVistoria()
      }
      setTimeout(() => {
        this.carregandoDados = false;
      }, 2000);
    },

    watch: {
      acrescimo(novoValor) {
        if (novoValor.value == "N") {
          this.acrescimoDisabled = true;
        }
        else {
          this.acrescimoDisabled = false;
        }
      },

      desconto(valor){
      if (valor.value == "N") {
          this.descontoDisabled = true;
        }
        else {
          this.descontoDisabled = false;
        }
      },

      valorAcrescimo(valor){
        this.mudancaSelected.VALACRMUD = valor;
      },

      valorDesconto(valor){
        this.mudancaSelected.VALDSCMUD = valor;
      }
    },

    methods: {
        log(){
          console.log("DATINIGMO :>>", this.dataInicioGuardaMoveis);
          console.log("DATFINGMO :>> ", this.dataFimGuardaMoveis);
          console.log("DATFINGMO :>> ", typeof(this.dataFimGuardaMoveis));
          if(this.dataInicioGuardaMoveis.length > 10){
            console.log("moment DATFINGMO :>> ", moment(this.dataInicioGuardaMoveis).format('DD/MM/YYYY'));
          }
          if(typeof(this.dataFimGuardaMoveis) != "string"){
            console.log("moment DATFINGMO :>> ", moment(this.dataFimGuardaMoveis).format('DD/MM/YYYY'));
          }
        },

        naoNuloNaoVazio(valor){
          return valor != null && valor != "";
        },

        validaNum(){
          if(this.mudancaSelected.NUMORIMUD && this.mudancaSelected.NUMORIMUD != ""){
            // this.erroNum["NUMORIMUD"] = true;
            this.erroNum["NUMORIMUD"] = ((/[a-zA-Z]/.test(this.mudancaSelected.NUMORIMUD)) && !(/\d/.test(this.mudancaSelected.NUMORIMUD)));
            if(this.erroNum["NUMORIMUD"]){
              this.$toast.add({ severity: "error", summary: "Erro", detail: "Verifique os campos de número nos endereços!", life: 3000 })
            }
          }else{
            this.erroNum["NUMORIMUD"] = false;
          }
          if(this.mudancaSelected.NUMDESMUD && this.mudancaSelected.NUMDESMUD != ""){
            // this.erroNum["NUMDESMUD"] = true;
            this.erroNum["NUMDESMUD"] = ((/[a-zA-Z]/.test(this.mudancaSelected.NUMDESMUD)) && !(/\d/.test(this.mudancaSelected.NUMDESMUD)));
            if(this.erroNum["NUMDESMUD"]){
              this.$toast.add({ severity: "error", summary: "Erro", detail: "Verifique os campos de número nos endereços!", life: 3000 })
            }
          }else{
            this.erroNum["NUMDESMUD"] = false;
          }
        },

        calculaKmTotal(ev){
          // console.log("ev",ev.originalEvent.explicitOriginalTarget.value)
          if(this.mudancaSelected.QUIFINMUD != 0 &&  this.mudancaSelected.QUIINIMUD != 0){
            if(this.mudancaSelected.QUIFINMUD <= this.mudancaSelected.QUIINIMUD){
              this.erroKm = true;
              this.$toast.add({ severity: "error", summary: "Erro", detail: "Km final deve ser maior que o Km inicial!", life: 3000 })
            }else{
              this.erroKm = false;
              this.totalRodado = this.mudancaSelected.QUIFINMUD - this.mudancaSelected.QUIINIMUD;
            }
          }
        },

        formataTELENT(ev){
          this.entidadeSelected.TELENT = telefoneMask(ev.target.value);
          ev.target.value = telefoneMask(ev.target.value);
        },

        formataCELENT(ev){
          this.entidadeSelected.CELENT = telefoneMask(ev.target.value);
          ev.target.value = telefoneMask(ev.target.value);
        },

        addAjudante(){
          if(this.ajudante){
            let verificaAjudante = this.ajudantes.find(ajud => ajud.CODFUN === this.ajudante.value);
            if(!verificaAjudante){
              this.campoFuncionarioErro = false;
              this.ajudantes.push({NOMFUN: this.ajudante.label, CODFUN: this.ajudante.value});
              this.ajudante = null;
            }else{
              this.$toast.add({ severity: "error", summary: "Erro", detail: "Ajudante já adicionado", life: 3000 })
            }
          }else{
            this.$toast.add({ severity: "error", summary: "Erro", detail: "Selecione um funcionário!", life: 3000 })
            this.campoFuncionarioErro = true;
          }
        },

        removeAjudante(ajudante){
          this.ajudantes.splice(this.ajudantes.indexOf(ajudante), 1);
        },

        openDocumentos(){
          this.documentDialog = true;
        },

        addBeneficy() {
            this.beneficios.push({
                label: this.typeLabel,
                options: [],
                value: null
            });
        },

        addMovel() {
          this.erroMovel.DESDMU = !this.naoNuloNaoVazio(this.movel.DESDMU);
          this.erroMovel.QTDDMU = !this.naoNuloNaoVazio(this.movel.QTDDMU);
          if(!this.erroMovel.DESDMU && !this.erroMovel.QTDDMU){
            this.moveis.push({
              "DESDMU": this.movel.DESDMU,
              "VALUNIDMU": this.movel.VALUNIDMU,
              "QTDDMU": this.movel.QTDDMU,
              "OBSDMU": this.movel.OBSDMU
            })
            this.limpaCamposMovel();
          }else{
            this.$toast.add({ severity: "error", summary: "Erro", detail: "Alguns campos devem ser preenchidos", life: 3000 });
          }
        },

        limpaCamposMovel(){
          this.movel.DESDMU = "";
          this.movel.VALUNIDMU = null;
          this.movel.QTDDMU = "";
          this.movel.OBSDMU = "";
        },

        editMovel(props) {
          let movelEdit = this.moveis[props.index];
          this.movel.IDX = props.index;
          this.movel.DESDMU = movelEdit.DESDMU;
          this.movel.VALUNIDMU = movelEdit.VALUNIDMU;
          this.movel.QTDDMU = movelEdit.QTDDMU;
          this.movel.OBSDMU = movelEdit.OBSDMU;
        },

        alteraMovel(){
          let index = this.movel.IDX
          this.moveis[index].DESDMU = this.movel.DESDMU;
          this.moveis[index].VALUNIDMU = this.movel.VALUNIDMU;
          this.moveis[index].QTDDMU = this.movel.QTDDMU;
          this.moveis[index].OBSDMU = this.movel.OBSDMU;

          this.movel.IDX = -1;
          this.limpaCamposMovel();
        },

        removeMovel(props){
          this.moveis = this.moveis.filter(movel => movel != props.data)
          this.limpaCamposMovel();
        },

        formatDate(value) {
          // return value.substr(8, 2) + "/" + 
          //       value.substr(5, 2) + "/" + 
          //       value.substr(0, 4)
          if(typeof(value) != "string") {
            value = moment(value).format("DD/MM/YYYY");
          }
          else{
            return value;
          }

        },

        removeBeneficy(index) {
            this.beneficios.splice(index, 1);
        },

        calculaTotal() {
          let valorTotal = 0
          if (this.valor && this.convenioMudanca.value == "F") {
            valorTotal += this.valor
          }
          if (this.valorSeguro) {
            valorTotal += this.valorSeguro
          }
          if (this.valorEmbalamento) {
            valorTotal += this.valorEmbalamento
          }
          if (this.valorIcamento) {
            valorTotal += this.valorIcamento
          }

          this.valorTotal = valorTotal
        },
        changeConvenioMudanca() {
          console.log(this.convenioMudanca.value)
          this.calculaTotal()
        },

        changeConvenio() {
          if (this.convenio.value == "L") {
            this.tipoMudanca = { label: "Aproveitamento", value: "A" }
            this.tipoMudancaDisabled = true
          }
          else {
            this.tipoMudancaDisabled = false
          }
        },

        changeAcrescimo() {
          // console.log("Entrou no changeAcrescimo")
          // if (this.acrescimo.value == "N") {
          //   this.acrescimoDisabled = true
          // }
          // else {
          //   this.acrescimoDisabled = false
          // }
        },

        changeDesconto() {
          // console.log("Entrou no changeDesconto")
          // if (this.desconto.value == "N") {
          //   this.descontoDisabled = true
          // }
          // else {
          //   this.descontoDisabled = false
          // }
        },

        changeType() {
            this.optionsBeneficio = [];
            this.optionsSubBeneficio = [];
            this.loading1 = false;
            this.loading2 = false;
            if (this.tipo.value == "A") {
                this.loading1 = true;
                this.typeLabel = "Convênio";
                (new ConvenioService()).all()
                    .then((response) => response.map((entry) => this.optionsBeneficio.push({ label: entry.DESCNV, value: entry.CODCNV })))
                    .finally(() => {
                    this.loading1 = false;
                    this.beneficios = [];
                    this.addBeneficy();
                });
            }
            else if (this.tipo.value == "S") {
                this.loading1 = true;
                this.typeLabel = "Apólice";
                (new ApoliceService()).all()
                    .then((response) => response.map((entry) => this.optionsBeneficio.push({ label: entry.NUMAPO, value: entry.NUMAPO })))
                    .finally(() => {
                    this.loading1 = false;
                    this.beneficios = [];
                    this.addBeneficy();
                });
            }
        },

        changeSubtype(index) {
            let options = [];
            if (this.tipo.value == "A") {
                this.beneficios[index].loading = true;
                this.subtypeLabel = "Modalidade";
                (new ModalidadeService()).all(this.beneficios[index].value.value)
                    .then((response) => response.map((entry) => options.push({ label: entry.DESMOD, value: entry.CODMOD, start: entry.DATINIASS })))
                    .finally(() => {
                    this.beneficios[index].loading = false;
                    this.beneficios[index].options = options;
                    this.beneficios[index].calendar = moment(this.beneficios[index].value.start).format("01/MM/YYYY");
                });
            }
            else if (this.tipo.value == "S") {
                this.beneficios[index].loading = true;
                this.subtypeLabel = "Prêmio";
                (new PremioService()).all(this.typeSelected.value)
                    .then((response) => response.map((entry) => this.optionsSubBeneficio.push({ label: entry.DESPRE, value: entry.CODPRE })))
                    .finally(() => {
                    this.beneficios[index].loading = false;
                });
            }
        },
        async changeCnvDep() {
            this.optionsSubBeneficioDep = [];
            this.loading7 = true;
            const response = await (new ModalidadeService()).all(this.CodCnvDep.value);
            response.map((entry) => this.optionsSubBeneficioDep.push({ label: entry.DESMOD, value: entry.CODMOD }));
            this.loading7 = false;
        },
        // async changeUtilizaGuardaMoveis() {
          
        //   if (this.utilizaGuardaMoveis == { label: "Sim", value: "S" }) {
        //     this.mudancaSelected.UTIGMO = "S";
        //   }
        //   else {
        //     // this.utilizaGuardaMoveis = { label: "Não", value: "N" }
        //     this.mudancaSelected.UTIGMO = "N";
        //   }
        // },        
        onKeyUpCpf(ev) {
            this.entidadeSelected.CPFCON = cpfMask(ev.target.value);
        },
        onKeyUpCpfDep(ev) {
            this.dependenteSelected.CPFDEP = cpfMask(ev.target.value);
        },
        onKeyUpCep(ev) {
            this.entidadeSelected.CEPENDCON = cepMask(ev.target.value);
        },
        formatSalario() {
            this.entidadeSelected.SALCON = new Intl.NumberFormat("pt-BR", { style: "decimal", minimumFractionDigits: 2 }).format(this.entidadeSelected.SALCON);
        },
        searchCpf() {
            this.loading4 = true;
            this.contatoService.search("cpf", this.entidadeSelected.CPFCON)
                .then(response => {
                if (response[0]) {
                    this.entidadeSelected = response[0];
                }
                else {
                    this.$toast.add({ severity: "error", summary: "Erro", detail: "CPF não encontrado", life: 3000 });
                }
            })
                .finally(() => {
                this.loading4 = false;
            });
        },
        searchCEPOrigem() {
            this.loading3 = true;
            this.cepConfirm = true;
            (new CepService()).get(this.mudancaSelected.CEPORIMUD)
                .then(response => {
                this.mudancaSelected.LOGORIMUD = this.endereco = response.dados[0].logradouroDNEC;
                this.mudancaSelected.BAIORIMUD = this.bairro = response.dados[0].bairro;
                this.mudancaSelected.CIDORIMUD = this.cidade = response.dados[0].localidade;
                this.mudancaSelected.ESTORIMUD = this.uf = response.dados[0].uf;
                this.estadoOrigem = this.findEstado(this.mudancaSelected.ESTORIMUD);
            })
                .finally(() => {
                this.loading3 = false;
                this.openConfirmCEP();
            });
        },
        searchCEPDestino() {
            this.loading6 = true;
            this.cepConfirm = true;
            (new CepService()).get(this.mudancaSelected.CEPDESMUD)
                .then(response => {
                this.mudancaSelected.LOGDESMUD = this.endereco = response.dados[0].logradouroDNEC;
                this.mudancaSelected.BAIDESMUD = this.bairro = response.dados[0].bairro;
                this.mudancaSelected.CIDDESMUD = this.cidade = response.dados[0].localidade;
                this.mudancaSelected.ESTDESMUD = this.uf = response.dados[0].uf;
                this.estadoDestino = this.findEstado(this.mudancaSelected.ESTDESMUD);
            })
                .finally(() => {
                this.loading6 = false;
                this.openConfirmCEP();
            });
        },
        searchCEP() {
            this.loading3 = true;
            this.cepConfirm = true;
            (new CepService()).get(this.entidadeSelected.CEPENDCON)
                .then(response => {
                this.entidadeSelected.NOMLOG = this.endereco = response.dados[0].logradouroDNEC;
                this.entidadeSelected.DESBAI = this.bairro = response.dados[0].bairro;
                this.entidadeSelected.DESCID = this.cidade = response.dados[0].localidade;
                this.entidadeSelected.SIGEST = this.uf = response.dados[0].uf;
                this.entidadeSelected.SIGEST = mapDropdownSearch(this.estados, this.entidadeSelected.SIGEST);
            })
                .finally(() => {
                this.loading3 = false;
                this.openConfirmCEP();
            });
        },
        openConfirmCEP() {
            this.cepConfirmDialog = true;
        },
        noConfirmCEP() {
          this.cepConfirmDialog = false;
          this.cepConfirm = false;
          this.endereco = "";
          this.bairro = "";
          this.cidade = "";
          this.uf = "";
        },
        confirmCEP() {
            this.cepConfirmDialog = false;
            this.cepConfirm = true;
            this.endereco = "";
            this.bairro = "";
            this.cidade = "";
            this.uf = "";
            // this.estadoOrigem = null;
        },
        async openDependenteDialog() {
            this.dialogDependente = true;
            this.dependenteSelected = {};
            if (this.beneficios.length > 0) {
                this.CodCnvDep = this.beneficios[0].value;
                await this.changeCnvDep();
                this.CodModDep = this.beneficios[0].subValue;
            }
        },
        closeDependenteDialog() {
            this.dialogDependente = false;
        },
        changeHorarioVistoria() {
          let nummud = null
          let datvis = null
          if (this.mudancaSelected && this.mudancaSelected.NUMMUD) {
            nummud = this.mudancaSelected.NUMMUD
          }

          if (this.dataVistoria) {
            datvis = moment(this.dataVistoria).format("DD/MM/YYYY");
          }
          if (datvis == "Invalid date") {
            datvis = this.dataVistoria;
          }

          this.horarioVistoriaService.allFree(nummud, datvis).then(response => {
            this.horariosVistoria = [];
            if (response.length) {
              response.map(
                (entry) => this.horariosVistoria.push({label : entry.HORINI, value : entry.CODVIS})
              );

              if (this.mudancaSelected && this.mudancaSelected.HORVISMUD && this.mudancaSelected.HORVISMUD > 0) {
                this.horarioVistoria = this.findHorarioVistoria(this.mudancaSelected.HORVISMUD)
              }
            }
          });
        },

        temLetraMasNaoNumero(valor){
          return ((/[a-zA-Z]/.test(valor)) && !(/\d/.test(valor)));
        },

        validaMudanca(){
          console.log(this.mudancaSelected.QUIFINMUD, this.mudancaSelected.QUIINIMUD);
          // if(this.mudancaSelected.QUIINIMUD != null && this.mudancaSelected.QUIFINMUD >= 0 && this.mudancaSelected.QUIFINMUD != null && this.mudancaSelected.QUIFINMUD != ""){
          if((this.mudancaSelected.QUIINIMUD != null && this.mudancaSelected.QUIFINMUD != null) && (this.mudancaSelected.QUIINIMUD >= 0 || this.mudancaSelected.QUIFINMUD >= 0)){
            if(this.mudancaSelected.QUIFINMUD < this.mudancaSelected.QUIINIMUD){
              this.loadingSave = false;
              this.erroKm = true;
              this.$toast.add({ severity: "error", summary: "Erro", detail: "Km final deve ser maior que o Km inicial!", life: 3000 })
              return false;
            }else{
              this.totalRodado = this.mudancaSelected.QUIFINMUD - this.mudancaSelected.QUIINIMUD;
              this.erroKm = false;
            }
          }

          if(this.mudancaSelected.NUMORIMUD && (this.mudancaSelected.NUMORIMUD != "" && this.mudancaSelected.NUMORIMUD != null)){
            // this.erroNum["NUMORIMUD"] = ((/[a-zA-Z]/.test(this.mudancaSelected.NUMDESMUD)) && !(/\d/.test(this.mudancaSelected.NUMDESMUD)));
            this.erroNum["NUMORIMUD"] = this.temLetraMasNaoNumero(this.mudancaSelected.NUMORIMUD);
          }else{
            this.erroNum["NUMORIMUD"] = false;
          }

          if(this.mudancaSelected.NUMDESMUD && (this.mudancaSelected.NUMDESMUD != "" && this.mudancaSelected.NUMDESMUD != null)){
            // this.erroNum["NUMDESMUD"] = ((/[a-zA-Z]/.test(this.mudancaSelected.NUMDESMUD)) && !(/\d/.test(this.mudancaSelected.NUMDESMUD)));
            this.erroNum["NUMDESMUD"] = this.temLetraMasNaoNumero(this.mudancaSelected.NUMDESMUD);
          }else{
            this.erroNum["NUMDESMUD"] = false;
          }

          if(this.erroNum["NUMORIMUD"] || this.erroNum["NUMDESMUD"]){
            this.$toast.add({ severity: "error", summary: "Erro", detail: "Verifique os campos de número nos endereços!", life: 3000 })
          }else{
            return true;
          }
        },

        async save() {

          // Caso a mudança não seja válida, não prossegue com o save
          if(!this.validaMudanca()) return;

            let data = this.mudancaSelected;
            this.loadingSave = true;

            data.CODEMP = this.entidadeSelected.CODEMP;
            data.ANOMUD = new Date().getFullYear();

            if(this.entidadeSelected.TELENT) {
              this.entidadeSelected.TELENT = this.entidadeSelected.TELENT.replace(/\D/g, '');
              this.entidadeSelected.DDDENT = this.entidadeSelected.TELENT.slice(0, 2);
              this.entidadeSelected.TELENT = this.entidadeSelected.TELENT.slice(2);
            }

            if (this.entidadeSelected.NUMMUD) {
              data.NUMMUD = this.entidadeSelected.NUMMUD;
            }

            data.CODENT = this.entidadeSelected.CODENT;
            data.EXCMUD = "";
            if (this.tipoMudanca.value == "A"){
              data.EXCMUD = "N";
            }
            else if (this.tipoMudanca.value == "E"){
              data.EXCMUD = "S";
            }
            this.veiculo ? data.CODVEI = this.veiculo.value : "";
            this.funcionario ? data.CODFUN = this.funcionario.value : "";
            this.mudancaSelected.QTDPERMUD ? data.QTDPERMUD = this.mudancaSelected.QTDPERMUD : "";

            this.mudancaSelected.ACOVALGMO = this.valorACombinar ? this.valorACombinar.value : null;

            data.DATINIMUD = this.mudancaSelected.DATINIMUD != null && this.mudancaSelected.DATINIMUD != "Invalid date" ? this.mudancaSelected.DATINIMUD : "";
            if (typeof(data.DATINIMUD) != "string") {
              data.DATINIMUD = moment(this.mudancaSelected.DATINIMUD).format("DD/MM/YYYY");
            }
            data.DATFINMUD = this.mudancaSelected.DATFINMUD != null && this.mudancaSelected.DATFINMUD != "Invalid date" ? this.mudancaSelected.DATFINMUD : "";
            if (typeof(data.DATFINMUD) != "string") {
              data.DATFINMUD = moment(this.mudancaSelected.DATFINMUD).format("DD/MM/YYYY");
            }
            data.TIPMUD = this.convenio.value;
            data.UTIGMO = this.utilizaGuardaMoveis.value;
            //data.calendar = this.calendar;
            // data.TPGMUD = this.convenioMudanca.value;
            this.convenioMudanca? data.TPGMUD = this.convenioMudanca.value : null;
            data.ESTORIMUD = this.estadoOrigem ? this.estadoOrigem.value : null;
            data.ESTDESMUD = this.estadoDestino ? this.estadoDestino.value : null;
            data.VALTOTMUD = this.valorTotal;
            data.VALMUD = this.valor;
            data.VALSEGMUD = this.valorSeguro;
            data.VALAPRMUD = this.valorApr;
            data.VALASSMUD = this.valorAssegurado;
            data.VALEMBMUD = this.valorEmbalamento;
            data.VALICAMUD = this.valorIcamento;
            data.DATORCMUD = this.dataAtual;
            data.HORORCMUD = this.horaAtual;
            data.DATVISMUD = this.dataVistoria;
            data.CODCND = this.condicaoPagamento?.value;
            data.CODFPG = this.formaPagamento?.value;
            data.CODTIPDOC = this.tipoDeDocumento?.value;
            data.CODCENCUS = this.centroDeCusto?.value;
            data.CODTIPDES = this.tipoDeDespesa?.value;
            if (data.DATVISMUD && data.DATVISMUD.length > 10) {
              data.DATVISMUD = moment(this.dataVistoria).format("DD/MM/YYYY");
            }
            data.DATAPAMUD = this.dataApanha;
            data.PMGGMO = this.primeiroMesGratis.value;
            data.DATENTMUD = this.dataEntrega;
            data.DATINIGMO = this.dataInicioGuardaMoveis != null && this.dataInicioGuardaMoveis != "Invalid date" ? this.dataInicioGuardaMoveis : "";
            if (typeof(data.DATINIGMO) != "string") {
              data.DATINIGMO = moment(this.dataInicioGuardaMoveis).format("DD/MM/YYYY");
            }
            data.DATFINGMO = this.dataFimGuardaMoveis != null && this.dataFimGuardaMoveis != "Invalid date" ? this.dataFimGuardaMoveis : "";
            if (typeof(data.DATFINGMO) != "string") {
              data.DATFINGMO = moment(this.dataFimGuardaMoveis).format("DD/MM/YYYY");
            }
            data.HORVISMUD = this.horarioVistoria?.value;
            data.VISMUD = this.vistoria.value;
            data.MOVEIS = this.moveis;
            data.AJUDANTES = this.ajudantes;
            this.loading5 = true;
            console.log('data :>> ', data);
            // const response = await this.mudancaService.update(data);

            const response = await this.mudancaService.store(data);
            this.loading5 = false;
            this.loadingSave = false;
            if (response[0] == 1) {
              this.$toast.add({ severity: "success", summary: "Sucesso", detail: this.mudancaSelected.ANOMUD + "/" + this.mudancaSelected.NUMMUD + " salvo com sucesso", life: 3000 });

              if (response.errors) {
                  response.errors.map((error) => this.$toast.add({ severity: "error", summary: "Erro", detail: error }));
              }
              if (response.success) {
                  response.success.map((msg) => this.$toast.add({ severity: "success", summary: "Sucesso", detail: msg, life: 3000 }));
              }

              // this.$parent.back(2);
            }
            else {
              if(response){
                this.$toast.add({ severity: "success", summary: "Sucesso", detail: this.mudancaSelected.ANOMUD + "/" + this.mudancaSelected.NUMMUD + " salvo com sucesso", life: 3000 });
              }else{
                this.$toast.add({ severity: "error", summary: "Erro", detail: "Mudança não salva", life: 3000 });
              }
              // this.$parent.back(2);
            }
        },

        async cancela(){
          let data = this.mudancaSelected;
          const response = await this.mudancaService.cancela(data);
          console.log("mudanca cancelada",response);
          if (response[0] == 1) {
            this.$toast.add({ severity: "success", summary: "Sucesso", detail: "Mudança cancelada com sucesso", life: 4000 });
            // this.$parent.back(2);
          }
          else{
            this.$toast.add({ severity: "error", summary: "Erro", detail: "Mudança não foi cancelada", life: 4000 });
          }
        },

        async fechar(){
          this.mudancaSelected.DATFECMUD = moment(new Date()).format("DD/MM/YYYY");
          console.log("Data fechamento", this.mudancaSelected.DATFECMUD);
          await this.save();
        },

        back() {
            this.$parent.back(2);
        },
        findHorarioVistoria(id) {
//          console.log("findHorarioVistoria: " + id);
//          console.log(this.horariosVistoria)
          let _horarioVistoria;
          this.horariosVistoria.map(
            (horarioVistoria) => {
//              console.log("1")
//              console.log(horarioVistoria)
//              console.log("2")
              if (horarioVistoria.value == id) {
                _horarioVistoria = horarioVistoria;
              }
            }
          );

          return _horarioVistoria;
        },
        findEstado(id) {
          let _estado;
          this.estados.map(
            (estado) => {
              if (estado.value === id) {
                _estado = estado;
              }
            }
          );
          console.log('_estado :>> ', _estado);
          return _estado;
        },

        preencheDados(dados){
          this.mudancaSelected = dados[0];
        },

        calculaParcelaMudanca(){
          console.log("Entrou no calculaValorMudança", this.condicaoPagamento);
          this.mudancaSelected.VALTOTMUD = this.valorTotal;
          let data = new Date();
          this.dia = data.getUTCDate().toString().padStart(2, '0');
          this.diaFormatado = parseInt(this.dia);
          this.mes = (data.getUTCMonth() + 1).toString().padStart(2, '0');
          this.mesFormatado = parseInt(this.mes);
          this.ano = data.getUTCFullYear();
          this.anoFormatado = parseInt(this.ano);
          this.preco = this.mudancaSelected.VALTOTMUD/this.condicaoPagamento.QTDPARCND;
          this.precoFormatado = parseFloat(this.preco.toFixed(2));
          if (this.pagamentos != null){
            this.pagamentos = [];
          }
          if (this.condicaoPagamento.TIPDIFCND == "M" || this.condicaoPagamento.TIPDIFCND == "m"){
            for (let i = 0; i < this.condicaoPagamento.QTDPARCND; i++) {
              // const element = array[i];
              if (this.mesFormatado < 10){
                this.pagamentos.push({DIFPARCND: data.getUTCDate().toString().padStart(2, '0') + "/" + "0" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              else{
                this.pagamentos.push({DIFPARCND: data.getUTCDate().toString().padStart(2, '0') + "/" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              // console.log("array pagamentos", this.pagamentos);
              // console.log("condicaoPagamento.DIFPARCND", this.condicaoPagamento.DIFPARCND);
              // console.log("condicaoPagamento.DIFPARCND", this.condicoesPagamento);
              this.mesFormatado = this.mesFormatado + this.condicaoPagamento.DIFPARCND;
              if (this.mesFormatado > 12) {
                this.mesFormatado = 1 + (this.mesFormatado - 13);
                this.anoFormatado = this.anoFormatado + 1;
              }
            }
          }
          else if (this.condicaoPagamento.TIPDIFCND == "D" || this.condicaoPagamento.TIPDIFCND == "d"){
            for (let i = 0; i < this.condicaoPagamento.QTDPARCND; i++) {
              // const element = array[i];
              if (this.mesFormatado < 10 && this.diaFormatado < 10){
                this.pagamentos.push({DIFPARCND: "0" + this.diaFormatado + "/" + "0" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              else if (this.mesFormatado < 10 && this.diaFormatado > 9){
                this.pagamentos.push({DIFPARCND: this.diaFormatado + "/" + "0" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              else if (this.mesFormatado > 9 && this.diaFormatado < 10){
                this.pagamentos.push({DIFPARCND: "0" + this.diaFormatado + "/" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              else {
                this.pagamentos.push({DIFPARCND: this.diaFormatado + "/" + this.mesFormatado + "/" + this.anoFormatado, VALTOTMUD: this.precoFormatado});
              }
              // console.log("array pagamentos", this.pagamentos);
              // console.log("condicaoPagamento.DIFPARCND", this.condicaoPagamento.DIFPARCND);
              // console.log("condicaoPagamento.DIFPARCND", this.condicoesPagamento);
              this.diaFormatado = this.diaFormatado + this.condicaoPagamento.DIFPARCND;
              if (this.mesFormatado == "1" || this.mesFormatado == "3" || this.mesFormatado == "5" || this.mesFormatado == "7" || this.mesFormatado == "8" || this.mesFormatado == "10" || this.mesFormatado == "12"){

                if (this.diaFormatado > 31) {
                  this.diaFormatado = 1 + (this.diaFormatado - 32);
                  this.mesFormatado = this.mesFormatado + 1;
                }
              }
              else if (this.mesFormatado == "2"){
                if (this.diaFormatado > 28) {
                  this.diaFormatado = 1 + (this.diaFormatado - 29);
                  this.mesFormatado = this.mesFormatado + 1;
                }
              }
              else {
                if (this.diaFormatado > 30) {
                  this.diaFormatado = 1 + (this.diaFormatado - 31);
                  this.mesFormatado = this.mesFormatado + 1;
                }
              }
            }
          }
          // this.pagamentos = [];
          
        },
    }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
.carrega{
  background-color: rgba( 0, 0, 0, 0.4);
  min-height: 100%;
  min-width: 100%;
  z-index: 99;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
}

</style>