<template>
  <form @submit.prevent="save">
    <div class="formgrid grid">
      <!-- <div class="field col-12 md:col-3">
          <label for="name">Código</label>
          <InputNumber v-model="documento.CODDOC"/>
      </div> -->
      <!-- <div class="field col-12 md:col-6 lg:col-6"> -->
      <div class="field col-12" :class="{'md:col-6 lg:col-6': documento.TIPDOC == 1, 'md:col-8 lg:col-8': documento.TIPDOC != 1 ||  !documento.TIPDOC}">
          <label for="name">Nome*</label>
          <InputText v-model="documento.NOMDOC" :class="{'p-invalid': submitted && !documento.NOMDOC}"/>
          <small class="p-error" v-if="submitted && !documento.NOMDOC">Este campo é obrigatório.</small>
      </div>
      <div class="field col-12" :class="{'md:col-3 lg:col-3': documento.TIPDOC == 1, 'md:col-4 lg:col-4': documento.TIPDOC != 1 ||  !documento.TIPDOC}">
        <label for="name">Tipo*</label>
        <Dropdown
          :options="listaTiposDocumeto"
          :class="{'p-invalid': submitted && !tipoDocumento.value}"
          optionLabel="label"
          v-model="tipoDocumento"
          placeholder="Selecione">
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
            </div>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
        </Dropdown>
        <small class="p-error" v-if="submitted && !documento.TIPDOC">Este campo é obrigatório.</small>
      </div>
      <div v-if="documento.TIPDOC == 1" class="field col-12 md:col-3 lg:col-3">
        <label for="name">Extensão*</label>
        <Dropdown
          :options="listaExtensaoDocumeto"
          :class="{'p-invalid': submitted && !extensaoDocumento.value}"
          optionLabel="label"
          v-model="extensaoDocumento"
          placeholder="Selecione">
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
            </div>
            <span v-else>
              {{slotProps.placeholder}}
            </span>
          </template>
        </Dropdown>
        <small class="p-error" v-if="submitted && !extensaoDocumento.value">Este campo é obrigatório.</small>
      </div>
      <div class="field col-12 md:col-12 lg:col-12">
          <label for="name">Descrição*</label>
          <InputText v-model="documento.DESDOC" :class="{'p-invalid': submitted && !documento.DESDOC}"/>
          <small class="p-error" v-if="submitted && !documento.DESDOC">Este campo é obrigatório.</small>
      </div>
      <div v-if="documento.TIPDOC == 1" class="field col-12 md:col-12 lg:col-6">
        <label for="name">Base*</label>
        <FileUpload class="bg-blue-500 border border-blue-500" :class="{'border border-red-500': submitted && !arquivoBase}" mode="basic" customUpload @select="uploadBase" @clear="removeBase"/>
        <small class="p-error" v-if="submitted && !arquivoBase">Este campo é obrigatório.</small>
      </div>
      <div v-else-if="documento.TIPDOC == 2" class="field md:col-12 col-12">
        <label for="name">Conteúdo*</label>
        <Editor v-model="documento.CONDOC" editorStyle="height: 320px"/>
        <small class="p-error" v-if="submitted && !documento.CONDOC">Este campo é obrigatório.</small>
      </div>
    </div>
    <!-- <div class="formgrid grid"> -->
    <!-- </div> -->
    <div class="formgrid grid">
      <div class="field col-6 md:col-2 float-right">
        <Button icon="pi pi-arrow-left" label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
      </div>

      <div class="field col-6 md:col-2">
        <Button :loading="loading" label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
      </div>

      <!-- <div class="field col-12 md:col-2">
        <Button label="Abrir doc" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="openDoc" />
      </div> -->
    </div>
  </form>
  </template>
  
  <script>
  import DocumentoService from '../../../../service/mudanca/DocumentoService';
  
  export default {
    props:["doc"],
  
    data(){
      return{
        documento: {},
        documentoService: null,
        SelectDocumento: true,
        listDocumentos: [],
        ListCampos: [],
        CampoDados: {},
        listaTiposDocumeto: [
          {value: 1, label: "Documento"},
          {value: 2, label: "PDF"}
        ],
        listaExtensaoDocumeto: [
          {value: 1, label: "Doc/Docx"},
          {value: 2, label: "XLSX"}
        ],
        tipoDocumento: {},
        extensaoDocumento: {},
        arquivoBase: null,
        loading: false,
        submitted: false
      }
    },
  
    created(){
      this.documento = this.doc;
      this.tipoDocumento = this.listaTiposDocumeto.find(item => item.value == parseInt(this.doc.TIPDOC));
      console.log("created", this.doc);
      this.documentoService = new DocumentoService();
    },

    watch: {
      tipoDocumento(novoValor){
        this.documento.TIPDOC = novoValor.value;
      },

      extensaoDocumento(novoValor){
        // this.documento.TIPDOC = novoValor.value;
      }
    },

    methods : {

      uploadBase(base){
        console.log("base",base);
        this.arquivoBase = base;
      },

      removeBase(base){
        this.arquivoBase = null;
      },

      formataDocumento(){
        let str = this.documento.CONDOC;
        str = str.replaceAll('class="ql-align-center"', 'style="text-align: center;"');
        str = str.replaceAll('class="ql-align-justify"', 'style="text-align: justify;"');
        str = str.replaceAll('class="ql-syntax"', 'style="background-color: #23241f;color: #f8f8f2;overflow: visible;"');
        return str;
      },

      async openDoc(){
        this.documento.CONDOC = await this.formataDocumento();

        // const reader = new FileReader();
        this.documentoService.getPDF(this.documento.CODDOC).then((response)=>{

          const link = document.createElement('a');
          link.href = response;
          link.setAttribute('download', 'test.pdf');
          document.body.appendChild(link);
          link.click();
        });
      },

      back(page){
        this.$parent.back(0)
      },

      validaCampos(){
        if(
          (this.documento.NOMDOC && this.documento.NOMDOC != "" && this.documento.NOMDOC != null) &&
          (this.documento.DESDOC && this.documento.DESDOC != "" && this.documento.DESDOC != null) &&
          (this.documento.TIPDOC && this.documento.TIPDOC != "" && this.documento.TIPDOC != null)
        ){
          if(
            (this.documento.TIPDOC == 1 && this.arquivoBase != null && this.arquivoBase != undefined && this.extensaoDocumento.value) ||
            (this.documento.TIPDOC == 2 && (this.documento.CONDOC != null && this.documento.CONDOC != ""))
            ){
            return true;
          }
        }
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Verifique os campos obrigatórios!', life: 3000});
        return false;
      },

      async save() {

        this.submitted = true;
        if(!this.validaCampos()) return;
        
        let data = new FormData();
        
        if(this.documento.CONDOC && this.documento.TIPDOC == 2){
          this.documento.CONDOC = this.documento.CONDOC.replaceAll('class="ql-align-center"', 'style="text-align: center;"')
        }
        else if(this.documento.TIPDOC == 1 && this.arquivoBase){
          data.append("arquivoBase", this.arquivoBase.files[0]);
        }

        data.append("data", JSON.stringify(this.documento));
        // let data = this.documento;
        // if(this.documento.CONDOC && this.documento.TIPDOC == 2){
        //   this.documento.CONDOC = this.documento.CONDOC.replaceAll('class="ql-align-center"', 'style="text-align: center;"')
        // }else if(this.documento.TIPDOC == 1 && this.arquivoBase){
        //   data.arquivoBase = this.arquivoBase;
        // }
        if (this.loading) return;
        this.loading = true;
        
        let response;
        if (this.documento.CODDOC) {
          response = await this.documentoService.update(data);
        }
        else {
          response = await this.documentoService.store(data);
          console.log(response);
        }

        if (response[0]) {
          this.$toast.add({severity:'success', summary: 'Sucesso', detail: 'Documento salvo com sucesso', life: 3000});
        }
        else {
          this.$toast.add({severity:'error', summary: 'Erro', detail: 'Documento não salvo', life: 3000});
        }

        this.loading = false;
        this.back();
      },

    }
}

  </script>
  
  <style>
  
  </style>