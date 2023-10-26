<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast />
          <Translate text="Cadastro de Documento" />
          <hr />
          <div>
            <div v-if="page == 0">
              <div class="formgrid grid">
                <div class="field col-12 md:col-3">
                  <label for="name">Código</label>
                  <InputNumber v-model="CODDOC" integeronly />
                </div>
                <div class="field md:col-12 col-12">
                  <label for="name">Nome</label>
                  <InputText v-model="NOMDOC" />
                </div>

                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
                </div>

                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;"
                    @click="buscaDocumento" />
                </div>


              </div>
            </div>
            <div v-else-if="page == 1">
              <FormDocumento :doc="documento" />
            </div>
          </div>
          <!-- <FormCampoDocumento /> -->
        </div>
      </div>
      <ListaDocumento ref="lista" v-if="page == 0" :NOMDOC="NOMDOC" :load="load"/>
    </div>
  </div>
</template>
  
<script>
import DocumentoService from '../../../../service/mudanca/DocumentoService';
import FormDocumento from './FormDocumento.vue'
import ListaDocumento from './ListaDocumento.vue'
// import FormCampoDocumento from './FormCampoDocumento.vue'

export default {

  data() {
    return {
      documentoService: null,
      SelectDocumento: true,
      CODDOC: null,
      listDocumentos: [],
      NOMDOC: "",
      DESDOC: "",
      ARQDOC: "",
      page: 0,
      documento: {},
      load: false
    }
  },

  components: {
    FormDocumento,
    ListaDocumento,
  },

  created() {

    this.load = true;
    setTimeout(() => {
      this.load = false;
    }, 2000);

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
  },

  mounted () {
    this.load = false;
    // this.CODDOC = this.mudancaSelected.CODDOC
    // this.NOMDOC = this.mudancaSelected.NOMDOC
    // this.DESDOC = this.mudancaSelected.DESDOC
    // this.ARQDOC = this.mudancaSelected.ARQDOC
  },




  methods: {

    back(page) {
      this.page = page;
      this.documento = {};
    },

    novo() {
      this.page = 1;
    },

    edit(documento) {
      console.log("akwe", documento)
      this.page = 1;
      this.loading2 = true;
      this.documento = documento;
      console.log("aaweaw", this.documento)
      this.productDialog = true;
    },

    buscaDocumento(){
      console.log(this.$refs);
      this.$refs.lista.busca(this.NOMDOC);
    },

  }

}
</script>
  
<style></style>