<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <!-- <div class="card"> -->
            <Toast/>
            <!-- <Translate text="Cadastro de Cor" /> -->
            <!-- <hr /> -->
            <div class="formgrid grid">
                <!-- <div class="field col-5 md:col-3">
                    <label for="name">Código</label>
                    <InputNumber v-model="cor.CODCOR" :disabled="corDisabled"/>
                </div> -->
                <div class="field md:col-12 col-12">
                    <label for="name">Descrição</label>
                    <InputText v-model="cor.DESCOR"/>
                </div>
                <div class="field md:col-12 col-12">
                    <label for="name">Imagem</label>
                    <!-- <input type="file" id="input" multiple onchange="handleFiles(this.files)"> -->
                    <FileUpload mode="basic" name="demo[]" customUpload @select="getBase64($event)" :showCancelButton="false" accept="image/*" :maxFileSize="1000000">
                      <!-- <template #empty>
                          <p>Arraste e solte arquivos aqui.</p>
                      </template> -->
                    </FileUpload>
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
  import CorService from '../../../../service/estoque/CorService';
  // import FormTamanho from './FormCampoDocumento.vue'
  
  export default {
    props:["cores"],
    components:{
      // FormTamanho,
    },
  
    data(){
      return{
        cor: {},
        corService: null,
        SelectCor: true,
        listCor: [],
        ListCampos: [],
        CampoDados: {},
        corDisabled: false,
        reader: null,
      }
    },
  
    created(){
      
      if(this.cores != null){
        this.corDisabled = true,
        this.cor = this.cores;
      }
      console.log("iawieia", this.cores);
      this.corService = new CorService();
  
      // this.corService.all().then((response) => {
      //     this.veiculos = [];
      //     if (response.length) {
      //       console.log(response);
      //       response.map(
      //         (entry) => this.listCor.push({label : entry.NOMDOC, value : entry.CODDOC})
      //       );
      //       this.cor = this.listCor.find(cor => cor.value == this.CODDOC);
      //     }
      //   }
      // );
      
      this.reader = new FileReader();
    },

    methods : {

        back(page){
          this.$parent.back(0)
        },

        async save() {
          this.back();
          console.log("Salvando");
          let data = {};
          console.log("this.codigo :>>", data);
          if (this.saving) return;
          this.submitted = true;
          this.saving = true;

          let response;			
          if(this.cor.CODCOR){
            data = {CODCOR: this.cor.CODCOR, DESCOR: this.cor.DESCOR, IMGCOR: this.cor.IMGCOR}
            response = await this.corService.update(data);
          }else{
            data = {DESCOR: this.cor.DESCOR, IMGCOR: this.cor.IMGCOR}
            response = await this.corService.store(data);
          }

          if (response[0]) {
            this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Registro salvo com sucesso', life: 3000});
            this.$parent.buscaCor();
          }
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Registro não salvo', life: 3000});
          }
          this.productDialog = false;
          this.saving = false;
        },

        getBase64(event) {
          console.log("1", event);
          let file = event.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              console.log(reader.result);
              this.cor.IMGCOR = reader.result;
              // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
          };
          reader.readAsDataURL(file);
        },
 
        

    }
}

  </script>
  
  <style>
  
  </style>