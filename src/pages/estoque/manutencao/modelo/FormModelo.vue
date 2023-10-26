<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <!-- <div class="card"> -->
            <Toast/>
            <!-- <Translate text="Cadastro de Modelo" /> -->
            <!-- <hr /> -->
            <div class="formgrid grid">
                <div class="field col-12 md:col-3">
                    <label for="name">Código</label>
                    <InputNumber v-model="modelo.CODMOD" :disabled="modDisabled"/>
                </div>
                <div class="field md:col-12 col-12">
                    <label for="name">Descrição</label>
                    <InputText v-model="modelo.DESMOD"/>
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
  import ModeloService from '../../../../service/estoque/ModeloService';
  // import FormTamanho from './FormCampoDocumento.vue'
  
  export default {
    props:["mod"],
    components:{
      // FormTamanho,
    },
  
    data(){
      return{
        modelo: {},
        modeloService: null,
        SelectModelo: true,
        listModelos: [],
        ListCampos: [],
        CampoDados: {},
        modDisabled: false,
        
      }
    },
  
    created(){
      
      if(this.mod != null){
        this.modDisabled = true,
        this.modelo = this.mod;
      }
      console.log("iawieia", this.mod);
      this.modeloService = new ModeloService();
  
      // this.modeloService.all().then((response) => {
      //     this.veiculos = [];
      //     if (response.length) {
      //       console.log(response);
      //       response.map(
      //         (entry) => this.listModelos.push({label : entry.NOMDOC, value : entry.CODDOC})
      //       );
      //       this.modelo = this.listModelos.find(modelo => modelo.value == this.CODDOC);
      //     }
      //   }
      // );
    
    },

    methods : {

        back(page){
          this.$parent.back(0)
        },

        async save() {
          this.back();
          console.log("Salvando");
          let data = this.modelo;
          console.log("this.codigo :>>", data);
          if (this.saving) return;
          this.submitted = true;
          this.saving = true;

          let response;			
          response = await this.modeloService.store(this.modelo);

          if (response[0]) {
            this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Modelo salvo com sucesso', life: 3000});
          }
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Modelo não salvo', life: 3000});
          }

          this.productDialog = false;
          this.saving = false;
        },

    }
}

  </script>
  
  <style>
  
  </style>