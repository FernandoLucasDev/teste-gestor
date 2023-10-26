<template>
  <div class="formgrid grid" v-if="entidade">
    <div class="col-12">
      <h2>{{ entidade.CODENT }} {{ entidade.NOMENT }}</h2>
    </div>          
  </div> 
  <DataTable :value="contatos" 
    v-model:expandedRows="expandedRows" 
    :lazy="true" 
    :paginator="true" 
    :rows="10"
    :loading="loading"
    :totalRecords="totalRecords"
    @page="onPage($event)"
    @sort="onSort($event)"
    responsiveLayout="scroll" 
    dataKey="CODCON"
    >      
      <template #header>        
        <div class="formgrid grid" v-if="entidade">
          <div class="col-6">
            <h3>Contatos</h3>
          </div>          
          <div class="field col-3">
            <Dropdown v-model="status" :options="optionsStatus" optionLabel="label" placeholder="Status">
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
          <div class="field col-1">
            <Button label="" icon="pi pi-search" class="p-button-text" @click="load" />
          </div>
        </div>
      </template>
      <template #empty v-if="!loading">
          Nenhum contato encontrado
      </template>
      <template #loading>
          Carregando contatos. Por favor, aguarde...
      </template>
      <template #footer v-if="!loading">
        Total de registros {{ totalRecords}}
      </template>
      <Column :expander="true" headerStyle="width: 3rem" />             
      <Column field="NOMCON" header="Nome" :sortable="true" style="min-width:12rem">
          <template #body="{data}">
              {{data.NOMCON}}
          </template>
      </Column>
      <Column field="CPFCON" header="CPF" style="min-width:8rem">
          <template #body="{data}">
              {{ data.CPFCON ? formataCpf(data.CPFCON) : ""}}
          </template>
      </Column>    
      <Column field="NOMENT" header="Entidade" style="min-width:8rem">
          <template #body="{data}">
              {{ data.entidade.NOMENT }}
          </template>
      </Column>    
      <Column headerStyle="min-width:10rem; width:10rem;">
        <template #body="props">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="open(props.data)" />
          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mr-2" @click="selectDelete(props.data)" v-if="$parent.canDelete()" />
        </template>
      </Column>
      
      <template #expansion="slotProps">
        <div class="p-3">
          <Message v-if="!slotProps.data.associacao.length" severity="warn">Nenhuma associação</Message>
          <Message v-if="!slotProps.data.segurado.length" severity="warn">Nenhum seguro</Message>

          <Accordion>
            <AccordionTab header="Associacao" v-if="slotProps.data.associacao.length">
              <DataTable 
                :value="slotProps.data.associacao" 
                v-model:expandedRows="expandedRowsAssociacao"
                responsiveLayout="scroll" 
                dataKey="MATASS">                  
                <Column :expander="true" headerStyle="width: 3rem" />    
                <Column field="MATASS" header="Matrícula">
                  {{ associacao.MATASS ?? "" }}
                </Column>
                <Column field="convenio" header="Convênio">                    
                  <template #body="{data}">
                    {{ data.convenio ? (data.convenio.DESCNV??"") : "" }}
                  </template>
                </Column>
                <Column field="modalidade" header="Modalidade">
                  <template #body="{data}">
                    {{ data.modalidade ? (data.modalidade.DESMOD??"") : "" }}
                  </template>
                </Column>
                <Column field="status" header="Status">
                  <template #body="{data}">
                    <Chip label="Associado" v-if="!data.DATFINASS" />
                    <Chip label="Finalizado" class="disabled-chip" v-else />
                  </template>
                </Column>
                <Column field="options" header="">
                  <template #body="{data}">
                    <Button icon="pi pi-times" class="p-button-rounded p-button-warning mr-2" @click="selectDeleteAssociacao(slotProps.data, data)" v-if="$parent.canDelete() && !data.DATFINASS" />
                  </template>
                </Column>

                <template #expansion="slotProps">
                  <p>{{ slotProps.data.entidade ? (slotProps.data.entidade.CODENT + " - " + slotProps.data.entidade.NOMENT) : "" }}</p>
                  <p>Início: <strong>{{ formatData(slotProps.data.DATINIASS) }}</strong></p>
                  <p>Fim: <strong>{{ slotProps.data.DATFINASS ? formatData(slotProps.data.DATFINASS) : "" }}</strong></p>
                </template>
              </DataTable>             
            </AccordionTab>
            <AccordionTab header="Seguro" v-if="slotProps.data.segurado.length">
              <DataTable 
              :value="slotProps.data.segurado" 
              v-model:expandedRows="expandedRowsSegurado"
              responsiveLayout="scroll" 
              dataKey="MATSEG"
              >
                <Column :expander="true" headerStyle="width: 3rem" />  
                <Column field="MATASS" header="Matrícula">                  
                  <template #body="{data}">
                    {{ data.MATSEG ?? "" }}
                  </template>
                </Column>
                <Column field="convenio" header="Apólice">                    
                  <template #body="{data}">
                    {{ data.NUMAPO??"" }}
                  </template>
                </Column>
                <Column field="modalidade" header="Prêmio">
                  <template #body="{data}">
                    {{ data.premio ? (data.premio.DESPRE??"") : "" }}
                  </template>
                </Column>
                <Column field="modalidade" header="Status">
                  <template #body="{data}">
                    <Chip label="Segurado" v-if="!data.DATFINSEG" />
                    <Chip label="Finalizado" class="disabled-chip" v-else />
                  </template>
                </Column>
                <Column field="options" header="">
                  <template #body="{data}">
                    <Button icon="pi pi-times" class="p-button-rounded p-button-warning mr-2" @click="selectDeleteSegurado(slotProps.data, data)" v-if="$parent.canDelete() && !data.DATFINSEG" />
                  </template>
                </Column>
                <template #expansion="slotProps">
                  <p>{{ slotProps.data.entidade ? (slotProps.data.entidade.CODENT + " - " + slotProps.data.entidade.NOMENT) : "" }}</p>
                  <p>Início: <strong>{{ formatData(slotProps.data.DATINISEG) }}</strong></p>
                  <p>Fim: <strong>{{ slotProps.data.DATFINSEG ? formatData(slotProps.data.DATFINSEG) : "" }}</strong></p>
                </template>
              </DataTable>
            </AccordionTab>            
          </Accordion>

          <DataTable :value="slotProps.data.dependentes" responsiveLayout="scroll">
            <template #header>
              <h3>Dependentes</h3>
            </template>
            <template #empty>
                Nenhum dependente encontrado
            </template>
            <Column field="id" header="Nome" :sortable="true">
              <template #body="slotProps">
                {{slotProps.data.NOMDEP}}
              </template>
            </Column>    
            <Column field="modalidade" header="CPF">
              <template #body="{data}">
                {{ data.CPFDEP ? formataCpf(data.CPFDEP) : "" }}
              </template>
            </Column>        
            <Column field="modalidade" header="Data de nascimento">
              <template #body="{data}">
                {{ data.DATNASDEP ? formatData(data.DATNASDEP) : "" }}
              </template>
            </Column>        
            <Column field="modalidade" header="Grau de parentesco">
              <template #body="{data}">
                {{ data.grau_parentesco ? (data.grau_parentesco.DESGRAPAR??"") : "" }}
              </template>
            </Column>   
            <Column field="modalidade" header="Status">
              <template #body="{data}">
                <Chip label="Associado" v-if="data.associacao" />
                <Chip label="Inativo" class="disabled-chip" v-else />
              </template>
            </Column>
            <Column headerStyle="min-width:10rem; width:10rem;">
              <template #body="props">
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="openDependente(slotProps.data, props)" />
                <Button icon="pi pi-times" class="p-button-rounded p-button-warning mr-2" @click="selectDeleteDependente(props.data)" v-if="$parent.canDelete() && props.data.associacao" />
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
  </DataTable>

  <div class="formgrid grid">
    <div class="col-3">
      <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
    </div>  
  </div>

  <Dialog v-model:visible="deleteContatoDialog" :style="{width: '450px'}" header="Selecione o que excluir" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      Deseja realmente extinguir todos os registros de {{contato.NOMCON}}?
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="deleteContatoDialog = false"/>      
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmDelete" />    
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
</template>
<script>
import ContatoService from '../../../service/ContatoService';
import ProcessamentoEmpregadoService from '../../../service/ProcessamentoEmpregadoService';
import AssociacaoDependenteService from '../../../service/AssociacaoDependenteService';
import { cpfMask, cepMask } from '../../../defaults/mask';
import moment from "moment";

export default {
  props : ['data', 'src'],
  contatoService : null,
  data() {
    return {
      loading : false,
      status : "",
      entidade : null,
      contatoSrc : null,
      contatos : [],
      expandedRows: [],
      expandedRowsAssociacao: [],
      expandedRowsSegurado: [],
      contato : null,
      dependente : null,
      deleteContatoDialog : false,
      deleteContatoAssociacaoDialog : false,
      deleteContatoSeguradoDialog : false,
      deleteDependenteDialog : false,

      optionsStatus : [
				{label : 'Todos', value : ""},
				{label : 'Ativos', value : "A"},
				{label : 'Finalizados', value : "F"},
			],

      // Table
      totalRecords : 0,
    }
  },
  mounted() {
    this.entidade = this.data;
    this.contatoSrc = this.src;
    this.contatoService = new ContatoService();

    console.log(this.data);

    this.load();
  },
  methods : {
    open(data) {
      // console.log("📍 -> file: EntidadeEmpregados.vue:276 -> open -> data", data)
      this.$parent.openContato(data);
    },
    openDependente(_contato, _dependente) {
      this.$parent.openDependente(_contato, _dependente);
    },
    back() {
      this.$parent.back(0);
    },
    reload() {
      if (!this.contato) return;

      this.$parent.openEntidade({
        CODENT : this.contato.CODENT
      });
    },
    formatData(date) {
      return moment(date).format("DD/MM/YYYY");
    },
    formataCpf(cpf) {
      return cpfMask(cpf);
    },
    selectDelete(data) {
      this.contato = data;
      this.deleteContatoDialog = true;
    },
    selectDeleteAssociacao(_contato, props) {
      this.$parent.openFinaliza(_contato, props, "A");
    },
    selectDeleteSegurado(_contato, props) {
      this.$parent.openFinaliza(_contato, props, "S");
    },
    selectDeleteDependente(_dependente) {
      this.dependente = _dependente;

      this.deleteDependenteDialog = true;
    },
    confirmDelete() {
      this.deleteContatoDialog = false;
      (new ProcessamentoEmpregadoService).delete(this.contato)
      .then(resp => {
        this.$toast.add({severity:'success', summary: 'Sucesso', detail: "Contato excluído com sucesso"})
      })
      .catch(() => {
        this.$toast.add({severity:'error', summary: 'Erro', detail: "Ocorreu um erro ao excluir este contato"})
      })
      .finally(() => {
        this.load();
      });
    },
    deleteDependente() {
      this.deleteDependenteDialog = false;
      
      (new AssociacaoDependenteService).delete(this.dependente.associacao.CODCNV, this.dependente.associacao.MATASS, this.dependente.associacao.SEQASSDEP)
      .then(resp => {
        this.$toast.add({severity:'success', summary: 'Sucesso', detail: "Dependente finalizado com sucesso"})
      })
      .catch(() => {
        this.$toast.add({severity:'error', summary: 'Erro', detail: "Ocorreu um erro ao finalizar este dependente"})
      })
      .finally(() => {
        this.load();
      });
    },
    load(options) {
      this.loading = true;

      if (!options) {
        options = {};
      }

      if (this.status) {
        options.query = {
          status : this.status.value
        };
      }

      if (this.contatoSrc) {
        this.contatoService.search(this.contatoSrc, options)
        .then(response => {
          this.totalRecords = response.totalRecords;
          this.contatos = response.data;
        })
        .finally(() => {
          this.loading = false;
        });
      }
      else if(this.entidade) {
        this.contatoService.all(this.entidade.CODENT, options)
        .then(response => {
          this.totalRecords = response.totalRecords;
          this.contatos = response.data;
        })
        .finally(() => {
          this.loading = false;
        });
      }      
    },
    onPage(event) {
      this.load(event);
    },
    onSort(event) {
      console.log(event);
      this.load(event);
    },
  }
}
</script>

<style lang="scss" scoped>
.p-chip.disabled-chip {
    background: var(--red-500);
    color: var(--gray-200);
}
</style>