<template>
  <div>
  <div class="p-fluid">
    <div class="grid">  
      <div class="col-12">
        <Toast/>
            <!-- <hr /> -->
              <div>
              <div class="formgrid grid">
                  <div class="field col-12 md:col-4">
                    <label for="name">Cor barra de navegação: </label>
                    <InputText v-model="parametro.CORTOLBAR" />
                    <small id="username-help">Exemplo formato hexadecimal: #FFFFFF</small>
                  </div>
                  <div class="field col-12 md:col-4">
                    <label for="name">Cor do texto da barra de navegação: </label>
                    <InputText v-model="parametro.CORTEXTOLBAR" />
                    <small id="username-help">Exemplo formato hexadecimal: #FFFFFF</small>
                  </div>
                  <div class="field col-12 md:col-4">
                    <label for="name">Cor menu:</label>
                    <InputText v-model="parametro.CORMENU" />
                    <small id="username-help">Exemplo formato hexadecimal: #FFFFFF</small>
                  </div>
                  <div class="field col-12 md:col-4">
                    <label for="name">Cor do texto menu:</label>
                    <InputText v-model="parametro.CORTEXMENU" />
                    <small id="username-help">Exemplo formato hexadecimal: #FFFFFF</small>
                  </div>
                  
                  <div class="field col-12 md:col-4">
                      <div v-if="!editando" class="field col-6 md:col-4">
                          <Button label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
                      </div>
    
                      <div v-if="editando" class="field col-6 md:col-4">
                          <Button label="Alterar" icon="pi pi-pencil" class="p-button-warning" style="margin-top: 15%;" @click="save" />
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div> 
  </div>
</template>

<script>
  import ParametroService from '../../../../service/geral/ParametroService';

  export default {
      props:["editando", "propParametro"],
      data() {
          return {
              parametro: {
                CORTOLBAR: null,
                CORTEXTOLBAR: null,
                CORMENU: null,
                CORTEXMENU: null,
                CORBOTAO: null,
              },
              parametroService:null,
          }
      },

      created() {
          this.parametro = this.propParametro[0] ? this.propParametro[0] : {};
          this.parametroService = new ParametroService();
      },

      methods: {
          preencheDados(dados) {
              this.parametro = dados[0];
          },

          async save(){
              let data = this.parametro;
              data.CODEMP = this.propParametro[0].CODEMP;
              data.CORTOLBAR = this.parametro.CORTOLBAR;
              data.CORTEXTOLBAR = this.parametro.CORTEXTOLBAR;
              data.CORMENU = this.parametro.CORMENU;
              data.CORTEXMENU = this.parametro.CORTEXMENU;
              data.CORBOTAO = this.parametro.CORBOTAO;

              // console.log("Salvando");
              // console.log("this.codigo :>>", data);
              if (this.saving) return;
              this.submitted = true;
              this.saving = true;

              let response;
              if(this.editando){
                  response = await this.parametroService.update(data);
              }else{
                  response = await this.parametroService.store(data);
              }

              if (response[0]) {
                  this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Campo de documento salvo com sucesso', life: 3000});
                  this.parametro = {
                      CODEMP: null,
                      CORTOLBAR: null,
                      CORTEXTOLBAR: null,
                      CORMENU: null,
                      CORTEXMENU: null,
                  }
              }
              else {
                  this.$toast.add({severity:'error', summary: 'Erro', detail: 'Campo de documento não salvo', life: 3000});
              }

              this.productDialog = false;
              this.saving = false;
          },
      },
  }
</script>

<style lang="scss" scoped>

</style>