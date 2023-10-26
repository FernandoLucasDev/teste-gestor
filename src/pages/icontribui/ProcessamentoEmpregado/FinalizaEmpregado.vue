<template>
	<div class="grid">
	  <div class="col-12">
      <div class="p-fluid">
        <div class="formgrid grid">
          <div class="field col-12">
            Finalização de
          </div>
        </div>
        <div class="formgrid grid">
          <div class="field col-12" v-if="contato">
            <strong>{{ contato.NOMCON }}</strong>
          </div>
        </div>
        <div class="formgrid grid">
          <div class="field col-4">
            <label>Motivo</label>
            <Dropdown v-model="motivo" :options="motivos" optionLabel="label" placeholder="Selecione">
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
          <div class="col-12">
            <div class="formgrid grid">
              <div class="field col-2">
                <label>Data de Demissão</label>
                <Calendar v-model="DATDEMCON" dateFormat="dd/mm/yy" />
              </div>
            </div>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="col-3">
            <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
          </div>
          <div class="col-3">
            <Button label="Confirmar" icon="pi pi-check" class="p-button-warning" style="margin-top: 15%;" @click="deleteDialog = true" />
          </div>
          <div class="col-3" v-if="loading">
            <ProgressSpinner style="height: 50px;" />
          </div>
        </div>
      </div>
	  </div>
	</div>

  <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de finalização" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      Deseja realmente excluir o associado <b>{{contato.NOMCON}}</b>?
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirm" />
    </template>
  </Dialog>
</template>

<script>
import MotivoService from '../../../service/MotivoService';
import ProcessamentoEmpregadoService from '../../../service/ProcessamentoEmpregadoService';
import moment from "moment";

export default {
  props : ['data', 'extra', 'type'],
  processamentoEmpregadoService : null,
  data() {
    return {
      loading : false,
      deleteDialog : false,
      contato : null,
      DATDEMCON : "",
      motivo : null,
      motivos : []
    };
  },
  mounted() {
    this.contato = this.data;
    console.log(this.extra);
    this.processamentoEmpregadoService = new ProcessamentoEmpregadoService();

    (new MotivoService()).all()
    .then(
      (response) => {
        this.cargos = [];
        if (response.length) {
          response.map(
            (entry) => this.motivos.push({label : entry.DESMOT, value : entry.CODMOT})
          );
        }
      }      
    );
  },
  methods : {
    confirm() {
      console.log("confirm");
      this.loading = true;
      this.deleteDialog = false;

      let _data = {
        ...this.data,
        ...this.extra,
        type : this.type,
        DATDEMCON : moment(this.DATDEMCON).format("YYYY-MM-DD"),
        motivo : this.motivo.value,
        DESMOT: this.motivo.label
      };

      this.processamentoEmpregadoService.disable(_data)
      .then(resp => {
        this.$toast.add({severity:'success', summary: 'Sucesso', detail: this.contato.NOMCON + ' finalizado com sucesso', life: 5000});
      })
      .finally(() => {
        this.loading = false;
      });

    },
    back() {
      this.$parent.back();
    },
  }
}
</script>