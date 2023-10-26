<template>
  <div>
    <div id="form-campo-documento">
      <div class="formgrid grid">
      <!-- <Dialog> -->
        <!-- <div class="field md:col-12 col-12">
          <label for="name">Documento</label>
          <Dropdown v-model="documentoCampo.CODDOC" :options="documento" optionLabel="label" placeholder="Selecione">
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
              </div>
              <span v-else>
                {{slotProps.placeholder}}
              </span>
            </template>
          </Dropdown>
        </div> -->
        <!-- <div class="field md:col-12 col-12">
          <label for="codCampo">Código do campo:</label>
          <InputText id="horarioInicial" v-model="documentoCampo.NUMDCA" />
          <small class="p-invalid" v-if="submitted && !horarioVistoria.HORINI">Horário Inicial é requiredo.</small>
        </div> -->
        <div class="field md:col-12 col-12">
          <label for="name">Nome</label>
          <InputText v-model="documentoCampo.NOMDCA" />
        </div>
        <!-- <div class="field md:col-12 col-12">
          <label for="name">Campo do Documento</label>
          <InputText v-model="documentoCampo.CAMDOCDCA" />
        </div> -->
        <div class="field md:col-12 col-12">
          <label for="name">Campo do Documento</label>
          <InputText v-model="documentoCampo.CAMDOCDCA" />
        </div>
        <div class="field md:col-12 col-12">
          <label for="name">Campo do Sistema</label>
          <InputText v-model="documentoCampo.CAMSISDCA" />
        </div>
        <div class="field col-6 md:col-2 float-right">
          <Button label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
        </div>
        <div class="field col-6 md:col-2">
          <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
        </div>
      </div>

      <!-- </Dialog> -->
    </div>
  </div>
</template>

<script>
import DocumentoCampoService from '../../../../service/mudanca/DocumentoCampoService';
import DocumentoService from '../../../../service/mudanca/DocumentoService';
export default {

  props:["doc", "objDocumentoCampo"],

  created(){
    this.documentoCampoService = new DocumentoCampoService();
    this.documentoService = new DocumentoService();

    this.documentoCampo.CODDOC = this.doc;
    if(this.objDocumentoCampo != null){
      console.log("this.objDocumentoCampo", this.objDocumentoCampo);
      this.documentoCampo = this.objDocumentoCampo;
    }

    // this.documentoService.all().then((response)=>{
    //   console.log("1", response);
    //   response.map(
    //     (entry) => this.documento.push({label : entry.NOMDOC, value : entry.CODDOC})
    //   )
    // })

  },

  data(){
    return{
      documentoCampo: {
        CODEMP: 0,
        CODDOC: 0,
        NUMDCA: 0,
        NOMDCA: "",
        CAMDOCDCA: "",
        CAMSISDCA: "",
      },
      documento: [],
    }
  },

  methods: {
    back(){
      console.log("11111");
      this.$parent.back(0)
    },

    async save() {
      this.back();
      console.log("Salvando");
      let data = this.documentoCampo;
      console.log("this.codigo :>>", data);
      if (this.saving) return;
      this.submitted = true;
      this.saving = true;

      let response;
      if(data.NUMDCA == 0){
        response = await this.documentoCampoService.store(this.documentoCampo);
      }else{
        response = await this.documentoCampoService.update(this.documentoCampo);
      }

      if (response[0]) {
        this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Campo de documento salvo com sucesso', life: 3000});
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

<style>

</style>