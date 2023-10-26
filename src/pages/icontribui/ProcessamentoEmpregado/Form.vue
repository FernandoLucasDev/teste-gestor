<template>
	<div class="grid">
	  <div class="col-12">
      <div class="p-fluid">
        <div class="formgrid grid">
          <div class="field col-3">
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
            <EntidadeBox :selected="entidade" v-model="entidade" />
          </div>                  
        </div>

        <div class="formgrid grid">
          <div class="col-12">
            <TabView v-if="contatoSelected">
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
                    <InputText id="CON" v-model.trim="contatoSelected.CPFCON" autofocus @input="onKeyUpCpf" @blur="searchCpf('C')" maxlength="14" />
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
                    <Calendar v-model="contatoSelected.DATADMCON" dateFormat="dd/mm/yy" />
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
                    <InputText v-model.trim="contatoSelected.CEPENDCON" @input="onKeyUpCep" />
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
          <InputText id="DEP" v-model.trim="dependenteSelected.CPFDEP" autofocus @input="onKeyUpCpf" @blur="searchCpf('D')" maxlength="14" />
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
          <InputText v-model.trim="dependenteSelected.MAEDEP" />
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
      <Button v-if="!dependenteSelected.CODDEP" label="Adicionar" icon="pi pi-check" class="p-button-success" @click="saveDependente" /> 
      <Button v-if="dependenteSelected.CODDEP" label="Alterar" icon="pi pi-check" class="p-button-warning" @click="saveDependente" /> 
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
import AssociacaoDependenteService from '../../../service/AssociacaoDependenteService';
import ContatoService from '../../../service/ContatoService';
import DependenteService from '../../../service/DependenteService';
import ConvenioService from '../../../service/ConvenioService';
import ModalidadeService from '../../../service/ModalidadeService';
import ApoliceService from '../../../service/ApoliceService';
import PremioService from '../../../service/PremioService';
import CargoService from '../../../service/CargoService';
import GrauParentescoService from '../../../service/geral/GrauParentescoService';
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
    // console.log('this.contato :>> ', this.contato);

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
          // this.beneficios = [];
          if(this.contatoSelected.associacao.length > 0){
            this.beneficios = [{
                label : this.typeLabel,
                options : [],
                value : this.typeLabel ? this.contatoSelected.associacao.CODCNV: this.contatoSelected.associacao.CODSEG
              }];
          }else{
            this.beneficios = [];
            this.addBeneficy();
          }
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
      if(ev.target.id == "CON"){
          this.contatoSelected.CPFCON = cpfMask(ev.target.value);
      }
      if(ev.target.id == "DEP"){
        this.dependenteSelected.CPFDEP = cpfMask(ev.target.value);
      }
    },

    onKeyUpCep(ev) {
      // console.log('this.contatoSelected.CEPENDCON :>> ', this.contatoSelected.CEPENDCON);
      this.contatoSelected.CEPENDCON = cepMask(ev.target.value);
    },

    formatSalario() {
      this.contatoSelected.SALCON = new Intl.NumberFormat('pt-BR', { style : "decimal", minimumFractionDigits : 2 }).format( this.contatoSelected.SALCON );
    },

    searchCpf(selected) {
      this.loading4 = true;
      if(selected == "C"){
        if(this.contatoSelected.CPFCON[0] == "0"){
          let cpf = this.contatoSelected.CPFCON;
          cpf = cpf.split('')
          while(cpf[0] == "0"){
            cpf.shift();
          }
          this.contatoSelected.CPFCON = cpf.join('');
        }
        this.contatoService.search(this.contatoSelected.CPFCON, '')
        .then(response => {
          // console.log('response.data :>> ', response.data);
          if (response.data.length > 0) 
          {
            this.loadContato(response.data[0])
          }   
          else {
            // console.log("Aquiii");
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'CPF não encontrado', life: 3000});
          }     
        })
        .finally(() => {
          this.loading4 = false;
        });
      }else{
        this.dependenteService.search("cpf", this.dependenteSelected.CPFDEP)
        .then(response => {
          if (response.data.length > 0) 
          {
            this.loadDependente(response.data[0])
          }   
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'CPF não encontrado', life: 3000});
          }     
        })
        .finally(() => {
          this.loading4 = false;
        });
      }
    },

    searchCEP() {
      this.loading3 = true;
      this.cepConfirm = true;
      // (new CepService()).get(this.contatoSelected.CEPENDCON.replace(/(\D)/ , ""))
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

    loadContato(data){
      this.contatoSelected = data;
      if (data.CPFCON) {
        this.contatoSelected.CPFCON = cpfMask(data.CPFCON.toString());
      }

      if (data.DATNASCON) {
        this.contatoSelected.DATNASCON = moment(data.DATNASCON).format("DD/MM/YYYY");      
      }

      if (data.DATADMCON) {
        this.contatoSelected.DATADMCON = moment(data.DATADMCON).format("DD/MM/YYYY");      
      }

      if (data.SEXCON) {
        this.contatoSelected.SEXCON = mapDropdownSearch(this.optionsSex, data.SEXCON);
      }

      if (data.SALCON) {
        this.formatSalario();
      }

      if (data.NOMLOG) {
        this.endereco = this.contatoSelected.NOMLOG;
      }
      
      if (data.DESBAI) {
        this.bairro = this.contatoSelected.DESBAI;
      }
      
      if (data.DESCID) {
        this.cidade = this.contatoSelected.DESCID;
      }
      
      if (data.SIGEST) {
        this.uf = this.contatoSelected.SIGEST;
      }
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
        response => {
          this.loadDependente(response)
          console.log(response);
        }
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

      if (this.dependenteSelected.CPFDEP) {
        this.dependenteSelected.CPFDEP = cpfMask(this.dependenteSelected.CPFDEP);
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

      if (!this.contatoSelected.dependentes) {
        this.contatoSelected.dependentes = [];
      }
      this.dependenteIndex++;
      // console.log('this.contatoSelected :>> ', this.contatoSelected);
      // console.log('this.contatoSelected.dependentes :>> ', this.contatoSelected.dependentes);
      // this.contatoSelected.dependentes.push(this.dependenteSelected);

      if (this.CodCnvDep) {
        this.dependenteSelected.CODCNV = this.CodCnvDep.value;
      }
      if (this.CodModDep) {
        this.dependenteSelected.CODMOD = this.CodModDep.value;
      }

      if (this.CodModDep && this.CodCnvDep && !this.dependenteSelected.associacao) {
        this.dependenteSelected.associacao = {
          CODCNV: this.CodCnvDep.value,
          CODMOD: this.CodModDep.value
        }
      }

      if (this.dependenteSelected.CODGRAPAR) {
        this.dependenteSelected.CODGRAPAR = this.dependenteSelected.CODGRAPAR.value;
      }
      
      if (this.dependenteSelected.CODGRAINS) {
        this.dependenteSelected.CODGRAINS = this.dependenteSelected.CODGRAINS.value;
      }

      if (this.dependenteSelected.CPFDEP) {
        this.dependenteSelected.CPFDEP = parseInt(this.dependenteSelected.CPFDEP.replace(/([^0-9])/g, ""));
      }

      if (this.dependenteSelected.CODGRAINS) {
        this.dependenteSelected.CODGRAINS = this.dependenteSelected.CODGRAINS.value;
      }

      if (this.dependenteSelected.DATNASDEP) {
        this.dependenteSelected.DATNASDEP = moment(this.dependenteSelected.DATNASDEP).format("DD/MM/YYYY");
      }

      // console.log("this.dependenteSelected",this.dependenteSelected);
      if (this.dependenteSelected.CODDEP) {
        // console.log('this.dependenteSelected.CODDEP :>> ', this.dependenteSelected.CODDEP);
        // console.log('this.contatoSelected.dependentes :>> ', this.contatoSelected.dependentes);
        // console.log('this.contatoSelected.dependentes :>> ', this.contatoSelected.dependentes.findIndex(({CODDEP}) => CODDEP == this.dependenteSelected.CODDEP));
        let indexDep = this.contatoSelected.dependentes.findIndex(({CODDEP}) => CODDEP == this.dependenteSelected.CODDEP)
        // console.log('indexDep :>> ', indexDep);
        this.contatoSelected.dependentes[indexDep] = this.dependenteSelected;
        /*
        let dependente = [];
        dependente.push(this.dependenteSelected);
        (new AssociacaoDependenteService).update(dependente)
        .then(resp => {
          console.log('resp :>> ', resp);
          let indexDep = this.contatoSelected.dependentes.findIndex(({CODDEP}) => {CODDEP == resp.CODDEP})
          this.contatoSelected.dependentes[indexDep] = resp;
          this.$toast.add({severity:'success', summary: 'Sucesso', detail: "Dependente finalizado com sucesso", life: 5000})
        })
        .catch(() => {
          this.$toast.add({severity:'error', summary: 'Erro', detail: "Ocorreu um erro ao finalizar este dependente", life: 8000})
        })
        .finally(() => {
          // this.load();
        });
        */
      }else{
        // console.log("Entrou add dependente");
        this.dependenteSelected.CODEMP = this.contatoSelected.CODEMP;
        this.contatoSelected.dependentes.push(this.dependenteSelected);
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

      // console.log("📍 -> file: Form.vue:1046 -> save -> data.tipo", data.tipo)
      data.tipo = this.tipo.value;
      console.log("🚀 ~ file: Form.vue:1112 ~ save ~ data.tipo:", data.tipo)
      // console.log("this.tipo.value", this.tipo.value);
      //data.calendar = this.calendar;
           
      // console.log("📍 -> file: Form.vue:1050 -> save -> this.entidade.value", this.entidade)
      data.CODENT = this.entidade.value;

      if (data.SEXCON) {
        // console.log("📍 -> file: Form.vue:1053 -> save -> data.SEXCON.value", data.SEXCON.value)
        data.SEXCON = data.SEXCON.value;
      }
      if (data.CODCAR) {
        // console.log("📍 -> file: Form.vue:1057 -> save -> data.CODCAR.value", data.CODCAR.value)
        data.CODCAR = data.CODCAR.value;
      }
      if(data.SIGEST) {
        // console.log("data.SIGEST",data.SIGEST);
        data.SIGEST = data.SIGEST.value;
        // console.log("📍 -> file: Form.vue:1061 -> save -> data.SIGEST.value", data.SIGEST.value)
      }

      if (data.SALCON) {
        data.SALCON = toNumber(data.SALCON);
      }

      if (data.CEPENDCON) {
        data.CEPENDCON = toNumber(data.CEPENDCON);
      }
      // console.log("o data se encontra aqui", data);
      if (!data.CODCON) {
        data.CODCON = 0;
      }

      this.loading5 = true;      

      const response = await this.service.send(data);
      
      this.loading5 = false;

      if (response[0] == 1) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: this.contatoSelected.NOMCON + ' salvo com sucesso', life: 3000});

        if (response.errors) {
          response.errors.map(
            (error) => this.$toast.add({severity:'error', summary: 'Erro', detail: error, life: 3000})
          );
        }
        if (response.success) {
          response.success.map(
            (msg) => this.$toast.add({severity:'success', summary: 'Sucesso', detail: msg, life: 3000})
          );
        }
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Contato não salvo', life: 3000});
			}
    },

    back() {
      // this.$parent.back();
      this.$parent.back(4);
      // console.log('this.$parent :>> ', this.$parent);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>