<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <Toast/>
            <Translate text="Cadastro de Praça" />
            <hr />
            <div v-if="page == 0">
              <div class="formgrid grid">
                <div class="field md:col-12 col-12">
                      <label for="name">Descrição</label>
                      <InputText v-model="DESPRA" />
                </div>
                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaPraca" />
                </div>
  
                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
                </div>
              </div>
            </div>
            <div v-if="page == 1" class="field col-12 md:col-12">
              <FormPraca :pra="cadastroPraca" />
            </div>
          </div>
        </div>
        <ListaPraca v-if="page == 0" ref="lista"/>
      </div>
    </div>
  </template>
  
  <script>
    import PracaService from '../../../../service/geral/PracaService';
    import FormPraca from './FormPraca.vue'
    import ListaPraca from './ListaPraca.vue';
  
  export default {
    components:{
      FormPraca,
      ListaPraca,
  },
  
    data(){
      return{
        PracaService: null,
        entidadeSrc: null,
        SelectPraca: true,
        load: false,
        CODDOC: "",
        DESPRA:"",
        entidades: [],
        listPraca: [],
        ListCampos: [],
        CampoDados: {},
        page: 0,
        cadastroPraca: null,
      }
    },
  
    created(){
      this.pracaService = new PracaService();
  
    //   this.pracaService.all().then((response) => {
    //       // this.veiculos = [];
    //       if (response.length) {
    //         // console.log(response);
    //         response.map(
    //           (entry) => this.listPraca.push({label : entry.NOMDOC, value : entry.CODDOC})
    //         );
    //         this.praca = this.listPraca.find(praca => praca.value == this.CODDOC);
    //       }
    //     }
    //   );
    },
  
    methods:{
    //   newCampo(CODDOC){
  
    //   },
  
      back(page) {
        // console.log("111112");
        // console.log(page);
        this.page = page;
        this.cadastroPraca = {};
      },
  
      novo() {
        this.page = 1;
      },
  
      edit(cadastroPraca) {
        // console.log("1", cadastroPraca)
        this.page = 1;
        this.loading2 = true;
        this.cadastroPraca = cadastroPraca;
        // console.log("2", this.cadastroPraca)
        this.productDialog = true;
      },

      buscaPraca(){
        this.$refs.lista.busca(this.DESPRA);
      },
  
  
    }
  
  }
  </script>
  
  <style>
  
  </style>