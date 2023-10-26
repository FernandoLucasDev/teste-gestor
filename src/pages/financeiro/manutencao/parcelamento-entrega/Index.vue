<template>
    <div class="p-fluid">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <Toast/>
            <Translate text="Parcelamento de Entregas" />
            <hr />
            <div v-if="page == 0">
              <div class="formgrid grid">
  
                <div class="field col-12 md:col-8">
                      <label for="name">Quantidade</label>
                      <InputNumber v-model="QTDPARENT"/>
                </div>

                <div class="field md:col-4 col-12">
                    <label for="name">Tipo de Parcelamento:</label>
                    <Dropdown v-model="tipoParcelamento" :options="listaTipoParcelamento" optionLabel="label" placeholder="Selecione">
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

                <div class="field col-12 md:col-12">
                      <label for="name">Descrição</label>
                      <InputText v-model="DESPARENT"/>
                </div>

                <div class="field col-6 md:col-2">
                  <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 15%;" @click="buscaParcelamentoEntrega" />
                </div>
  
                <div class="field col-6 md:col-2 float-right">
                  <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
                </div>
              </div>
            </div>
            <div v-if="page == 1" class="field col-12 md:col-12">
              <FormParcelamentoEntrega :pen="cadastroParcelamentoEntrega" />
            </div>
          </div>
        </div>
        <ListaParcelamentoEntrega v-if="page == 0" ref="lista"/>
      </div>
    </div>
  </template>
  
  <script>
    import ParcelamentoEntregaService from '../../../../service/financeiro/ParcelamentoEntregaService';
    import FormParcelamentoEntrega from './FormParcelamentoEntrega.vue'
    import ListaParcelamentoEntrega from './ListaParcelamentoEntrega.vue';
  
  export default {
    components:{
      FormParcelamentoEntrega,
      ListaParcelamentoEntrega,
  },
  
    data(){
      return{
        ParcelamentoEntregaService: null,
        entidadeSrc: null,
        SelectParcelamentoEntrega: true,
        load: false,
        CODDOC: "",
        QTDPARENT:null,
        DESPARENT:null,
        tipoParcelamento: {},
        entidades: [],
        listParcelamentoEntrega: [],
        ListCampos: [],
        listaTipoParcelamento: [
              { label: "Dia", value: "D" },
              { label: "Mês", value: "M" },
          ],
        CampoDados: {},
        page: 0,
        cadastroParcelamentoEntrega: null,
      }
    },
  
    created(){
      this.parcelamentoEntregaService = new ParcelamentoEntregaService();
  
    //   this.parcelamentoEntregaService.all().then((response) => {
    //       // this.veiculos = [];
    //       if (response.length) {
    //         console.log(response);
    //         response.map(
    //           (entry) => this.listParcelamentoEntrega.push({label : entry.NOMDOC, value : entry.CODDOC})
    //         );
    //         this.parcelamentoEntrega = this.listParcelamentoEntrega.find(parcelamentoEntrega => parcelamentoEntrega.value == this.CODDOC);
    //       }
    //     }
    //   );
    },
  
    methods:{
  
      back(page) {
        console.log("111112");
        console.log(page);
        this.page = page;
        this.cadastroParcelamentoEntrega = {};
      },
  
      novo() {
        this.page = 1;
      },
  
      edit(cadastroParcelamentoEntrega) {
        console.log("1", cadastroParcelamentoEntrega)
        this.page = 1;
        this.loading2 = true;
        this.cadastroParcelamentoEntrega = cadastroParcelamentoEntrega;
        console.log("2", this.cadastroParcelamentoEntrega)
        this.productDialog = true;
      },

      buscaParcelamentoEntrega(){
        this.$refs.lista.busca(this.DESPARENT);
      },
  
  
    }
  
  }
  </script>
  
  <style>
  
  </style>