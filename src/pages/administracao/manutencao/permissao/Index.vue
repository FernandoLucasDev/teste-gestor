<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast />
          <Translate text="Permissão" />
          <hr />
          <div>
            <div class="formgrid grid">
              <div class="field md:col-6 col-12">
                <label for="name">Sistema</label>
                <Dropdown @change="buscaTarefas" v-model="sistema" :options="listaSistema" optionLabel="label" placeholder="Selecione">
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
              <div class="field md:col-6 col-12">
                <label for="name">Grupo usuário</label>
                <Dropdown @change="buscaPermissoes" v-model="grupoUsuario" :options="listaGrupoUsuario" optionLabel="label" placeholder="Selecione">
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
            </div>
          </div>
        </div>
      </div>
      <ListaPermissao ref="lista" :listTarefa="listaTarefa" :totalRecords="totalRecords" :habilita="CODGRPUSU" />
    </div>
  </div>
</template>

<script>
import GrupoUsuarioService from "../../../../service/administracao/GrupoUsuarioService"
import SistemaService from "../../../../service/administracao/SistemaService"
import TarefaService from "../../../../service/administracao/TarefaService"
import PermissaoService from "../../../../service/PermissaoService"
import ListaPermissao from "./ListaPermissao.vue"

export default{
  components:{
    ListaPermissao
  },

  data(){
    return{
      CODSIS: null,
      CODGRPUSU: null,
      
      permissao: [],
      
      sistema: null,
      grupoUsuario: null,

      listaSistema: [],
      listaGrupoUsuario: [],
      listaTarefa: [],

      grupoUsuarioService: null,
      sistemaService: null,
      tarefaService: null,
    }
  },

  created(){
    //Inicializa os services
    this.grupoUsuarioService = new GrupoUsuarioService;
    this.sistemaService = new SistemaService;
    this.tarefaService = new TarefaService;
    this.permissaoService = new PermissaoService;
    
    this.grupoUsuarioService.all().then(response =>{
      response.map(
        (entry) => this.listaGrupoUsuario.push({label : entry.DESGRPUSU, value : entry.CODGRPUSU})
      )
    })

    this.sistemaService.all().then( response =>{
      response.map(
        (entry) => this.listaSistema.push({label : entry.NOMSIS, value : entry.CODSIS})
      )
    })

  },


  methods:{
    buscaTarefas(){
      this.CODSIS = this.sistema.value;
      this.CODGRPUSU = this.grupoUsuario ? this.grupoUsuario.value : null;

      let options = {
        CODSIS: this.CODSIS
      }

      if(this.CODSIS){
        this.$refs.lista.load = true;

        this.tarefaService.search(options)
        .then( response =>{
          this.totalRecords = response.length
          this.listaTarefa = response.map(
            (entry) => { 
              return {
                CAMTAR:entry.CAMTAR,
                CLATAR:entry.CLATAR,
                CODSIS:entry.CODSIS,
                CODTAB:entry.CODTAB,
                CODTAR:entry.CODTAR,
                CODTIPTAR:entry.CODTIPTAR,
                CODUSUALT:entry.CODUSUALT,
                CODUSUCAD: entry.CODUSUCAD,
                CODWSR: entry.CODWSR,
                CRIATATAR: entry.CRIATATAR,
                DATALT: entry.DATALT,
                DATCAD: entry.DATCAD,
                DESTAR: entry.DESTAR,
                ICOTAR: entry.ICOTAR,
                NOVJANTAR:entry.NOVJANTAR,
                PACTAR:entry.PACTAR,
                TIPLNKTAR: entry.TIPLNKTAR,
                TITTAR: entry.TITTAR,
                temPermissao: false
            }
          })
        })
        .finally(()=>{
          console.log(this.listaTarefa)
          this.$refs.lista.load = false;
        })
      }
    },

    buscaPermissoes(){
      this.$refs.lista.load = true;
      this.CODGRPUSU = this.grupoUsuario.value;
      this.permissaoService.procura(this.CODGRPUSU)
      .then( response =>{
        console.log(response);
        // this.listaTarefa = response;
        // console.log(response.length);
        this.listaTarefa = this.listaTarefa.map(
            (entry) => { 
              return {
                CAMTAR:entry.CAMTAR,
                CLATAR:entry.CLATAR,
                CODSIS:entry.CODSIS,
                CODTAB:entry.CODTAB,
                CODTAR:entry.CODTAR,
                CODTIPTAR:entry.CODTIPTAR,
                CODUSUALT:entry.CODUSUALT,
                CODUSUCAD: entry.CODUSUCAD,
                CODWSR: entry.CODWSR,
                CRIATATAR: entry.CRIATATAR,
                DATALT: entry.DATALT,
                DATCAD: entry.DATCAD,
                DESTAR: entry.DESTAR,
                ICOTAR: entry.ICOTAR,
                NOVJANTAR:entry.NOVJANTAR,
                PACTAR:entry.PACTAR,
                TIPLNKTAR: entry.TIPLNKTAR,
                TITTAR: entry.TITTAR,
                temPermissao: response.find(item => item.CODTAR == entry.CODTAR) ? true : false
            }
          })
          this.totalRecords = this.listaTarefa.length;
          console.log(this.listaTarefa);
      })
      .finally(()=>{
        this.$refs.lista.load = false;
      })
    },

    editaPermissao(permissao){
      let CODTAR = permissao.CODTAR;
      permissao.CODGRPUSU = this.CODGRPUSU;
      if(!permissao.temPermissao){
        this.permissaoService.store(permissao).then(response => {
          if (response[0]) {
            this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Permissão salva com sucesso', life: 5000});
            // this.$toast.add({severity:'warn', summary: 'Atenção', detail: 'Peça para o usuário fazer login novamente', life: 5000});
            setTimeout(() => {  this.$toast.add({severity:'warn', summary: 'Atenção', detail: 'Peça para o usuário fazer login novamente', life: 5000}); }, 1000);
          }
          else {
            this.$toast.add({severity:'error', summary: 'Erro', detail: 'Permissão não salva', life: 3000});
          }
          console.log("response", response);
        })
      }else{
        this.permissaoService.delete(CODTAR, this.CODGRPUSU).then(response => {
          console.log("response", response);
        })
      }
    }
  }


}

</script>