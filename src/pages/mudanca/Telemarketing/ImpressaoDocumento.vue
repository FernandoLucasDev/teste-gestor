<template>
  <div>
    <div class="col-12">
      <DataTable :value="listaDocumentos" 
        :paginator="true" 
        :rows="10"
        :loading="loading"
        :totalRecords="totalRecords"
        responsiveLayout="scroll" 
        dataKey="CODENT"
        >      
          <template #empty v-if="!loading">
              Nenhuma mudança encontrada
          </template>
          <template #loading>
              <!-- Carregando mudanças. Por favor, aguarde... -->
              <ProgressSpinner style="height: 50px;" />
          </template>
          <template #footer v-if="!loading">
          Total de registros {{ totalRecords}}
          </template>
          <Column field="CODDOC" header="Código" :sortable="true" style="min-width:12rem">
              <template #body="{data}">
                  {{data.CODDOC}}
              </template>
          </Column>
          <Column field="NOMDOC" header="Nome" :sortable="true" style="min-width:12rem">
              <template #body="{data}">
                  {{data.NOMDOC}}
              </template>
          </Column>
          <Column field="DESDOC" header="Extensão" :sortable="true" style="min-width:12rem">
              <template #body="{data}">
                  {{data.DESDOC}}
              </template>
          </Column>
          <Column headerStyle="min-width:10rem; width:10rem;">
            <template #body="props">
                <Button icon="pi pi-download" v-tooltip.top="'Download'" class="p-button-rounded p-button-success mr-2" @click="baixaDocumento(props.data)" />
            </template>
          </Column>
      </DataTable>
    </div>
    <!-- <div class="col-6 md:col-2">
      <Button label="Documentos" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="openDocumentos" />
    </div> -->
  </div>
</template>

<script>
import DocumentoService from '../../../service/mudanca/DocumentoService';
import MudancaService from '../../../service/mudanca/MudancaService';

  export default {
    props: ["dadosMudanca"],
    data(){
      return {
        listaDocumentos: [],
        totalRecords: 0,
        documentoService: null,
        loading: false
      }
    },

    created(){
      let options = {};
      this.documentoService = new DocumentoService();
      this.mudancaService = new MudancaService();

      this.loading = true;
      this.documentoService.all().then((response)=>{
        // this.listaDocumentos = response;
        this.totalRecords = response.length;
        if (response.length) {
          response.map(
              (entry) => this.listaDocumentos.push(entry)
          );
        }
      }).finally(()=>{
        this.loading = false;
      });
    },

    methods: {
      baixaDocumento(dados){
        console.log("dados",dados);
        console.log("this.dadosMudanca",this.dadosMudanca);

        this.mudancaService.geraPDF(dados.CODDOC, this.dadosMudanca).then((response)=>{
          console.log("response pdf",response);
          
          const link = document.createElement('a');
          link.href = response.link;
          link.setAttribute('download', response.nome);
          document.body.appendChild(link);
          link.click();

        });
      },

      onPage(options){
        console.log("aquiii");
        this.busca(options);
      },

      busca(options){
        console.log("options ", options);
        this.loading = true;
        this.documentoService.all(options).then((response) => {
          this.listaDocumentos = [];

          console.log("response do lista ",response);
          this.totalRecords = response.totalRecords;
            if (response.data.length) {
            response.data.map(
              (entry) => this.listaDocumentos.push(entry)
            );
          }
        }).finally(()=>{
          this.loading = false;
        });
      }

    }
  }
</script>