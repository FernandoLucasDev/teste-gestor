<template>
  <DataTable :value="entidades" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id" :rowHover="true" 
      filterDisplay="menu">      
      <template #header>
        <h3>Entidades</h3>
      </template>
      <template #empty>
          Nenhuma entidade encontrada
      </template>
      <template #loading>
          Loading customers data. Please wait.
      </template>
      <Column field="name" header="Entidade" style="min-width:12rem">
          <template #body="{data}">
              {{data.CODENT}} - {{data.NOMENT}}
          </template>
      </Column>                
      <Column field="name" header="CNPJ" style="min-width:12rem">
          <template #body="{data}">
              {{ data.DOCENT ? 
              (data.TIPDOCENT == 3 ? formatCnpj(data.DOCENT) : "")
              : "" }}
          </template>
      </Column>      
      <Column field="name" header="Cidade" style="min-width:12rem">
          <template #body="{data}">
              {{ data.DESCID }}
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
import { cnpjMask, } from '../../../defaults/mask';

export default {
  props : ['data'],
  data() {
    return {
      entidades : [],
      loading : false,
    }
  },
  mounted() {
    this.entidades = this.data;
    this.data.forEach(element => {
      let val = element.DOCENT.toString()
      element.DOCENT = val.padStart(14,'0');
    });
  },
  methods : {
    formatCnpj(cnpj) {
      return cnpjMask(cnpj.toString());
    },
    open(data) {
      this.$parent.openEntidade(data);
    },
    back() {
      this.$parent.back();
    },
  }
}
</script>