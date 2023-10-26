<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
        <Toast/>
        
        <Translate text="Processamento Empregado" />

        <hr />

        <div v-if="loading">
          <div class="formgrid grid">
            <div class="col-12">
              <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
            </div>          
          </div>          
        </div>
        <div v-else>
          <div v-if="page == 0">
            <div class="p-fluid">
              <div class="formgrid grid">
                <div class="field col-3">
                  <label for="cpf">Contato</label>
                  <InputText v-model.trim="cpf" autofocus />
                </div>
                <div class="field col-2">
                  <!-- <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchContato" /> -->
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 1.8em;" @click="searchContato" />
                </div>
              </div>

              <div class="formgrid grid">
                <div class="field col-3">
                  <label for="cpf">Entidade</label>
                  <InputText v-model.trim="entidadeSrc" />
                </div>
                <div class="field col-2">
                  <!-- <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="searchEntidade" /> -->
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 1.8em;" @click="searchEntidade" />
                </div>
              </div>
              
              <div class="formgrid grid">
                <div class="field col-3">
                  <Button label="Adicionar novo" icon="pi pi-plus" class="p-button-success" style="margin-top: 15%;" @click="openNew" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="page == 1">
            <FormEmpregado :contato="contato" :dependente="dependente" />
          </div>
          <div v-else-if="page == 2">
            <EmpregadosVue :data="contatos" />
          </div>
          <div v-else-if="page == 3">
            <EntidadesVue :data="entidades" />
          </div>
          <div v-else-if="page == 4">
            <EntidadeEmpregadosVue :data="entidade" :src="cpf" />
          </div>
          <div v-else-if="page == 5">
            <FinalizaEmpregado :data="contato" :extra="contatoExtra" :type="contatoFinalizaType" />
          </div>
        </div>
      </div>
		</div>
	</div>
</template>

<script>
import ContatoService from '../../../service/ContatoService';
import EntidadeService from '../../../service/EntidadeService';
import { cpfMask, } from '../../../defaults/mask';

import FormEmpregado from "./Form.vue";
import EmpregadosVue from './Empregados.vue';
import EntidadesVue from './Entidades.vue';
import EntidadeEmpregadosVue from './EntidadeEmpregados.vue';
import FinalizaEmpregado from './FinalizaEmpregado.vue';

import PermissaoMixin from "../../../mixins/Permissao";

export default {
  mixins : [PermissaoMixin],
	data() {
		return {
      loading : false,
      cpf : null,
      entidadeSrc : null,
      contato : null,
      contatoExtra : null,
      contatoFinalizaType : null,
      dependente : null,
      CodEnt : null,
      contatos : [],
      entidades : [],
      page : 0,
      srcOther : "N",
      otherOptions : [
				{ label : 'Não', value : "N" },
				{ label : 'Sim', value : "S" },
			]
    }
	},
  components: {
    FormEmpregado,
    EmpregadosVue,
    EntidadesVue,
    EntidadeEmpregadosVue,
    FinalizaEmpregado
  },
  contatoService : null,
  mounted() {
    this.contatoService = new ContatoService();

    console.log("Processamento Empregado");
    this.loadPermissoes("fpric16");    
  },
  watch : {
    'permissoes' : function () {
      console.log('permissoes');
      console.log(this.getPermissoes());
    }
  },
  methods : {
    onKeyUpCpf(ev) {
      this.cpf = cpfMask(ev.target.value);
    },
    async searchContato() {
      this.loading = true;

      this.page = 4;

      this.loading = false;
    },
    async searchEntidade() {
      this.loading = true;
      (new EntidadeService()).search(this.entidadeSrc)
      .then(response => {
        this.page = 3;
        this.entidades = response;
      })
      .finally(() => {
        this.loading = false
      });
    },
    openNew() {
      this.page = 1;
      this.contato = {};
    },
    openContato(data) {
      this.page = 1;
      this.dependente = null;
      this.contato = data;
    },
    openDependente(_contato, _dependente) {
      this.page = 1;
      this.contato = _contato;
      this.dependente = _dependente;
    },
    openEntidade(data) {
      this.page = 4;
      this.entidade = data;
    },
    openFinaliza(data, extra, type) {
      this.contato = data;
      this.contatoExtra = extra;
      this.contatoFinalizaType = type;

      this.page = 5;
    },
    contatoFactory(response) {
      this.dependente = null;
      if (response.length == 1) {
        this.page = 1;
        this.contato = response[0];
      }
      else {
        this.page = 2;
        this.contatos = response;
      }
    },
    back(page) {
      console.log("chegou", page);
      console.log("this.contatos", this.contatos);
      // this.page = 0;
      this.page = page;
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>