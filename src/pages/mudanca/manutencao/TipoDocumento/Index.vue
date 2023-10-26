<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <Toast/>
            <Translate text="Campo de Documento" />
            <hr />
            <div class="formgrid grid">
              <div class="field col-12 md:col-10">
                <label for="cliente">Cliente</label>
                <Dropdown id="tipoMudanca" v-model="documento" :options="listDocumentos" :disabled="documentoDisabled" optionLabel="label" placeholder="Selecione">
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
              <div class="field col-6 md:col-2">
                <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchEntidade" />
              </div>
  
              <div class="field col-6 md:col-2 float-right">
                <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="editEntidade" />
              </div>
            </div>
            <!-- <FormCampoDocumento /> -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import DocumentoService from '../../../../service/mudanca/DocumentoService';
  // import FormCampoDocumento from './FormCampoDocumento.vue'
  
  export default {
    components:{
      // FormCampoDocumento,
    },
  
    data(){
      return{
        documentoService: null,
        SelectDocumento: true,
        CODDOC: "",
        listDocumentos: [],
        ListCampos: [],
        CampoDados: {}
      }
    },
  
    created(){
      this.documentoService = new DocumentoService();
  
      this.documentoService.all().then((response) => {
          // this.veiculos = [];
          if (response.length) {
            console.log(response);
            // response.map(
            //   (entry) => this.listDocumentos.push({label : entry.NOMDOC, value : entry.CODDOC})
            // );
            // this.documento = this.listDocumentos.find(documento => documento.value == this.CODDOC);
          }
        }
      );
    }
  
  }
  </script>
  
  <style>
  
  </style>