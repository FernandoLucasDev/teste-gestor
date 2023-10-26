<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <Toast/>
            <Translate text="Cadastro de Modelo" />
            <hr />
            <div v-if="page == 0">
              <div class="formgrid grid">
  
                <div class="field col-12 md:col-3">
                      <label for="name">Código</label>
                      <InputText v-model="CODMOD" />
                </div>
                
                <div class="field md:col-12 col-12">
                      <label for="name">Descrição</label>
                      <InputText v-model="DESMOD" />
                </div>
                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaModelo" />
                </div>
  
                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
                </div>
              </div>
            </div>
            <div v-if="page == 1" class="field col-12 md:col-12">
              <FormModelo :mod="cadastroModelo"/>
            </div>
          </div>
        </div>
        <ListaModelo v-if="page == 0" ref="lista"/>
      </div>
    </div>
  </template>
  
  <script>
    import ModeloService from '../../../../service/estoque/ModeloService';
    import FormModelo from './FormModelo.vue'
    import ListaModelo from './ListaModelo.vue';
  
  export default {
    components:{
      FormModelo,
      ListaModelo,
  },
  
    data(){
      return{
        ModeloService: null,
        entidadeSrc : null,
        SelectModelo: true,
        load: false,
        CODDOC: "",
        DESMOD:"",
        entidades: [],
        listModelos: [],
        ListCampos: [],
        CampoDados: {},
        page: 0,
        cadastroModelo: null,
      }
    },
  
    created(){
      this.modeloService = new ModeloService();
  
    //   this.modeloService.all().then((response) => {
    //       // this.veiculos = [];
    //       if (response.length) {
    //         console.log(response);
    //         response.map(
    //           (entry) => this.listModelos.push({label : entry.NOMDOC, value : entry.CODDOC})
    //         );
    //         this.modelo = this.listModelos.find(modelo => modelo.value == this.CODDOC);
    //       }
    //     }
    //   );
    },
  
    methods:{
    //   newCampo(CODDOC){
  
    //   },
  
      back(page) {
        console.log("111112");
        console.log(page);
        this.page = page;
        this.cadastroModelo = {};
      },
  
      novo() {
        this.page = 1;
      },
  
      edit(cadastroModelo) {
        console.log("1", cadastroModelo)
        this.page = 1;
        this.loading2 = true;
        this.cadastroModelo = cadastroModelo;
        console.log("2", this.cadastroModelo)
        this.productDialog = true;
      },

      buscaModelo(){
      this.$refs.lista.busca(this.DESMOD);
    },
  
  
    }
  
  }
  </script>
  
  <style>
  
  </style>