<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <Translate text="Campo de Documento" />
          <hr />
          <div v-if="page == 0">
            <div class="formgrid grid">
              <div class="field md:col-12 col-12">
                <label for="name">Documento</label>
                <Dropdown @change="buscaDocumentoCampo" v-model="documento" :options="listDocumento" optionLabel="label" placeholder="Selecione">
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

              <!-- <div class="field md:col-12 col-12">
                    <label for="name">Nome</label>
                    <InputText v-model="NOMDCA" />
              </div> -->
              
              <!-- <div class="field md:col-12 col-12">
                    <label for="name">Campo do Sistema</label>
                    <InputText v-model="CAMSISDCA" />
              </div> -->
              <!-- <div class="field col-6 md:col-2">
                <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaDocumentoCampo" />
              </div> -->

              <div class="field col-6 md:col-2 float-right">
                <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
              </div>
            </div>
          </div>
          <div v-if="page == 1" class="field col-12 md:col-12">
            <FormCampoDocumento :doc="documento.value" :objDocumentoCampo="documentoCampo"/>
          </div>
        </div>
      </div>
      <ListaCamposDocumento v-if="page == 0" ref="lista"/>
    </div>
  </div>
</template>

<script>
import DocumentoService from '../../../../service/mudanca/DocumentoService';
import DocumentoCampoService from '../../../../service/mudanca/DocumentoCampoService';
import FormCampoDocumento from './FormCampoDocumento.vue'
import ListaCamposDocumento from './ListaCamposDocumento.vue';

export default {
  components:{
    FormCampoDocumento,
    ListaCamposDocumento
},

  data(){
    return{
      documentoService: null,
      documentoCampoService: null,
      entidadeSrc: null,
      SelectDocumento: true,
      load: false,
      CODDOC: null,
      CAMSISDCA: "",
      entidades: [],
      listDocumento: [],
      listDocumentoCampo: [],
      ListCampos: [],
      CampoDados: {},
      page: 0,
      documento: {},
      objDocumento: {},
      documentoCampo: null,
    }
  },

  created(){
    this.documentoService = new DocumentoService();
    this.documentoCampoService = new DocumentoCampoService();
    let options = {};
    this.documentoService.all(options).then((response) => {
        if (response.length) {
          response.map(
            (entry) => this.listDocumento.push({label : entry.NOMDOC, value : entry.CODDOC})
          );
          // this.documento = this.listDocumento.find(documento => documento.value == this.CODDOC);
        }
      }
    );

    // this.documentoCampoService.all().then((response) => {
    //     // this.veiculos = [];
    //     if (response.length) {
    //       console.log(response);
    //       response.map(
    //         (entry) => this.listDocumentoCampo.push({label : entry.NOMDOC, value : entry.CODDOC})
    //       );
    //       this.documentoCampo = this.listDocumentoCampo.find(documento => documento.value == this.CODDOC);
    //     }
    //   }
    // );
  },

  methods:{
    newCampo(CODDOC){

    },

    back(page) {
      console.log("111112");
      console.log(page);
      this.page = page;
      this.documentoCampo = {};
      setTimeout(() => {
        this.buscaDocumentoCampo();
      }, 500);
    },

    novo() {
      this.page = 1;
    },

    edit(documentoCampo) {
      console.log("1", documentoCampo)
      this.page = 1;
      this.loading2 = true;
      this.documentoCampo = documentoCampo;
      console.log("2", this.documentoCampo)
      this.productDialog = true;
    },

    buscaDocumentoCampo(){
      this.$refs.lista.busca(this.documento.value);
    },


  }

}
</script>

<style>

</style>