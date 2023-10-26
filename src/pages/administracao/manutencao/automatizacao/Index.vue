<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from "primevue/usetoast";
import Datepicker from '@vuepic/vue-datepicker';
import moment from "moment";

import AutomatizacaoService from '../../../../service/AutomatizacaoService';

const toast = useToast();

const automatizacaoService = new AutomatizacaoService();

const meses = ref({
  1 : "Janeiro",
  2 : "Fevereiro",
  3 : "Março",
  4 : "Abril",
  5 : "Maio",
  6 : "Junho",
  7 : "Julho",
  8 : "Agosto",
  9 : "Setembro",
  10 : "Outubro",
  11 : "Novembro",
  12 : "Dezembro",
});

const days_of_weeks = ref(
  [
    { label : "Domingo", value : 0},
    { label : "Segunda", value : 1},
    { label : "Terça", value : 2},
    { label : "Quarta", value : 3},
    { label : "Quinta", value : 4},
    { label : "Sexta", value : 5},
    { label : "Sábado", value : 6},
  ]
);

const automatizacoes = ref([]);
const availables = ref([]);
const availablesDb = ref([]);
const loading = ref(false);
const periodos = ref([
  { label : "Diário", value : "D"},
  { label : "Semanal", value : "W"},
  { label : "Mensal", value : "M"},
  { label : "Anual", value : "Y"},
]);
const dias = ref([]);

const id = ref();
const name = ref();
const descricao = ref();
const periodo = ref();
const dia = ref();
const mes = ref();
const hora = ref();
const data_inicio = ref();
const data_fim = ref();

const fields = ref();
const fieldsModel = ref([]);

const dialog = ref(false);
const dialogConfirm = ref(false);
const dialogDelete = ref(false);

const load = async () => {
  loading.value = true;

  await automatizacaoService.all()
  .then(response => automatizacoes.value = response)
  .finally(() => {
    loading.value = false;
  });
  
}

const loadAvailables = async () => {
  const response = await automatizacaoService.availables();

  if (response) {
    const data = [];

    availablesDb.value = response;

    response.map(
      entry => data.push({ label : entry.description, value : entry.name })
    );

    availables.value = data;
  }
}

const loadDays = () => {
  if (periodo.value) {
    if (periodo.value.value == "W") {
      dias.value = days_of_weeks.value;
    }
    else if (periodo.value.value == "M" || periodo.value.value == "Y") {
      const days = [];
      for (let i = 1; i <= 31; i++) {
        days.push({ label : i, value : i});
      }
      dias.value = days;
    }
  }
}

const loadFields = () => {
  fieldsModel.value = [];

  availablesDb.value.map(
    entry => {
      if (entry.name == name.value.value)  {
        fields.value = entry.fields;
      }
    }
  );
}

const preSave = () => {
  if (!name.value) {
    toast.add({ severity: 'warn', summary: 'Automatização', detail: 'Informe um comando', life: 3000 });
    return;
  }
  if (!periodo.value) {
    toast.add({ severity: 'warn', summary: 'Automatização', detail: 'Informe um período', life: 3000 });
    return;
  }
  if (!hora.value) {
    toast.add({ severity: 'warn', summary: 'Automatização', detail: 'Informe um horário', life: 3000 });
    return;
  }

  dialogConfirm.value = true;
}

const save = async () => {
  dialogConfirm.value = false;
  dialog.value = false;

  toast.add({ severity: 'info', summary: 'Automatização', detail: 'Salvando automatização', life: 3000 });

  const fieldsToSent = [];

  fields.value.map(
    (entry, index) => {
      const _model = fieldsModel.value[index];
      if (_model) {
        fieldsToSent.push(
          {
            "field" : entry,
            "value" : _model
          }
        );
      }
    }
  );

  const data = {
    name : name.value.value,
    descricao : descricao.value,
    periodo : periodo.value.value,
    dia : dia.value.value,
    mes : mes.value ? mes.value.value : null,
    hora : hora.value,
    data_inicio : data_inicio.value,
    data_fim : data_fim.value,
    fields : fieldsToSent
  };

  let response;

  if (id.value) {
    data.id = id.value;    
    response = await automatizacaoService.update(data);
  }
  else {
    response = await automatizacaoService.store(data);
  }

  if (response) {
    toast.add({ severity: 'success', summary: 'Automatização', detail: 'Automatização salva com sucesso', life: 3000 })

    load();
  }
  else {
    if (automatizacaoService.result.response.data) {
      toast.add({ severity: 'error', summary: 'Automatização', detail: automatizacaoService.result.response.data, life: 3000 })
    }
    else {
      toast.add({ severity: 'error', summary: 'Automatização', detail: 'Automatização não incluída', life: 3000 })
    }
  }
}

const remove = () => {
  dialogDelete.value = false;
  
  toast.add({ severity: 'info', summary: 'Automatização', detail: 'Excluindo automatização', life: 3000 });

  automatizacaoService.delete(id.value)
  .then(response => {
    toast.add({ severity: 'success', summary: 'Automatização', detail: 'Automatização excluída', life: 3000 });
  })
  .finally(() => {
    load();
  });
}

const openNew = () => {
  dialog.value = true;
  fields.value = null;

  id.value = null;
  name.value = null;
  descricao.value = null;
  periodo.value = null;
  dia.value = null;
  mes.value = null;
  hora.value = null;
  data_inicio.value = null;
  data_fim.value = null;
}

const open = (data) => {  
  id.value = data.id;

  descricao.value = data.descricao;
  hora.value = data.hora;
  data_inicio.value = data.data_inicio;
  data_fim.value = data.data_fim;

  if (data.name) {
    availables.value.map(
      entry => {
        if (entry.value == data.name) {
          name.value = entry;
        }
      }
    );
  }

  periodos.value.map(
    entry => {
      if (entry.value == data.periodo) {
        periodo.value = entry;
        loadDays();

        if (data.periodo == "W") {
          days_of_weeks.value.map(
            dw => {
              if (dw.value == data.dia) {
                dia.value = dw;
              }
            }
          );
        }
        else {
          dia.value = { label : data.dia, value : data.dia };
        }
      }
    }
  );

  if (data.mes) {
    meses.value.map(
      entry => {
        if (entry.value == data.mes) {
          mes.value = entry;
        }
      }
    );
  }

  if (data.hora) {
    const _hora = moment("2010-01-01 " + data.hora);

    hora.value = {
      hours : _hora.hour(),
      minutes : _hora.minutes()
    };
  }

  loadFields();

  data.campos.map(
    field => {
      const _data = JSON.parse(field.campo);

      fields.value.map(
        (entry, index) => {
          if (_data.field.field == entry.field) {
            fieldsModel.value[index] = _data.value;
          }      
        }
      );
    }
  );

  dialog.value = true;
}

const deleteOpen = (data) => {
  id.value = data.id;

  dialogDelete.value = true;
}

onMounted(() => {
  load();
  loadAvailables();
});
</script>

<template>
  <Toast />
  <div class="grid">
		<div class="col-12 md:col-12">
      <div class="p-fluid">
        <div class="card">
          <h5>Automatizações</h5>
          <div class="formgrid grid" v-if="!loading">
            <div class="field col-3">
              <Button icon="pi pi-check" class="p-button-rounded p-button-success mr-2 mb-2" @click="openNew()" label="Adicionar novo" />
            </div>
          </div>
          <div class="col-12" v-if="loading">
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
            :value="automatizacoes"
            :loading="loading"
            responsiveLayout="scroll" 
            dataKey="id"
            v-if="!loading"
          >
            <template #empty v-if="!loading">                        
              <div>
                  <Message severity="info">Nenhum registro encontrado</Message>
              </div>
            </template>
            <template #list="slotProps">
                <div class="col-12">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">                                    
                                <div class="text-2xl font-bold text-900">{{ slotProps.data.descricao }}</div>                                
                                <div class="flex align-items-center gap-3">
                                    <span class="flex align-items-center gap-2">
                                        Comando: <span class="font-semibold">{{ slotProps.data.name }}</span>
                                    </span>                                    
                                </div>
                            </div>                            
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <Button icon="pi pi-pencil" rounded @click="open(slotProps.data)"></Button>
                                <Button icon="pi pi-trash" class="p-button-danger" rounded @click="deleteOpen(slotProps.data)"></Button>
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

  <Dialog v-model:visible="dialog" :style="{width: '80vw'}" header="Automatização" :modal="true" class="p-fluid">
    <div class="p-fluid">
      <div class="formgrid grid">
        <div class="field col-12">
          <label>Comando</label>
          <Dropdown 
            v-model="name" 
            :options="availables" 
            optionLabel="label" 
            placeholder="Selecione"
            @change="loadFields()"
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
        
        <div class="field col-12">
          <label>Descrição</label>
          <InputText v-model="descricao" />
        </div>

        <div class="field col-12" v-if="name">
          <Accordion v-if="fields">
            <AccordionTab header="Filtros">
              <div v-for="(field, index) in fields" v-bind:key="index">
                <div :class="'field ' + (field.col ?? 'md:col-6 col-12') ">
                  <label>{{ field.label }}</label>
                  
                  <Datepicker 
                    format="dd/MM/yyyy" 
                    locale="pt-br" 
                    :enable-time-picker="false" 
                    v-model="fieldsModel[index]"
                    v-if="field.type == 'D' && !field.defaults"
                  />
                  <Dropdown 
                      v-model="fieldsModel[index]" 
                      :options="field.defaults" 
                      optionLabel="label" 
                      placeholder="Selecione"
                      v-else-if="field.defaults"
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
                  <InputText v-else v-model="fieldsModel[index]" />
                </div>
              </div>
            </AccordionTab>
          </Accordion>
          <div v-else>
            <Message severity="info">Nenhum filtro encontrado</Message>
          </div>
        </div>        
        
        <div class="field col-12 md:col-3">
          <label>Período</label>
          <Dropdown 
            v-model="periodo" 
            :options="periodos" 
            optionLabel="label" 
            placeholder="Selecione"
            @change="loadDays()"
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
        <div class="field col-12 md:col-3" v-if="periodo && periodo.value == 'Y'">
          <label>Mês</label>
          <Dropdown 
            v-model="mes" 
            :options="meses" 
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
        <div class="field col-12 md:col-3" v-if="periodo && periodo.value != 'D'">
          <label>Dia</label>
          <Dropdown 
            v-model="dia" 
            :options="dias" 
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
        <div class="field col-12 md:col-3">
          <label>Horário</label>
          <Datepicker time-picker v-model="hora" />
        </div>
      </div>
      <div class="formgrid grid">
        <div class="field col-12 md:col-3">
          <label>Data de início</label>
          <Datepicker format="dd/MM/yyyy" locale="pt-br" :enable-time-picker="false" v-model="data_inicio" />
        </div>
        <div class="field col-12 md:col-3">
          <label>Data de fim</label>
          <Datepicker format="dd/MM/yyyy" locale="pt-br" :enable-time-picker="false" v-model="data_fim" />
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="dialog = false"/>
      <Button label="Confirmar" icon="pi pi-check" class="p-button-text" @click="preSave()"/>
    </template>			
  </Dialog>

  <Dialog v-model:visible="dialogConfirm" :style="{width: '80vw'}" header="Confirmação" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Deseja realmente salvar esta automatização?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="dialogConfirm = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="save()" />
    </template>
  </Dialog>
  <Dialog v-model:visible="dialogDelete" :style="{width: '80vw'}" header="Confirmação de exclusão" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Deseja realmente excluir esta automatização?</span>
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="dialogDelete = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="remove()" />
    </template>
  </Dialog>
</template>