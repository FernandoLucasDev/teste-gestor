<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <Translate text="Cadastro de Grupo de Usuário" />
          <hr />
          <div v-if="page == 0">
            <div class="formgrid grid">

              <!-- <div class="field col-12 md:col-8">
                    <label for="name">Código</label>
                    <InputText v-model="CODGRPUSU"/>
              </div> -->
              <div class="field md:col-8 col-12">
                    <label for="name">Descrição</label>
                    <InputText v-model="DESGRPUSU" />
              </div>

              <div class="field md:col-4 col-12">
                    <label for="name">Administrador</label>
                    <Dropdown v-model="administrador" showClear :options="opcoes" optionLabel="label" placeholder="Selecione">
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
              
              <div class="field col-6 md:col-2">
                <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaGrupoUsuario" />
              </div>

              <div class="field col-6 md:col-2 float-right">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" style="margin-top: 15%;" @click="novo" />
              </div>
            </div>
          </div>
          <div v-if="page == 1" class="field col-12 md:col-12">
            <FormGrupoUsuario :gus="cadastroGrupoUsuario"/>
          </div>
          <!-- <div v-else-if="page == 2">
            <Descricao :data="entidades"/>
            <Descricao :data="entidade" :src="cpf" />
          </div> -->
        </div>
      </div>
      <ListaGrupoUsuario v-if="page == 0" ref="lista" :DESGRPUSU="DESGRPUSU" :load="load"/>
    </div>
  </div>
</template>

<script>
  import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
  import FormGrupoUsuario from './FormGrupoUsuario.vue'
  import ListaGrupoUsuario from './ListaGrupoUsuario.vue';
  // import Descricao from './Descricao.vue';
  // import EntidadeService from '../../../../service/EntidadeService';

export default {
  components:{
    FormGrupoUsuario,
    ListaGrupoUsuario,
    // Descricao,
},

  data(){
    return{
      GrupoUsuarioService: null,
      entidadeSrc : null,
      SelectGrupoUsuario: true,
      load: false,
      CODGRPUSU: "",
      DESGRPUSU: "",
      entidades : [],
      listGrupoUsuario: [],
      ListCampos: [],
      CampoDados: {},
      page: 0,
      cadastroGrupoUsuario: null,
      opcoes: [
              { label: "Sim", value: "S" },
              { label: "Não", value: "N" },
          ],
      administrador: null,
    }
  },

  created(){
    this.grupoUsuarioService = new GrupoUsuarioService();

  //   this.grupoUsuarioService.all().then((response) => {
  //       // this.veiculos = [];
  //       if (response.length) {
  //         console.log(response);
  //         response.map(
  //           (entry) => this.listGrupoUsuario.push({label : entry.NOMDOC, value : entry.CODDOC})
  //         );
  //         this.grupoUsuario = this.listGrupoUsuario.find(grupoUsuario => grupoUsuario.value == this.CODDOC);
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
      this.cadastroGrupoUsuario = {};
    },

    novo() {
      this.page = 1;
    },

    edit(cadastroGrupoUsuario) {
      console.log("1", cadastroGrupoUsuario)
      this.page = 1;
      this.loading2 = true;
      this.cadastroGrupoUsuario = cadastroGrupoUsuario;
      console.log("2", this.cadastroGrupoUsuario)
      this.productDialog = true;
    },

    buscaGrupoUsuario(){
      let filtro = {
        DESGRPUSU: this.DESGRPUSU,
        ADMGRPUSU: this.administrador ? this.administrador.value: ""
      }
      this.$refs.lista.busca(filtro);
    },


  }

}
</script>

<style>

</style>