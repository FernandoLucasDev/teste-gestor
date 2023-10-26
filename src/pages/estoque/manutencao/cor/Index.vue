<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <Toast/>
            <Translate text="Cadastro de Cor" />
            <hr />
            <div v-if="page == 0">
              <div class="formgrid grid">
  
                <!-- <div class="field col-5 md:col-3">
                      <label for="name">Código</label>
                      <InputText v-model="CODCOR" />
                </div> -->
                
                <div class="field md:col-12 col-12">
                      <label for="name">Descrição</label>
                      <InputText v-model="DESCOR" />
                </div>
                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaCor" />
                </div>
  
                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
                </div>
              </div>
            </div>
            <div v-if="page == 1" class="field col-12 md:col-12">
              <FormCor :cores="cadastroCor"/>
            </div>
          </div>
        </div>
        <ListaCor v-if="page == 0" ref="lista"/>
      </div>
    </div>
  </template>
  
  <script>
    import CorService from '../../../../service/estoque/CorService';
    import FormCor from './FormCor.vue'
    import ListaCor from './ListaCor.vue';
  
  export default {
    components:{
      FormCor,
      ListaCor,
  },
  
    data(){
      return{
        CorService: null,
        entidadeSrc : null,
        SelectCor: true,
        load: false,
        CODDOC: "",
        DESCOR:"",
        entidades: [],
        listCor: [],
        ListCampos: [],
        CampoDados: {},
        page: 0,
        cadastroCor: null,
      }
    },
  
    created(){
      this.corService = new CorService();
  
    //   this.corService.all().then((response) => {
    //       // this.veiculos = [];
    //       if (response.length) {
    //         console.log(response);
    //         response.map(
    //           (entry) => this.listCor.push({label : entry.NOMDOC, value : entry.CODDOC})
    //         );
    //         this.cor = this.listCor.find(cor => cor.value == this.CODDOC);
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
        this.cadastroCor = {};
      },
  
      novo() {
        this.page = 1;
      },
  
      edit(cadastroCor) {
        console.log("1", cadastroCor)
        this.page = 1;
        this.loading2 = true;
        this.cadastroCor = cadastroCor;
        console.log("2", this.cadastroCor)
        this.productDialog = true;
      },

      buscaCor(){
        this.$refs.lista.busca(this.DESCOR);
      },
  
  
    }
  
  }
  </script>
  
  <style>
  
  </style>