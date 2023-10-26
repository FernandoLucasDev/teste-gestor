<template>
  <DataTable :value="contatos" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true" 
      filterDisplay="menu">      
      <template #header>
        <h3>Contatos</h3>
      </template>
      <template #empty>
          <div class="formgrid grid">
            <div class="field col-12">
              Nenhum contato encontrado
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col-3">
              <Button label="Adicionar novo" icon="pi pi-plus" class="p-button-success" style="margin-top: 15%;" @click="openNew" />
            </div>
          </div>
      </template>
      <template #loading>
          Loading customers data. Please wait.
      </template>
      <Column field="name" header="Entidade" style="min-width:12rem">
          <template #body="{data}">
              {{data.entidade.CODENT}} - {{data.entidade.NOMENT}}
          </template>
      </Column>                
      <Column field="name" header="Nome" style="min-width:12rem">
          <template #body="{data}">
              {{data.NOMCON}}
          </template>
      </Column>
      <Column field="name" header="CPF" style="min-width:8rem">
          <template #body="{data}">
              {{data.CPFCON}}
          </template>
      </Column>
      <Column field="name" header="Nascimento" style="min-width:8rem">
          <template #body="{data}">
              {{ data.DATNASCON ? formatData(data.DATNASCON) : "" }}
          </template>
      </Column>
      <Column field="name" header="Admissão" style="min-width:8rem">
          <template #body="{data}">
              {{ data.DATADMCON ? formatData(data.DATADMCON) : "" }}
          </template>
      </Column>
      <Column headerStyle="min-width:10rem; width:10rem;">
        <template #body="props">
          <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="open(props.data)" />
        </template>
      </Column>
  </DataTable>

  <div class="formgrid grid">
    <div class="col-3">
      <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
    </div>  
  </div>
</template>
<script>
import moment from "moment";

export default {
  props : ['data'],
  data() {
    return {
      contatos : []
    }
  },
  mounted() {
    this.contatos = this.data;
    console.log('this.data :>> ', this.data);
  },
  methods : {
    open(data) {
      this.$parent.openContato(data);
    },
    openNew() {
      this.$parent.openNew();
    },
    back() {
      this.$parent.back(1);
    },
    formatData(date) {
      return moment(date).format("DD/MM/YYYY");
    }
  }
}
</script>