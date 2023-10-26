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
                      <label for="name">Exibe altera comissão:</label>
                      <InputText v-model="parametro.EXIALTCOM"/>
                  </div>

                  <div class="field col-12 md:col-4">
                      <div v-if="!editando" class="field col-6 md:col-2">
                          <Button label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
                      </div>
    
                      <div v-if="editando" class="field col-6 md:col-2">
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
              gs: { label: "Selecione", value: "S" },
              parametro: {
                  CODEMP: null,
                  EXIALTCOM: null,
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
              data.EXIALTCOM = this.parametro.EXIALTCOM;

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
                      EXIALTCOM: null,
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