<script setup>
import { ref, onMounted, onUpdated } from 'vue';
import { useToast } from "primevue/usetoast";
import moment from 'moment';

import AssociacaoService from '@/service/AssociacaoService';
import ConvenioService from '@/service/ConvenioService';
import ModalidadeService from '@/service/ModalidadeService';
import UsuarioService from "@/service/administracao/UsuarioService";
import HistAssociacao from "@/service/HistAssociacaoService";
import { cpfMask } from '@/defaults/mask';

const toast = useToast();

const associacaoService = new AssociacaoService();
const convenioService = new ConvenioService();
const modalidadeService = new ModalidadeService();
const usuarioService = new UsuarioService();
const histAssociacao = new HistAssociacao();

const user = ref();
const entidade = ref();
const entidade1 = ref();
const contato1 = ref();
const associacao = ref();
const matricula = ref();
const convenio = ref();
const convenio1 = ref();
const modalidade = ref();
const modalidade1 = ref();
const status = ref({label : 'Ativos', value : "A"});
const loading = ref(false);
const loadingTable = ref(false);
const loadingConvenios = ref(false);
const loadingModalidades = ref(false);
const loadingHist = ref(false);
const totalRecords = ref();
const statusOptions = ref([
  {label : 'Ativos', value : "A"},
  {label : 'Finalizados', value : "F"},
  {label : 'Todos', value : "T"},
]);

const dialogAssociacao = ref(false);
const dialogAssociacaoEdit = ref(false);
const dialogConfirmSave = ref(false);
const dialogAssociacaoNew = ref(false);
const dialogConfirmNew = ref(false);

const dataInicio = ref();
const dataFim = ref();

const convenios = ref([]);
const modalidades = ref([]);
const convenios1 = ref([]);
const modalidades1 = ref([]);
const associados = ref([]);
const histassociacao = ref([]);

const load = async (options) => {
  loadingTable.value = true;
  if (!options) {
    options = {};    
  }

  if (!options.query) {
    options.query = {};
  }

  if (convenio.value) {
    options.query.CODCNV = convenio.value.value;
  }
  if (modalidade.value) {
    options.query.CODMOD = modalidade.value.value;
  }
  if (entidade.value) {
    options.query.CODENT = entidade.value.value;
  }
  if (matricula.value) {
    options.query.MATASS = matricula.value;
  }
  if (status.value) {
    options.query.status = status.value.value;
  }

  const response = await associacaoService.all(options);

  totalRecords.value = response.totalRecords;
  associados.value = response.data;

  loadingTable.value = false;
}

const onPage = (event) => {
    load(event);
}
const onSort = (event) => {
    load(event);
}

const loadConvenios = () => {
  convenioService.all()
  .then(
    (response) => {
      const data = [];

      response.map(
        (entry) => data.push({label : entry.DESCNV, value : entry.CODCNV})
      );

      convenios.value = data;
      convenios1.value = data;
    }
  )
  .finally(() => {
    loadingConvenios.value = false;
    loading.value = false;
  });
}

const loadModalidades = () => {
  loadingModalidades.value = true;

  modalidadeService.all(convenio.value.value)
  .then(
    (response) => {
      const data = [];

      response.map(
        (entry) => data.push({label : entry.DESMOD, value : entry.CODMOD})
      );

      modalidades.value = data;
    }
  )
  .finally(() => {
    loadingModalidades.value = false;
  });
}

const loadModalidades1 = () => {
  loadingModalidades.value = true;

  modalidadeService.all(convenio1.value.value)
  .then(
    (response) => {
      const data = [];

      response.map(
        (entry) => data.push({label : entry.DESMOD, value : entry.CODMOD})
      );

      modalidades1.value = data;
    }
  )
  .finally(() => {
    loadingModalidades.value = false;
  });
}

const loadHist = () => {
  loadingHist.value = true;

  histAssociacao.all(convenio.value.value, associacao.value.MATASS)
  .then(response => histassociacao.value = response )
  .finally(() => {
    loadingHist.value = false;
  });
}

const open = (data) => {
  dialogAssociacao.value = true;
  associacao.value = data;

  loadHist();
}

const openNew = () => {
  dialogAssociacaoNew.value = true;
  dataInicio.value = '';
}

const edit = (data) => {
  dialogAssociacaoEdit.value = true;
  associacao.value = data;

  dataInicio.value = moment(data.DATINIASS).toDate();
  if (data.DATFINASS) {
    dataFim.value = moment(data.DATFINASS).toDate();
  }

  loadHist();
}

const save = () => {
  dialogAssociacaoEdit.value = false;
  dialogConfirmSave.value = false;

  toast.add({ severity: 'info', summary: 'Associado', detail: 'Salvando associado', life: 3000 });

  associacaoService.update({
    ...associacao.value,
    DATINIASS : dataInicio.value,
    DATFINASS : dataFim.value,
  })
  .then(
    response => 
    toast.add({ severity: 'success', summary: 'Associado', detail: 'Associado salvo com sucesso', life: 3000 })
  )
  .finally(() => {
    load()
  });
}

const validateAdd = () => {
  if (!convenio1.value) {
    toast.add({ severity: 'warn', summary: 'Associado', detail: 'Informe o convênio', life: 3000 });
    return;
  }
  if (!modalidade1.value) {
    toast.add({ severity: 'warn', summary: 'Associado', detail: 'Informe a modalidade', life: 3000 });
    return;
  }
  if (!entidade1.value) {
    toast.add({ severity: 'warn', summary: 'Associado', detail: 'Informe a entidade', life: 3000 });
    return;
  }
  if (!contato1.value) {
    toast.add({ severity: 'warn', summary: 'Associado', detail: 'Informe o empregado', life: 3000 });
    return;
  }
  if (!dataInicio.value) {
    toast.add({ severity: 'warn', summary: 'Associado', detail: 'Informe a data de início', life: 3000 });
    return;
  }

  dialogConfirmNew.value = true;
}

const add = () => {
  dialogAssociacaoNew.value = false;
  dialogConfirmNew.value = false;

  toast.add({ severity: 'info', summary: 'Associado', detail: 'Incluindo associado', life: 3000 });

  associacaoService.store({
    CODCNV : convenio1.value.value,
    CODMOD : modalidade1.value.value,
    CODENT : entidade1.value.value,
    CODCON : contato1.value.value,
    DATINIASS : dataInicio.value,
  })
  .then(
    response => {
      if (response) {
        toast.add({ severity: 'success', summary: 'Associado', detail: 'Associado salvo com sucesso', life: 3000 })
      }
      else {
        if (associacaoService.result.response.data) {
          toast.add({ severity: 'error', summary: 'Associado', detail: associacaoService.result.response.data, life: 3000 })
        }
        else {
          toast.add({ severity: 'error', summary: 'Associado', detail: 'Associado não incluído', life: 3000 })
        }
      }
    }    
  )
  .finally(() => {
    load()
  });
}

onMounted(() => {
  loading.value = true;
  usuarioService.me()
  .then(response => user.value = response)
  .finally(() => {
    loadConvenios();
  })  
});
</script>

<template>
  <Toast />
  <div class="grid">
		<div class="col-12 md:col-12">
      <div class="p-fluid">
        <div class="card">
          <h5>Associação</h5>
          <div class="formgrid grid" v-if="loading">
              <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 w-50rem">
                  <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-50rem">
                      <div class="flex flex-column align-items-center sm:align-items-start gap-3 w-50rem">
                          <Skeleton class="w-50rem border-round h-2rem" />
                          <Skeleton class="w-15rem border-round h-2rem" />
                          <Skeleton class="border-round h-1rem w-30rem" />
                          <div class="flex align-items-center gap-3">
                              <Skeleton class="w-10rem border-round h-1rem" />
                              <Skeleton class="w-25rem border-round h-1rem" />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div class="formgrid grid" v-if="!loading && user">
            <div class="field col-3" v-if="user.grupo.ADMGRPUSU == 'S'">
              <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2 mb-2" @click="openNew()" label="Adicionar novo" />
            </div>
          </div>
          <div class="formgrid grid" v-if="!loading">
            <div class="field col-4">
              <label>Convênio</label>
              <Dropdown 
                v-model="convenio" 
                :options="convenios" 
                :loading="loadingConvenios"
                optionLabel="label" 
                placeholder="Selecione"
                @change="loadModalidades()"
              >
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
            <div class="field col-4">
              <label>Modalidade</label>
              <Dropdown 
                v-model="modalidade" 
                :options="modalidades" 
                :loading="loadingModalidades"
                optionLabel="label" 
                placeholder="Selecione" 
              >
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
            <div class="field col-2">
              <label>Status</label>
              <Dropdown 
                v-model="status" 
                :options="statusOptions" 
                optionLabel="label" 
                placeholder="Todos" 
              >
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
            <div class="field col-4">
              <label><Translate text="Entidade" /></label>
              <EntidadeBox :selected="entidade" v-model="entidade" />
            </div>
            <div class="field col-3">
              <label for="name">Matrícula</label>
              <InputText v-model.trim="matricula" />
            </div>
            <div class="field col-1" style="padding-top : 20px">
              <Button icon="pi pi-search" class="p-button-rounded p-button-info mr-2 mb-2" @click="load()" />
            </div>
          </div>          
          <div class="formgrid grid" v-if="!loading">
            <div class="field col-12">
              <div class="col-12" v-if="loadingTable">
                  <div class="flex flex-row xl:flex-row xl:align-items-start p-4 gap-4 w-50rem">
                      <div class="flex flex-row sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4 w-50rem">
                          <div class="flex flex-column align-items-center sm:align-items-start gap-3 col-12">
                              <Skeleton class="w-40rem border-round h-2rem" />
                              <Skeleton class="w-30rem border-round h-2rem" />
                              <Skeleton class="w-15rem border-round h-1rem" />
                              <div class="flex align-items-center gap-3">
                                  <Skeleton class="w-6rem border-round h-1rem" />
                                  <Skeleton class="w-3rem border-round h-1rem" />
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
              <DataView 
                :value="associados"
                :lazy="true" 
                :paginator="true" 
                :rows="10"
                :loading="loading"
                @page="onPage($event)"
                @sort="onSort($event)"
                responsiveLayout="scroll" 
                dataKey="MATASS"
                v-if="!loadingTable"
              >
                <template #empty v-if="!loadingTable">                        
                  <div>
                      <Message severity="info">Nenhum registro encontrado</Message>
                  </div>
                </template>
                <template #footer v-if="!loadingTable">
                    Total de registros {{ totalRecords }}
                </template>
                <template #list="slotProps">
                    <div class="col-12">
                        <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                <div class="flex flex-column align-items-center sm:align-items-start gap-3">                                    
                                    <div class="text-2xl font-bold text-900">{{ slotProps.data.entidade.CODENT }} - {{ slotProps.data.entidade.NOMENT }}</div>
                                    <div class="text-2xl font-bold text-900" v-if="slotProps.data.contato">{{ slotProps.data.MATASS }} - {{ slotProps.data.contato.NOMCON }}</div>
                                    <div class="flex align-items-center gap-3">
                                        <span class="flex align-items-center gap-2">
                                            Convênio: <span class="font-semibold">{{ slotProps.data.convenio.DESCNV }}</span>
                                        </span>
                                        <span class="flex align-items-center gap-2">
                                            Modalidade: <span class="font-semibold text-small">{{ slotProps.data.modalidade.DESMOD }}</span>
                                        </span>                                        
                                    </div>
                                    <div class="flex align-items-center gap-3">
                                      <Tag value="Ativo" severity="success" v-if="!slotProps.data.DATFINASS"></Tag>
                                      <Tag value="Finalizado" severity="danger" v-if="slotProps.data.DATFINASS"></Tag>
                                    </div>
                                </div>
                                <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                  <p>Início em: <span class="font-semibold text-small">{{ moment(slotProps.data.DATINIASS).format("DD/MM/YYYY") }}</span></p>
                                  <p v-if="slotProps.data.DATFINASS">Finalizado: <span class="font-semibold text-small">{{ moment(slotProps.data.DATFINASS).format("DD/MM/YYYY") }}</span></p>
                                </div>
                                <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                    <Button icon="pi pi-eye" rounded @click="open(slotProps.data)"></Button>
                                    <Button icon="pi pi-pencil" rounded @click="edit(slotProps.data)" v-if="user.grupo.ADMGRPUSU == 'S'"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
              </DataView>
            </div>                  
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="dialogAssociacao" :style="{width: '70%'}" header="Detalhes do Associado" :modal="true" class="p-fluid">
    <div class="p-fluid">
      <div class="formgrid grid">
        <div class="field col-6">
          <Tag value="Ativo" severity="success" v-if="!associacao.DATFINASS"></Tag>
          <Tag value="Finalizado" severity="danger" v-if="associacao.DATFINASS"></Tag>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label>Matrícula</label>
          <p>{{ associacao.MATASS }}</p>
        </div>
        <div class="field col-4">
          <label>Convênio</label>
          <p>{{ associacao.convenio.DESCNV }}</p>
        </div>

        <div class="field col-4">
          <label>Modalidade</label>
          <p>{{ associacao.modalidade.DESMOD }}</p>
        </div>
      </div>
      
      <div class="formgrid grid">
        <div class="field col-6">
          <label>Início em</label>
          {{ moment(associacao.DATINIASS).format("DD/MM/YYYY") }}
        </div>

        <div class="field col-6" v-if="associacao.DATFINASS">
          <label>Finalizado em</label>
          {{ moment(associacao.DATFINASS).format("DD/MM/YYYY") }}
        </div>
      </div>

      <div class="formgrid">
        <div class="field">
          <Accordion>
            <AccordionTab :header="associacao.contato.NOMCON">
              <p><strong>CPF: </strong> {{ cpfMask(associacao.contato.CPFCON) }}</p>
              <p><strong>Data de nascimento: </strong> {{ moment(associacao.contato.DATNASCON).format("DD/MM/YYYY") }}</p>
              <p><strong>Nome da mãe: </strong> {{ associacao.contato.NOMMAECON }}</p>
              
              <hr />

              <p><strong>Endereço: </strong> {{ associacao.contato.NOMLOG }}{{ associacao.contato.NUMENDCON ? ", " + associacao.contato.NUMENDCON : ''  }}</p>
              <p><strong>Bairro: </strong> {{ associacao.contato.DESBAI }}</p>
              <p><strong>Cidade: </strong> {{ associacao.contato.DESCID }}</p>
              <p><strong>Estado: </strong> {{ associacao.contato.SIGEST }}</p>

              <hr />

              <p><strong>Observações: </strong> {{ associacao.contato.OBSCON }}</p>
            </AccordionTab>
            <AccordionTab header="Histórico">
              <div v-if="loadingHist">
                <ProgressSpinner style="height: 50px;" />
              </div>
              <div v-if="histassociacao && !loadingHist">
                <Accordion>
                  <AccordionTab v-for="entry in histassociacao" :header="entry.NUMHISASS" :key="entry.NUMHISASS">
                    <div class="p-fluid">
                      <div class="formgrid grid">
                        <div class="field col-6">
                          <label>Convênio</label>
                          <p>{{ entry.convenio.DESCNV }}</p>
                        </div>

                        <div class="field col-6">
                          <label>Modalidade</label>
                          <p>{{ entry.modalidade.DESMOD }}</p>
                        </div>
                      </div>
                      
                      <div class="formgrid grid">
                        <div class="field col-6">
                          <label>Início em</label>
                          {{ moment(entry.DATINIASS).format("DD/MM/YYYY") }}
                        </div>

                        <div class="field col-6" v-if="entry.DATFINASS">
                          <label>Finalizado em</label>
                          {{ moment(entry.DATFINASS).format("DD/MM/YYYY") }}
                        </div>
                      </div>
                    </div>
                  </AccordionTab>
                </Accordion>
              </div>
              <div class="col-12" v-else>
                <Message severity="info">Nenhum registro encontrado</Message>
              </div>              
            </AccordionTab>
          </Accordion>
        </div>
      </div>      
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="dialogAssociacao = false"/>
    </template>			
  </Dialog>
  <Dialog v-model:visible="dialogAssociacaoEdit" :style="{width: '70%'}" header="Edição do Associado" :modal="true" class="p-fluid">
    <div class="p-fluid">
      <div class="formgrid grid">
        <div class="field col-6">
          <Tag value="Ativo" severity="success" v-if="!associacao.DATFINASS"></Tag>
          <Tag value="Finalizado" severity="danger" v-if="associacao.DATFINASS"></Tag>
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label>Matrícula</label>
          <p>{{ associacao.MATASS }}</p>
        </div>
        <div class="field col-4">
          <label>Convênio</label>
          <p>{{ associacao.convenio.DESCNV }}</p>
        </div>

        <div class="field col-4">
          <label>Modalidade</label>
          <p>{{ associacao.modalidade.DESMOD }}</p>
        </div>
      </div>
      
      <div class="formgrid grid">
        <div class="field col-6">
          <label>Início em</label>
          <Calendar view="month" dateFormat="MM 'de' yy" v-model="dataInicio" :manualInput="false" />
        </div>

        <div class="field col-6" v-if="associacao.DATFINASS">
          <label>Finalizado em</label>
          <Calendar view="month" dateFormat="MM 'de' yy" v-model="dataFim" :manualInput="false" />
        </div>
      </div>

      <div class="formgrid">
        <div class="field">
          <Accordion>
            <AccordionTab :header="associacao.contato.NOMCON">
              <p><strong>CPF: </strong> {{ cpfMask(associacao.contato.CPFCON) }}</p>
              <p><strong>Data de nascimento: </strong> {{ moment(associacao.contato.DATNASCON).format("DD/MM/YYYY") }}</p>
              <p><strong>Nome da mãe: </strong> {{ associacao.contato.NOMMAECON }}</p>
              
              <hr />

              <p><strong>Endereço: </strong> {{ associacao.contato.NOMLOG }}{{ associacao.contato.NUMENDCON ? ", " + associacao.contato.NUMENDCON : ''  }}</p>
              <p><strong>Bairro: </strong> {{ associacao.contato.DESBAI }}</p>
              <p><strong>Cidade: </strong> {{ associacao.contato.DESCID }}</p>
              <p><strong>Estado: </strong> {{ associacao.contato.SIGEST }}</p>

              <hr />

              <p><strong>Observações: </strong> {{ associacao.contato.OBSCON }}</p>
            </AccordionTab>
          </Accordion>
        </div>
      </div>      
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="dialogAssociacao = false"/>
      <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="dialogConfirmSave = true"/>
    </template>			
  </Dialog>
  <Dialog v-model:visible="dialogAssociacaoNew" :style="{width: '70%'}" header="Novo Associado" :modal="true" class="p-fluid">
    <div class="p-fluid">
      <div class="formgrid grid">
        <div class="field col-12">
          <label><Translate text="Entidade" /></label>
          <EntidadeBox :selected="entidade1" v-model="entidade1" /> 
        </div>
        <div class="field col-12" v-if="entidade1">
          <label><Translate text="Contato" /></label>
          <ContatoBox :selected="contato1" :CodEnt="entidade1" v-model="contato1" />
        </div>                  
      </div>
      <div class="formgrid grid">
        <div class="field col-4">
          <label>Convênio</label>
          <Dropdown 
            v-model="convenio1" 
            :options="convenios1" 
            :loading="loadingConvenios"
            optionLabel="label" 
            placeholder="Selecione"
            @change="loadModalidades1()"
          >
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
        <div class="field col-4">
          <label>Modalidade</label>
          <Dropdown 
            v-model="modalidade1" 
            :options="modalidades1" 
            :loading="loadingModalidades"
            optionLabel="label" 
            placeholder="Selecione" 
          >
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
          <label>Início em</label>
          <Calendar view="month" dateFormat="MM 'de' yy" v-model="dataInicio" :manualInput="false" />
        </div>
      </div>        
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="dialogAssociacao = false"/>
      <Button label="Confirmar" icon="pi pi-check" class="p-button-text" @click="validateAdd()"/>
    </template>			
  </Dialog>

  <Dialog v-model:visible="dialogConfirmSave" :style="{width: '450px'}" header="Confirmação" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="associacao">Deseja realmente salvar o associado <b>{{associacao.contato.NOMCON}}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="dialogConfirmSave = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="save()" />
    </template>
  </Dialog>
  
  <Dialog v-model:visible="dialogConfirmNew" :style="{width: '450px'}" header="Confirmação" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span v-if="contato1">Deseja realmente incluir o associado <b>{{ contato1.value.label }}</b>?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="dialogConfirmNew = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="add()" />
    </template>
  </Dialog>
</template>