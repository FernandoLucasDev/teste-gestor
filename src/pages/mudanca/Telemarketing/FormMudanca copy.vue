<template>
	<div class="grid">
	  <div class="col-12">
      <div class="p-fluid">
        <div class="formgrid grid">
          <div class="field col-3 sm-12">
            <label for="tipoDocumento">Tipo</label>
            <Dropdown id="tipoDocumento" v-model="tipo" :options="tipos" optionLabel="label" placeholder="Selecione" @change="changeType">
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
          <div class="field col-3" v-if="tipo">
            <Button label="Adicionar" icon="pi pi-plus" class="p-button-info" style="margin-top: 10%;" @click="addBeneficy()" />
          </div>
        </div>

        <div v-if="loading1">
          <ProgressSpinner style="height: 50px;" />
        </div>

        <div v-if="beneficios.length">
          <div v-for="(beneficio, index) in beneficios" v-bind:key="index">
            <div class="formgrid grid">
              <div class="field col-4" v-if="!loading1 && optionsBeneficio.length">
                <label>{{ beneficio.label }}</label>
                <Dropdown v-model="beneficios[index].value" :options="optionsBeneficio" optionLabel="label" placeholder="Selecione" @change="changeSubtype(index)">
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

              <div class="field col-4" v-if="!beneficio.loading && beneficio.options.length">
                <label>{{ subtypeLabel }}</label>
                <Dropdown v-model="beneficios[index].subValue" :options="beneficio.options" optionLabel="label" placeholder="Selecione">
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
              <div v-else-if="beneficio.loading">
                <ProgressSpinner style="height: 50px;" />
              </div>
              <div class="field col-2">
                <label>Ano/Mês</label>
                <Calendar view="month" dateFormat="MM 'de' yy" v-model="beneficios[index].calendar" />
              </div>
              <div class="field col-1">
                <Button label="" icon="pi pi-trash" class="p-button-danger" style="margin-top: 20%;" @click="removeBeneficy(index)" />
              </div>
            </div>              
            <div class="formgrid grid">
              <div class="field col-12">
                <hr />
              </div>          
            </div>
          </div>
        </div>

        

        <div class="formgrid grid">
          <div class="field col-6">
            <label for="tipoDocumento"><Translate text="Entidade" /></label>
            <EntidadeBox :selected="entidade" />
          </div>                  
        </div>

        <div class="formgrid grid">
          <div class="col-12">
            <TabView v-if="contatoSelected">
              <TabPanel header="Orçamento">
                <div class="formgrid grid">
                  <div class="field col-3">
                    <label for="name">Mudança</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-3">
                    <label for="name">Convênio</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-3">
                    <label for="name">Data</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-3">
                    <label for="name">Hora</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>
                
                <div class="formgrid grid">
                  <div class="field col-4">
                    <label for="name">Vistoria?</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-4">
                    <label for="name">Data Vistoria:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-4">
                    <label for="name">Horarios Disponíveis:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col-6">
                    <label for="name">Data de Apanha:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Data de Entrega:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>
                <div class="formgrid grid">
                  <div class="field col-2">
                    <label for="name">Convênio</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-2">
                    <label for="name">Valor</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-2">
                    <label for="name">Valor apr</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-2">
                    <label for="name">Seguro</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-2">
                    <label for="name">Valor Assegurado</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>
              </TabPanel>

              <TabPanel header="Cliente">
                <div class="formgrid grid">
                  <div class="field col-12">
                    <label for="name">Cliente:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Telefone:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Celular:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">E-mail:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">CPF:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">CEP:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Estado:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Cidade:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Bairro:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">LOgradouro:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Nùmero:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Complemento:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                  <div class="field col-6">
                    <label for="name">Referência:</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>               
              </TabPanel>

              <TabPanel header="Geral">
                <div class="formgrid grid">
                  <div class="field col-12">
                    <label for="name">Nome</label>
                    <InputText v-model.trim="contatoSelected.NOMCON" required="true" autofocus :class="{'p-invalid': submitted && !contatoSelected.NOMCON}" />
                    <small class="p-invalid" v-if="submitted && !contatoSelected.NOMCON">Name is required.</small>
                  </div>
                </div>

                <div class="formgrid grid">
                  <div class="field col-3">
                    <label for="cpf">CPF</label>
                    <InputText v-model.trim="contatoSelected.CPFCON" autofocus @input="onKeyUpCpf" @blur="searchCpf" maxlength="14" />
                  </div>
                  <div v-if="loading4"  class="field col-3">
                    <ProgressSpinner style="height: 30px; margin-top : 20%" />
                  </div>
                </div>                
                
                <div class="formgrid grid">
                  <div class="field col-2">
                    <label for="cpf">Data de Nascimento</label>
                    <Calendar v-model="contatoSelected.DATNASCON" dateFormat="dd/mm/yy" />
                  </div>

                  <div class="field col-3">
                    <label>Sexo</label>
                    <Dropdown v-model="contatoSelected.SEXCON" :options="optionsSex" optionLabel="label" placeholder="Selecione">
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
                  <div class="field col-12">
                    <label for="name">Nome da mãe</label>
                    <InputText v-model.trim="contatoSelected.NOMMAECON" />
                  </div>
                </div>
                
                <div class="formgrid grid">
                  <div class="field col-12">
                    <label for="name">E-mail</label>
                    <InputText v-model.trim="contatoSelected.EMACON" />
                  </div>
                </div>

                <div class="formgrid grid">
                  <div class="field col-3">
                    <label for="name">Telefone</label>
                    <InputText v-model.trim="contatoSelected.TELCON" />
                  </div>
                  <div class="field col-3">
                    <label for="name">Celular</label>
                    <InputText v-model.trim="contatoSelected.CELCON" />
                  </div>
                  <div class="field col-4">
                    <label for="name">Salário</label>
                    <InputText v-model.trim="contatoSelected.SALCON" @input="changeSalario" />
                  </div>
                  <div class="field col-2">
                    <label for="name">Data de admissão</label>
                    <Calendar v-model.trim="contatoSelected.DATADMCON" dateFormat="dd/mm/yy" />
                  </div>
                </div>
                
                <div class="formgrid grid">
                  <div class="field col-6">
                    <label for="tipoDocumento">Cargo</label>
                    <Dropdown id="tipoDocumento" v-model="contatoSelected.CODCAR" :options="cargos" optionLabel="label" placeholder="Selecione">
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
                  <div class="field col-3">
                    <label for="tipoDocumento">CEP</label>
                    <InputText v-model.trim="contatoSelected.CEPENDCON" @inupt="onKeyUpCep" />
                  </div>
                  <div class="field col-2">
                    <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchCEP" />
                  </div>
                </div>
                <div v-if="loading3">
                  <div class="formgrid grid">
                    <div class="col-12">
                      <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
                    </div>          
                  </div>          
                </div>
                <div v-else class="formgrid grid">
                  <div class="field col-3" v-if="endereco && bairro && cidade && uf && cepConfirm">
                    {{ endereco }}<br />
                    {{ bairro }}<br />
                    {{ cidade }} - {{ uf }}<br />
                  </div>
                  <div class="field col-12" v-if="!cepConfirm">
                    <label for="tipoDocumento">Logradouro</label>
                    <InputText v-model.trim="contatoSelected.NOMLOG" />
                  </div>                  
                  <div class="field col-3" v-if="endereco">
                    <label for="tipoDocumento">Número</label>
                    <InputText v-model.trim="contatoSelected.NUMENDCON" />
                  </div>
                  <div class="field col-3" v-if="endereco">
                    <label for="tipoDocumento">Complemento</label>
                    <InputText v-model.trim="contatoSelected.COMENDCON" />
                  </div>
                  <div class="field col-6" v-if="!cepConfirm">
                    <label for="tipoDocumento">Bairro</label>
                    <InputText v-model.trim="contatoSelected.DESBAI" />
                  </div>
                  <div class="field col-6" v-if="!cepConfirm">
                    <label for="tipoDocumento">Cidade</label>
                    <InputText v-model.trim="contatoSelected.DESCID" />
                  </div>
                  <div class="field col-2" v-if="!cepConfirm">
                    <label for="tipoDocumento">Estado</label>
                    <Dropdown id="tipoDocumento" v-model="contatoSelected.SIGEST" :options="estados" optionLabel="label" placeholder="Selecione">
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
                  <div class="field col-12">
                    <label for="name">Observações</label>
                    <Textarea v-model.trim="contatoSelected.OBSCON" rows="5" />
                  </div>
                </div>

              </TabPanel>
              <TabPanel header="Dependentes">
                <DataTable :value="contatoSelected.dependentes" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true" 
                      v-model:filters="filters1" filterDisplay="menu" :loading="loadingDep" responsiveLayout="scroll"
                      :globalFilterFields="['NOMDEP']">
                  
                  <template #header>
                    <div class="flex justify-content-between flex-column sm:flex-row"> 
                      <Button type="button" icon="pi pi-plus" label="Criar novo" class="p-button-outlined mb-6" @click="openDependenteDialog" />
                      <span class="p-input-icon-left mb-2"></span>
                    </div>
                  </template>
                  <template #empty>
                      Nenhum dependente encontrado
                  </template>
                  <template #loading>
                      Carregando...
                  </template>

                  <Column field="NOMDEP" header="Nome" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.NOMDEP}}
                    </template>
                    <template #filter="{filterModel}">
                        <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name"/>
                    </template>
                  </Column>
                  <Column field="associacao" header="Associado" style="min-width:12rem">
                    <template #body="{data}">
                      <div v-if="data.associacao">
                        <Chip label="Associado" />
                      </div>                        
                    </template>
                  </Column>

                  <Column headerStyle="min-width:10rem; width:10rem;">
                    <template #body="props">
                      <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDependente(props)" />
                    </template>
                  </Column>
                </DataTable>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div class="formgrid grid">
          <div class="col-3">
            <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
          </div>
          <div class="col-3">
            <Button label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
          </div>
          <div class="col-3" v-if="loading5">
            <ProgressSpinner style="height: 50px;" />
          </div>
        </div>
      </div>
	  </div>
	</div>

  <Dialog v-model:visible="dialogDependente" :style="{width: '70%'}" header="Detalhes do Dependente" :modal="true" class="p-fluid">
    <div v-if="loading1">						
      <Skeleton width="30rem" class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
      <Skeleton width="30rem" class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
      <Skeleton width="30rem" class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
      <Skeleton width="20rem" class="mb-2"></Skeleton>
      <Skeleton width="5rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton width="5rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton width="5rem" class="mb-2"></Skeleton>
      <Skeleton height=".5rem"></Skeleton>
    </div>
    <div v-else>			
      <div class="formgrid grid">
        <div class="field col-6" v-if="!loading6 && optionsBeneficioDep.length">
          <label>Convênio</label>
          <Dropdown v-model="CodCnvDep" :options="optionsBeneficioDep" optionLabel="label" placeholder="Selecione" @change="changeCnvDep">
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
        <div v-else-if="loading6">
          <ProgressSpinner style="height: 50px;" />
        </div>

        <div class="field col-6" v-if="!loading7 && optionsSubBeneficioDep.length">
          <label>Modalidade</label>
          <Dropdown v-model="CodModDep" :options="optionsSubBeneficioDep" optionLabel="label" placeholder="Selecione">
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
        <div v-else-if="loading7">
          <ProgressSpinner style="height: 50px;" />
        </div>
      </div>

      <div class="formgrid">
        <div class="field">
          <label for="name">Nome</label>
          <InputText v-model.trim="dependenteSelected.NOMDEP" required="true" autofocus :class="{'p-invalid': submitted && !dependenteSelected.NOMENT}" />
          <small class="p-invalid" v-if="submitted && !dependenteSelected.NOMENT">Name is required.</small>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col-3">
          <label for="cpf">CPF</label>
          <InputText v-model.trim="dependenteSelected.CPFDEP" autofocus @input="onKeyUpCpfDep" @blur="searchCpf" maxlength="14" />
        </div>
        <div v-if="loading4"  class="field col-3">
          <ProgressSpinner style="height: 30px; margin-top : 20%" />
        </div>
        <div class="field col-2">
          <label for="cpf">Data de Nascimento</label>
          <Calendar v-model="dependenteSelected.DATNASDEP" dateFormat="dd/mm/yy" />
        </div>
        <div class="field col-3">
          <label>Sexo</label>
          <Dropdown v-model="dependenteSelected.SEXDEP" :options="optionsSex" optionLabel="label" placeholder="Selecione">
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
        <div class="field col-12">
          <label for="name">Nome da mãe</label>
          <InputText v-model.trim="dependenteSelected.NOMMAEDEP" />
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col-6">
          <label for="tipoDocumento">Grau de parentesco</label>
          <Dropdown id="tipoDocumento" v-model="dependenteSelected.CODGRAPAR" :options="grausParentesco" optionLabel="label" placeholder="Selecione">
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
          <label for="tipoDocumento">Grau de instrução</label>
          <Dropdown id="tipoDocumento" v-model="dependenteSelected.CODGRAINS" :options="grausInstrucao" optionLabel="label" placeholder="Selecione">
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
        <div class="field col-12">
          <label for="name">Observações</label>
          <Textarea v-model.trim="dependenteSelected.OBSDEP" rows="5" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="closeDependenteDialog"/>
      <Button label="Remover" icon="pi pi-trash" class="p-button-danger" @click="confirmDeleteDependente" />      
      <Button label="Salvar" icon="pi pi-check" class="p-button-success" @click="saveDependente" /> 
    </template>			
  </Dialog>

  <Dialog v-model:visible="deleteDependenteDialog" :style="{width: '450px'}" header="Confirmação de exclusão" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="dependente">Deseja realmente excluir o associado <b>{{dependente.NOMDEP}}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDependenteDialog = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteDependente" />
    </template>
  </Dialog>
  
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
import CepService from '../../../service/CepService';
import ProcessamentoEmpregadoService from '../../../service/ProcessamentoEmpregadoService';
import ContatoService from '../../../service/ContatoService';
import DependenteService from '../../../service/DependenteService';
import ConvenioService from '../../../service/ConvenioService';
import ModalidadeService from '../../../service/ModalidadeService';
import ApoliceService from '../../../service/ApoliceService';
import PremioService from '../../../service/PremioService';
import CargoService from '../../../service/CargoService';
import GrauParentescoService from '../../../service/GrauParentescoService';
import GrauInstrucaoService from '../../../service/GrauInstrucaoService';
import EstadoService from '../../../service/EstadoService';
import { cpfMask, cepMask } from '../../../defaults/mask';
import { toNumber } from '../../../defaults/number';
import { mapDropdownSearch } from '../../../defaults/map';
import moment from "moment";

export default {
  props : ["contato", "dependente"],
	data() {
		return {
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loadingDep : false,
      beneficios : [],
      contatoSelected : {},
      dependenteSelected : {},
      dependenteIndex : null,
      dialogDependente : false,
      deleteDependenteDialog : false,
      cepConfirmDialog : false,
      cepConfirm : true,
      calendar : null,
      tipo : null,
      typeSelected : null,
      subtypeSelected : null,
      endereco : null,
      entidade : null,   
      bairro : null,
      cidade : null,
      uf : null,
      CodCnvDep : null,
      CodModDep : null,
      typeLabel : "",
      subtypeLabel : "",
      optionsBeneficio : [],
      optionsSubBeneficio : [],
      optionsBeneficioDep : [],
      optionsSubBeneficioDep : [],
      cargos : [], 
      grausParentesco : [],      
      grausInstrucao : [],  
      estados: []    ,
      tipos : [
				{label : 'Associação', value : "A"},
				{label : 'Seguro', value : "S"},
			],
      optionsSex : [
				{label : 'Feminino', value : "F"},
				{label : 'Masculino', value : "M"},
			],
    }
	},
  contatoService : null,
  dependenteService : null,
  service : null,
  mounted() {
    this.contatoService = new ContatoService();
    this.dependenteService = new DependenteService();
    this.service = new ProcessamentoEmpregadoService();

    this.contatoSelected = this.contato;

    if (this.contatoSelected.CPFCON) {
      this.contatoSelected.CPFCON = cpfMask(this.contatoSelected.CPFCON.toString());
    }

    if (this.contatoSelected.DATNASCON) {
      this.contatoSelected.DATNASCON = moment(this.contatoSelected.DATNASCON).format("DD/MM/YYYY");      
    }

    if (this.contatoSelected.DATADMCON) {
      this.contatoSelected.DATADMCON = moment(this.contatoSelected.DATADMCON).format("DD/MM/YYYY");      
    }

    if (this.contatoSelected.SEXCON) {
      this.contatoSelected.SEXCON = mapDropdownSearch(this.optionsSex, this.contatoSelected.SEXCON);
    }

    if (this.contatoSelected.SALCON) {
      this.formatSalario();
    }

    if (this.contatoSelected.NOMLOG) {
      this.endereco = this.contatoSelected.NOMLOG;
    }
    
    if (this.contatoSelected.DESBAI) {
      this.bairro = this.contatoSelected.DESBAI;
    }
    
    if (this.contatoSelected.DESCID) {
      this.cidade = this.contatoSelected.DESCID;
    }
    
    if (this.contatoSelected.SIGEST) {
      this.uf = this.contatoSelected.SIGEST;
    }

    // Load Cargos    
    (new CargoService()).all()
    .then(
      (response) => {
        this.cargos = [];
        if (response.length) {
          response.map(
            (entry) => this.cargos.push({label : entry.DESCAR, value : entry.CODCAR})
          );

          if (this.contatoSelected.CODCAR) {
            this.contatoSelected.CODCAR = mapDropdownSearch(this.cargos, this.contatoSelected.CODCAR);
          }
        }
      }      
    );

    (new GrauParentescoService()).all()
    .then(
      (response) => {
        this.grausParentesco = [];
        if (response.length) {
          response.map(
            (entry) => this.grausParentesco.push({label : entry.DESGRAPAR, value : entry.CODGRAPAR})
          );
        }
      }
    );
    
    (new GrauInstrucaoService()).all()
    .then(
      (response) => {
        this.grausParentesco = [];
        if (response.length) {
          response.map(
            (entry) => this.grausInstrucao.push({label : entry.DESGRAINS, value : entry.CODGRAINS})
          );
        }
      }
    );

    (new EstadoService()).all()
    .then(
      (response) => {
        this.estados = [];
        if (response.length) {
          response.map(
            (entry) => this.estados.push({label : entry.SIGEST, value : entry.SIGEST})
          );
        }
      }
    );

    this.loading6 = true;

    (new ConvenioService()).all()
    .then(
      (response) => response.map(
        (entry) => this.optionsBeneficioDep.push({label : entry.DESCNV, value : entry.CODCNV})
      )
    )
    .finally(() => {
      this.loading6 = false;
    });

    if (this.contatoSelected.CODENT) {
      this.entidade = {
        value : this.contatoSelected.CODENT,
        label : this.contatoSelected.entidade.NOMENT,
      };
    }

    if (this.dependente) {
      this.editDependente(this.dependente);
    }
  },
  methods : {
    addBeneficy() {
      this.beneficios.push({
        label : this.typeLabel,
        options : [],
        value : null
      });
    },
    removeBeneficy(index) {
      this.beneficios.splice(index, 1);
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
        .then(
          (response) => response.map(
            (entry) => this.optionsBeneficio.push({label : entry.DESCNV, value : entry.CODCNV})
          )
        )
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
        .then(
          (response) => response.map(
            (entry) => this.optionsBeneficio.push({label : entry.NUMAPO, value : entry.NUMAPO})
          )
        )
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
        .then(
          (response) => response.map(
            (entry) => options.push({label: entry.DESMOD, value : entry.CODMOD, start : entry.DATINIASS})
          )
        )
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
        .then(
          (response) => response.map(
            (entry) => this.optionsSubBeneficio.push({label: entry.DESPRE, value : entry.CODPRE})
          )
        )
        .finally(() => {
          this.beneficios[index].loading = false;
        });
      }
    },
    
    async changeCnvDep() {
      this.optionsSubBeneficioDep = [];      

      this.loading7 = true;

      const response = await (new ModalidadeService()).all(this.CodCnvDep.value);

      response.map(
        (entry) => this.optionsSubBeneficioDep.push({label: entry.DESMOD, value : entry.CODMOD})
      );
      
      this.loading7 = false;      
    },

    changeSalario(ev) {
      this.contatoSelected.SALCON = parseFloat(ev.target.value.replace(/\,/g, "").replace(/\./g, "") / 100);
      this.formatSalario();
    },

    onKeyUpCpf(ev) {
      this.contatoSelected.CPFCON = cpfMask(ev.target.value);
    },
    
    onKeyUpCpfDep(ev) {
      this.dependenteSelected.CPFDEP = cpfMask(ev.target.value);
    },

    onKeyUpCep(ev) {
      this.contatoSelected.CEPENDCON = cepMask(ev.target.value);
    },

    formatSalario() {
      this.contatoSelected.SALCON = new Intl.NumberFormat('pt-BR', { style : "decimal", minimumFractionDigits : 2 }).format( this.contatoSelected.SALCON );
    },

    searchCpf() {
      this.loading4 = true;
      this.contatoService.search("cpf", this.contatoSelected.CPFCON)
      .then(response => {
        if (response[0]) 
        {
          this.contatoSelected = response[0];
        }   
        else {
          this.$toast.add({severity:'error', summary: 'Erro', detail: 'CPF não encontrado', life: 3000});
        }     
      })
      .finally(() => {
        this.loading4 = false;
      });
    },

    searchCEP() {
      this.loading3 = true;
      this.cepConfirm = true;

      (new CepService()).get(this.contatoSelected.CEPENDCON)
      .then(response => {
        this.contatoSelected.NOMLOG = this.endereco = response.dados[0].logradouroDNEC;
        this.contatoSelected.DESBAI = this.bairro = response.dados[0].bairro;
        this.contatoSelected.DESCID = this.cidade = response.dados[0].localidade;
        this.contatoSelected.SIGEST = this.uf = response.dados[0].uf;
        this.contatoSelected.SIGEST = mapDropdownSearch(this.estados, this.contatoSelected.SIGEST)
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
    },
    confirmCEP() {
      this.cepConfirmDialog = false;
      this.cepConfirm = true;
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

    editDependente(entry) {      
      this.dependenteIndex = entry.index;      

      this.dependenteService.get(
        this.contatoSelected.CODENT, 
        this.contatoSelected.CODCON,
        entry.data.CODDEP
      )
      .then(
        response => this.loadDependente(response)
      )
      .finally(() => {
        this.dialogDependente = true
      });
    },

    confirmDeleteDependente() {
      this.deleteDependenteDialog = true;      
    },

    loadDependentes() {
      this.dependenteService.all(
        this.contatoSelected.CODENT, 
        this.contatoSelected.CODCON,
      )
      .then(response => this.contatoSelected.dependentes = response);
    },

    loadDependente(data) {
      this.dependenteSelected = data;
      if (this.dependenteSelected.DATNASDEP) {
        this.dependenteSelected.DATNASDEP = moment(this.dependenteSelected.DATNASDEP).format("DD/MM/YYYY");
      }

      if (this.dependenteSelected.SEXDEP) {
        this.dependenteSelected.SEXDEP = mapDropdownSearch(this.optionsSex, this.dependenteSelected.SEXDEP);
      }

      if (this.dependenteSelected.CODGRAPAR) {
        this.dependenteSelected.CODGRAPAR = mapDropdownSearch(this.grausParentesco, this.dependenteSelected.CODGRAPAR);
      }
      
      if (this.dependenteSelected.CODGRAINS) {
        this.dependenteSelected.CODGRAINS = mapDropdownSearch(this.grausInstrucao, this.dependenteSelected.CODGRAINS);
      }

      if (this.dependenteSelected.associacao) {
        if (this.dependenteSelected.associacao.CODCNV && this.dependenteSelected.associacao.convenio) {
          this.CodCnvDep = {value : this.dependenteSelected.associacao.CODCNV, label : this.dependenteSelected.associacao.convenio.DESCNV};
          if (this.dependenteSelected.associacao.CODMOD && this.dependenteSelected.associacao.modalidade) {
            
            this.changeCnvDep()
            .then(() => {
              this.CodModDep = {value : this.dependenteSelected.associacao.CODMOD, label : this.dependenteSelected.associacao.modalidade.DESMOD};
            });
          }
        }
      }
    },

    async saveDependente() {
      this.dependenteSelected.CODENT = this.contatoSelected.CODENT;
      this.dependenteSelected.CODCON = this.contatoSelected.CODCON;

      if (this.dependenteSelected.SEXDEP) {
        this.dependenteSelected.SEXDEP = this.dependenteSelected.SEXDEP.value;
      }

      if (!this.dependenteSelected.CODDEP) {
        this.dependenteIndex++;
        this.contatoSelected.dependentes.push(this.dependenteSelected);
      }

      if (this.CodCnvDep) {
        this.contatoSelected.dependentes[this.dependenteIndex].CODCNV = this.CodCnvDep.value;
      }
      if (this.CodModDep) {
        this.contatoSelected.dependentes[this.dependenteIndex].CODMOD = this.CodModDep.value;
      }

      this.dialogDependente = false;
    },

    deleteDependente() {
      this.contatoSelected.dependentes[this.dependenteIndex].disabled = true;
      this.deleteDependenteDialog = false;
      this.saveDependente();
    },

    async save() {
      let data = this.contatoSelected;
      data.beneficios = this.beneficios;

      if (data.beneficios.length == 0) {
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.typeLabel, life: 3000});
      }
      else {
        let canContinue = true;
        data.beneficios.map(
          (entry) => {
            if (!entry.value) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.typeLabel, life: 3000});
              canContinue = false;
            }
            else if (!entry.subValue) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.subtypeLabel, life: 3000});
              canContinue = false;
            }
            else if (!entry.calendar) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um início', life: 3000});
              canContinue = false;
            }
          }
        );

        if (!canContinue) return;
      }

      data.tipo = this.tipo.value;
      //data.calendar = this.calendar;
           
      data.CODENT = this.entidade.value;

      if (data.SEXCON) {
        data.SEXCON = data.SEXCON.value;
      }
      if (data.CODCAR) {
        data.CODCAR = data.CODCAR.value;
      }
      if(data.SIGEST) {
        data.SIGEST = data.SIGEST.value;
      }

      if (data.SALCON) {
        data.SALCON = toNumber(data.SALCON);
      }

      this.loading5 = true;      

      const response = await this.service.send(data);
      
      this.loading5 = false;

      if (response[0] == 1) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: this.contatoSelected.NOMCON + ' salvo com sucesso'});

        if (response.errors) {
          response.errors.map(
            (error) => this.$toast.add({severity:'error', summary: 'Erro', detail: error})
          );
        }
        if (response.success) {
          response.success.map(
            (msg) => this.$toast.add({severity:'success', summary: 'Sucesso', detail: msg})
          );
        }
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Contato não salvo', life: 3000});
			}
    },

    back() {
      this.$parent.back();
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>