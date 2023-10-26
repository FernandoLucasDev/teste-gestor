<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <!-- <div class="card"> -->
            <Toast/>
            <!-- <Translate text="Parcelamento de Entrega" /> -->
            <!-- <hr /> -->
            <div class="formgrid grid">

                <div class="field col-12 md:col-8">
                    <label for="name">Quantidade</label>
                    <InputNumber v-model="parcelamentoEntrega.QTDPARENT" :min="0" :max="999" :class="{'p-invalid': submitted && (parcelamentoEntrega.QTDPARENT === undefined || parcelamentoEntrega.QTDPARENT === null)}"/>
                    <small class="p-invalid" v-if="submitted && (parcelamentoEntrega.QTDPARENT === undefined || parcelamentoEntrega.QTDPARENT === null)">Campo obrigatório.</small>
                </div>

                <div class="field md:col-4 col-12">
                    <label for="name">Tipo de Parcelamento:</label>
                    <Dropdown v-model="tipoParcelamento" :options="listaTipoParcelamento" optionLabel="label" placeholder="Selecione" :class="{'p-invalid': submitted && (parcelamentoEntrega.TIPPARENT === undefined || parcelamentoEntrega.TIPPARENT === '')}">
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                    <small class="p-invalid" v-if="submitted && (parcelamentoEntrega.TIPPARENT === undefined || parcelamentoEntrega.TIPPARENT === '')">Campo obrigatório.</small>
                </div>

                <div class="field col-12 md:col-12">
                    <label for="name">Descrição</label>
                    <InputText v-model="parcelamentoEntrega.DESPARENT" maxlength="30" :class="{'p-invalid': submitted && (parcelamentoEntrega.DESPARENT === undefined || parcelamentoEntrega.DESPARENT === '')}"/>
                    <small class="p-invalid" v-if="submitted && (parcelamentoEntrega.DESPARENT === undefined || parcelamentoEntrega.DESPARENT === '')">Campo obrigatório.</small>
                </div>

              <div class="field col-6 md:col-2 float-right">
                <Button label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
              </div>

              <div class="field col-6 md:col-2">
                <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
              </div>

            </div>
            <!-- <FormCampoDocumento /> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ParcelamentoEntregaService from '../../../../service/financeiro/ParcelamentoEntregaService';
  // import FormParcelamentoEntrega from './FormCampoDocumento.vue'
  
  export default {
    props:["pen"],
    components:{
      // FormParcelamentoEntrega,
    },
  
    data(){
      return{
        parcelamentoEntrega: {},
        tipoParcelamento: {},
        parcelamentoEntregaService: null,
        SelectParcelamentoEntrega: true,
        submitted: false,
        listParcelamentoEntrega: [],
        listaTipoParcelamento: [
              { label: "Dia", value: "D" },
              { label: "Mês", value: "M" },
          ],
        // codDisabled: false,
        
      }
    },
  
    created(){
      if(this.pen != null){
        // this.codDisabled = true;
        this.parcelamentoEntrega = this.pen;
        // this.tipoParcelamento = this.pen.TIPPARENT;
      }
    //   console.log("codDisabled", this.codDisabled);
      console.log("iawieia", this.pen);
      this.parcelamentoEntregaService = new ParcelamentoEntregaService();
      // this.parcelamentoEntregaService.all().then((response) => {
      //     this.veiculos = [];
      //     if (response.length) {
      //       console.log(response);
      //       response.map(
      //         (entry) => this.listParcelamentoEntrega.push({label : entry.NOMDOC, value : entry.CODDOC})
      //       );
      //       this.parcelamentoEntrega = this.listParcelamentoEntrega.find(parcelamentoEntrega => parcelamentoEntrega.value == this.CODDOC);
      //     }
      //   }
      // );
      
      if (this.parcelamentoEntrega.TIPPARENT == "D") {
        this.tipoParcelamento = { label: "Dia", value: "D" }
      }
      else if (this.parcelamentoEntrega.TIPPARENT == "M") {
        this.tipoParcelamento = { label: "Mês", value: "M" }
      }
    },

    methods : {

        back(page){
          this.$parent.back(0)
        },

        async save() {
          
          if (this.validaCampos() == true) return;
          this.back();
          console.log("Salvando");
          let data = this.parcelamentoEntrega;
          data.TIPPARENT = this.tipoParcelamento.value;
          console.log("this.codigo :>>", data);
          if (this.saving) return;
          this.submitted = true;
          this.saving = true;

          let response;

            if (this.parcelamentoEntrega.CODPARENT) {
              response = await this.parcelamentoEntregaService.update(this.parcelamentoEntrega);  
            }
            else{
              response = await this.parcelamentoEntregaService.store(this.parcelamentoEntrega);		
            }

          if (response[0]) {
            this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Parcelamento de entrega salvo com sucesso', life: 3000});
          }
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Parcelamento de entrega não salvo', life: 3000});
          }

          this.productDialog = false;
          this.saving = false;
          // this.$refs.ListaParcelamentoEntrega.busca("");
          window.location.reload();
        },

        validaCampos(){
          if(this.parcelamentoEntrega.QTDPARENT == null || this.parcelamentoEntrega.QTDPARENT == '' || this.parcelamentoEntrega.DESPARENT == null || this.parcelamentoEntrega.DESPARENT == '' || this.tipoParcelamento.value == undefined || this.tipoParcelamento.value == ''){
            this.submitted = true;
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencher os campos obrigatórios', life: 3000});
            return true;
          }
          else{
            this.submitted = false;
            return false;
          }
        },
    }
} 

  </script>
  
  <style>
  
  </style>