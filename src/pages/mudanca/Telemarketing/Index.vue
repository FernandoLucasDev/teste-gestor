<template>
	<div class="grid">
		<div class="col-12">
			<div class="card" :style="corStatus">
        <Toast/>
        
        <Translate text="Telemarketing" />

        <hr />

        <!-- <div v-if="loading">
          <div class="formgrid grid">
            <div class="col-12">
              <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
            </div>          
          </div>          
        </div> -->
        <!-- <div v-else> -->
        <div>
          <div v-if="page == 0">
            <div class="p-fluid">
              <div class="formgrid grid">
                <div class="field col-12 md:col-3">
                  <label for="telefone">Telefone</label>
                  <!-- <InputText v-model.trim="telefoneSrc" @input="(event) => {event.target.value = event.target.value.replace(/\D/g, '')}" /> -->
                  <InputText v-model="telefoneSrc" @keyup="filtrarNumeros" />
                  <!-- <InputText v-model.trim="telefoneSrc" @input="log" /> -->
                </div>
              <!-- </div>

              <div class="formgrid grid"> -->
                <div class="field col-12 md:col-9">
                  <label for="cliente">Cliente</label>
                  <InputText v-model.trim="entidadeSrc" />
                </div>
              </div>
              <div class="formgrid grid">
                <div class="field col-6 md:col-3">
                  <label for="cliente">Ano inicial:</label>
                  <Calendar inputId="anoInicial" v-model="anoInicial" view="year" dateFormat="yy" :showIcon="true"/>
                </div>
                <div class="field col-6 md:col-3">
                  <label for="cliente">Ano final:</label>
                  <Calendar inputId="anoInicial" v-model="anoFinal" view="year" dateFormat="yy" :showIcon="true"/>
                </div>
              </div>
              <div class="formgrid grid">
                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="load" />
                </div>
                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="editEntidade" />
                </div>
                <!-- <div class="field col-6 md:col-2 float-right">
                  <Button label="Log" class="p-button-success" style="margin-top: 15%;" @click="log" />
                </div> -->
              </div>
            </div>
          </div>
          <div v-else-if="page == 1">
            <FormEntidade :entidade="entidade" />
          </div>
          <div v-else-if="page == 2">
            <FormListaMudanca :entidade="entidade" />
          </div>
          <div v-else-if="page == 3">
            <FormMudanca :entidade="entidade" :mudanca="mudanca" />
          </div>
          <!-- <div v-else-if="page == 4">
            <EntidadeEmpregadosVue :data="entidade" :src="telefoneSrc" />
          </div> -->
          <!-- <div v-else-if="page == 5">
            <FinalizaEmpregado :data="contato" :extra="contatoExtra" :type="contatoFinalizaType" />
          </div> -->
        </div>
      </div>
		</div>
	</div>

  <div v-if="page == 0">
    <DataTable :value="entidades" 
      :lazy="true" 
      paginator
      :rows="10"
      :loading="loading"
      :totalRecords="totalRecords"
      @page="onPage($event)"
      @sort="onSort($event)"
      responsiveLayout="scroll" 
      dataKey="CODENT"
      >      
        <template #empty v-if="!loading">
            Nenhuma entidade encontrada
        </template>
        <template #loading>
            Carregando entidades. Por favor, aguarde...
        </template>
        <template #footer v-if="!loading">
          Total de registros {{ totalRecords}}
        </template>
        <Column field="NOMENT" header="Nome" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.NOMENT}}
            </template>
        </Column>
        <Column field="TELENT" header="Telefone" style="min-width:8rem">
            <template #body="slotProps">
              <div v-if="(!slotProps.data.DDDENT || !slotProps.data.TELENT) || (slotProps.data.TELENT && slotProps.data.TELENT.length < 8)">
                {{slotProps.data.TELENT}}
              </div>
              <div v-else>
                {{ formataTelefone(slotProps.data.DDDENT + slotProps.data.TELENT) }}
              </div>
            </template>
        </Column>    
        <Column headerStyle="min-width:10rem; width:10rem;">
          <template #body="props">
            <!-- <Button icon="pi pi-user-edit" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="editEntidade(props.data)" /> -->
            <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="editEntidade(props.data)" />
            <Button icon="pi pi-arrow-right" v-tooltip.top="'Avançar'" class="p-button-rounded p-button-warning mr-2" @click="selectEntidade(props.data)" />
          </template>
        </Column>
        
    </DataTable>
  </div>
</template>

<script>
import EntidadeService from '../../../service/EntidadeService';
import { cpfMask, telefoneMask } from '../../../defaults/mask';

import FormEntidade from "./FormEntidade.vue";
import FormListaMudanca from './FormListaMudanca.vue';
import FormMudanca from './FormMudanca.vue';

import PermissaoMixin from "../../../mixins/Permissao";

export default {
  mixins : [PermissaoMixin],
	data() {
		return {
      telefoneSrc : null,
      entidadeSrc : null,
      anoInicial: "",
      anoFinal: "",
      entidade : null,
      contatoExtra : null,
      CodEnt : null,
      entidades : [],
      dependente : null,

      loading : false,
      contatoFinalizaType : null,
      page : 0,
      srcOther : "N",
      otherOptions : [
				{ label : 'Não', value : "N" },
				{ label : 'Sim', value : "S" },
			],
      corStatus: "",

      // DataTable
      totalRecords : 0,
    }

	},
  components: {
    FormEntidade,
    FormListaMudanca,
    FormMudanca
  },
  entidadeService : null,
  mounted() {
    this.entidadeService = new EntidadeService();
    this.load();

    this.loadPermissoes("fdgmu02");
  },
  watch : {
    'permissoes' : function () {
//      console.log('permissoes');
//      console.log(this.getPermissoes());
    }
  },
  methods : {
    formataTelefone(tel){
      return telefoneMask(tel);
    },

    filtrarNumeros(event) {
      // Filtra os números e atualiza o v-model
      event.target.value = event.target.value.replace(/\D/g, "");
    },

    log(evento){
      console.log('evento :>> ', evento);
      console.log('evento :>> ', evento.target.value.replace(/\D/g, ''));
    },

    editEntidade(data) {
      this.entidade = data
      this.page = 1
//      this.$parent.openContato(data);
    },
    selectEntidade(data) {
      this.entidade = data
      this.page = 2
    },
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
      (new EntidadeService()).procura(this.entidadeSrc, this.telefoneSrc)
      .then(response => {
//        this.page = 3;
        this.totalRecords = response.data.totalRecords;
        this.entidades = response.data;
//        console.log(this.entidades);
      })
      .finally(() => {
        this.loading = false
      });

      this.load();
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
      this.page = page
      this.corStatus = "";
      this.load();
    },
    newMudanca() {
      this.page = 3
    },
    load(options) {
      this.loading = true;

      (new EntidadeService()).procuraByMudanca(this.entidadeSrc != "" ? this.entidadeSrc : null, this.telefoneSrc != "" ? this.telefoneSrc : null, this.anoInicial ? this.anoInicial.getUTCFullYear() : null, this.anoFinal ? this.anoFinal.getUTCFullYear() : null, options)
      // (new EntidadeService()).all(options)
      .then(response => {
        // this.totalRecords = response.data.length;
        this.totalRecords = response.totalRecords;
        // response.data.forEach((entidade)=>{
        //   entidade.TELENT = telefoneMa;sk(entidade.TELENT);
        // })
        this.entidades = response.data
        console.log("responseeee",response)
      })
      .finally(() => {
        this.loading = false;
      });
    },

    onPage(event) {
      console.log(event);
      this.load(event);
    },
    onSort(event) {
      console.log(event);
      this.load(event);
    },

    corBorda(cor){
    if(this.page == 3){
      this.corStatus = `border: 3px solid ${cor};`;
    }
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>