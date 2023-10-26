<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <!-- <div class="card"> -->
            <Toast/>
            <!-- <Translate text="Cadastro de Grupo de Usuário" /> -->
            <!-- <hr /> -->
            <div class="formgrid grid">
                <!-- <div class="field col-12 md:col-8">
                    <label for="name">Código</label>
                    <InputText v-model="grupoUsuario.CODGRPUSU"/>
                </div> -->
                <div class="field md:col-8 col-12">
                    <label for="name">Descrição</label>
                    <InputText v-model="grupoUsuario.DESGRPUSU"/>
                </div>

                <div class="field md:col-4 col-12">
                    <label for="name">Administrador</label>
                    <Dropdown v-model="administrador.ADMGRPUSU" :options="opcoes" optionLabel="label" placeholder="Selecione">
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
  import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
  // import FormGrupoUsuario from './FormCampoDocumento.vue'
  
  export default {
    props:["gus"],
    components:{
      // FormGrupoUsuario,
    },
  
    data(){
      return{
        grupoUsuario: {},
        grupoUsuarioService: null,
        SelectGrupoUsuario: true,
        listGrupoUsuario: [],
        codDisabled: false,
        opcoes: [
              { label: "Sim", value: "S" },
              { label: "Não", value: "N" },
          ],
        administrador: { label: "Não", value: "N" },
      }
    },
  
    created(){
      if(this.gus != null){
        this.codDisabled = true;
        this.grupoUsuario = this.gus;
      }
      console.log("codDisabled", this.codDisabled);
      console.log("iawieia", this.gus);
      this.grupoUsuarioService = new GrupoUsuarioService();
      // this.grupoUsuarioService.all().then((response) => {
      //     this.veiculos = [];
      //     if (response.length) {
      //       console.log(response);
      //       response.map(
      //         (entry) => this.listGrupoUsuario.push({label : entry.NOMDOC, value : entry.CODDOC})
      //       );
      //       this.grupoUsuario = this.listGrupoUsuario.find(grupoUsuario => grupoUsuario.value == this.CODDOC);
      //     }
      //   }
      // );
    
    },

    methods : {

        back(page){
          this.$parent.back(0)
        },

        async save() {
          console.log("Salvando");
          let data = this.grupoUsuario;
          console.log("this.codigo :>>", data);
          if (this.saving) return;
          this.submitted = true;
          this.saving = true;
          
          let response;
          if(this.grupoUsuario.CODGRPUSU){
            response = await this.grupoUsuarioService.update(this.grupoUsuario);
          }
          else{
            response = await this.grupoUsuarioService.store(this.grupoUsuario);
          }
          
          if (response[0]) {
            this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Grupo de Usuário salvo com sucesso', life: 3000});
          }
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Grupo de Usuário não salvo', life: 3000});
          }
          this.back();
          this.$parent.buscaGrupoUsuario();
          this.productDialog = false;
          this.saving = false;
        },
    }
}

  </script>
  
  <style>
  
  </style>