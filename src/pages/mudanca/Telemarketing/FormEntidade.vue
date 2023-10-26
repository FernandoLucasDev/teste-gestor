<template>
	<div class="grid">
	  <div class="col-12">
      <div class="p-fluid">
        <div v-if="loading1">
          <ProgressSpinner style="height: 50px;" />
        </div>

        <div class="formgrid grid">
          <div class="col-12">
            <div class="formgrid grid">
              <div class="field col-12 md:col-9 lg:col-9">
                <label for="name">Nome</label>
                <InputText v-model.trim="entidadeSelected.NOMENT" required="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.NOMENT}" maxlength="100"/>
                <small class="p-error" v-if="submitted && !entidadeSelected.NOMENT">Este campo é obrigatório.</small>
              </div>

              <div class="field col-12 sm:col-12 md:col-3 lg:col-3">
                <label for="telefone">Telefone</label>
                <InputText v-model.trim="entidadeSelected.TELENT" autofocus maxlength="14" @change="formataTELENT" :class="{'p-invalid': erroTelefone}" />
                <small class="p-error" v-if="erroTelefone">Insira o telefone com o DDD.</small>
              </div>
              <div v-if="loading4"  class="field col-3">
                <ProgressSpinner style="height: 30px; margin-top : 20%" />
              </div>
            </div>
            
            <div class="formgrid grid">
              <div class="field col-6 md:col-3 lg:col-3">
                <label for="cpf">CEP</label>
                <!-- <InputText @input="onKeyUpCep" v-model.trim="entidadeSelected.CEPENDENT" required="true" autofocus :class="{'p-invalid': submitted && !entidadeSelected.CEPENDENT}" /> -->
                <InputMask mask="99999-999" @input="onKeyUpCep" v-model.trim="entidadeSelected.CEPENDENT" />
              </div>

              <div class="field col-6 md:col-2 lg:col-2">
                <Button label="Procurar" icon="pi pi-search" class="p-button-info" style="margin-top: 1.8em;" @click="searchCEP" />
              </div>

              <div class="field col-12 md:col-7">
                <label for="cpf">Logradouro</label>
                <InputText v-model.trim="entidadeSelected.NOMLOG" maxlength="255"/>
              </div>
            </div>
            
            <div class="formgrid grid">
              <div class="field col-12 md:col-4 lg:col-5">
                <label for="cpf">Bairro</label>
                <InputText v-model.trim="entidadeSelected.DESBAI" />
              </div>

              <div class="field col-12 md:col-5 lg:col-5">
                <label for="cpf">Cidade</label>
                <InputText v-model.trim="entidadeSelected.DESCID" />
              </div>

              <div class="field col-12 md:col-3 lg:col-2">
                <label for="estado">Estado</label>
                <Dropdown id="estado" v-model="estado" :options="estados" optionLabel="label" placeholder="Selecione" @change="onChange" >
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
            
            <div class="formgrid grid">
              <div class="field col-12 md:col-3 lg:col-3">
                <label for="numero">Número</label>
                <InputText v-model.trim="entidadeSelected.NUMENDENT" />
              </div>
              <div class="field col-12 md:col-9 lg:col-5">
                <label for="complemento">Complemento</label>
                <InputText v-model.trim="entidadeSelected.COMENDENT" maxlength="40"/>
              </div>
              <div class="field col-12 md:col-6 lg:col-4">
                <label for="referencia">Referência</label>
                <InputText v-model.trim="entidadeSelected.REFENDENT" maxlength="100"/>
              </div>
            <!-- </div>
            
            <div class="formgrid grid"> -->
             
              <div class="field col-4 md:col-3 lg:col-3">
                <label for="documento">Documento</label>
                <Dropdown id="tipoDocumento" v-model="TIPDOCENT" :options="tiposDocumento" optionLabel="label" placeholder="Selecione">
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
              <div class="field col-8 md:col-3 lg:col-3">
                <label for="numero_documento">Número Documento</label>
                <div v-if="TIPDOCENT && TIPDOCENT.value == 2">
                  <InputMask id="CPFENT" mask="999.999.999-99" v-model="entidadeSelected.NUMDOCENT"></InputMask>
                </div>
                <div v-else-if="TIPDOCENT && TIPDOCENT.value == 3">
                  <InputMask id="CNPJENT" mask="99.999.999/9999-99" v-model="entidadeSelected.NUMDOCENT"></InputMask>
                </div>
                <div v-else>
                  <InputText id="OUTROENT" v-model="entidadeSelected.NUMDOCENT"></InputText>
                </div>
              </div>
              <div class="field col-12 md:col-3 lg:col-3">
                <label for="cpf">RG</label>
                <!-- <InputText v-model.trim="entidadeSelected.IDEENT" /> -->
                <InputMask mask="99.999.999?-9" v-model.trim="entidadeSelected.IDEENT" />
              </div>
            <!-- </div>
            
            <div class="formgrid grid"> -->
              <div class="field col-6 md:col-3">
                <label for="cpf">Celular</label>
                <!-- <InputText v-model.trim="entidadeSelected.CELENT" /> -->
                <InputText v-model.trim="entidadeSelected.CELENT" maxlength="14" @change="formataCELENT" />
              </div>
              <div class="field col-6 md:col-3">
                <label for="cpf">Nascimento</label>
                <Calendar v-model="dataNascimento" dateFormat="dd/mm/yy" :showIcon="true"/>
              </div>
              <div class="field col-12 md:col-6">
                <label for="cpf">E-mail</label>
                <InputText v-model.trim="entidadeSelected.EMAENT" maxlength="200"/>
              </div>
            </div>
            
            <div v-if="loading3">
              <div class="formgrid grid">
                <div class="col-12">
                  <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
                </div>
              </div>
            </div>
            
            
          </div>
        </div>
        <div class="formgrid grid">
          <div class="col-6 md:col-2">
            <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
          </div>
          <div class="col-6 md:col-2">
            <Button label="Salvar" icon="pi pi-check" class="p-button-success" style="margin-top: 15%;" @click="save" />
          </div>
          <div class="col-2" v-if="loading5">
            <ProgressSpinner style="height: 50px;" />
          </div>
        </div>
      </div>
	  </div>
	</div>

  
  
  <Dialog v-model:visible="cepConfirmDialog" :style="{width: '450px'}" header="Confirmação de CEP" :modal="true">
    
    <p>{{ endereco }}</p>
    <p>{{ bairro }}</p>
    <p>{{ cidade }} - {{ uf }}</p>
    <p><strong>O endereço</strong>  está correto?</p>
  
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="noConfirmCEP"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmCEP" />
    </template>
  </Dialog>

  
  
  <Dialog v-model:visible="cepNaoLocalizadoDialog" :style="{width: '450px'}" header="ERRO" :modal="true">
      
    <p><strong>CEP</strong>  não localizado?</p>
    
    <template #footer>
      <Button label="OK" icon="pi pi-check" class="p-button-text" @click="fechaCEPNaoLocalizado" />
    </template>
  </Dialog>
</template>

<script>
import CepService from '../../../service/CepService';
import EntidadeService from '../../../service/EntidadeService';
import EstadoService from '../../../service/EstadoService';
import TipoDocumentoService from '../../../service/financeiro/TipoDocumentoService';
import { cpfMask, cepMask, telefoneMask } from '../../../defaults/mask';
import { toNumber } from '../../../defaults/number';
import { mapDropdownSearch } from '../../../defaults/map';
import moment from "moment";
import { FLOWBASEANNOTATION_TYPES } from '@babel/types';

import { maxLength } from '../../../defaults/number'

export default {
  props : ["entidade"],
	data() {
		return {
      loading1: false,
      loading3: false,
      loading4: false,
      loading5: false,
      entidadeSelected : {},
      TIPDOCENT : {},
      cepConfirmDialog : false,
      cepNaoLocalizadoDialog : false,
      cepConfirm : true,
      calendar : null,
      tipo : null,
      endereco : null,
      bairro : null,
      cidade : null,
      uf : null,
      CodCnvDep : null,
      CodModDep : null,
      dataNascimento: null,
      estados: [],
      estado: [],
			tiposDocumento: [
				{label : 'NI', value : 1},
				{label : 'CPF', value : 2},
				{label : 'CNPJ', value : 3},
				{label : 'CEI', value : 4},
			],
      erroTelefone: false,
      submitted: false
    }
	},
  entidadeService : null,
  service : null,
  async mounted() {
    this.entidadeService = new EntidadeService();
    this.tipoDocumentoService = new TipoDocumentoService();

    // this.tiposDocumento = await this.tipoDocumentoService.all();
    // this.tiposDocumento = this.tiposDocumento.map((entry)=>{
    //   return {value: entry.CODTIPDOC, label: entry.DESTIPDOC};
    // })

    if(this.entidade.CODENT){
      (new EntidadeService()).search(this.entidade.CODENT)
      .then(response => {

        this.entidadeSelected = response[0];

        this.entidadeSelected = this.entidade;

        // this.TIPDOCENT = mapDropdownSearch(this.tiposDocumento, this.entidadeSelected.TIPDOCENT);
        console.log("this.tiposDocumento",this.tiposDocumento);
        this.TIPDOCENT = this.tiposDocumento.find(item => item.value == this.entidadeSelected.TIPDOCENT);

        if (this.entidadeSelected.CPFENT) {
          this.entidadeSelected.CPFENT = cpfMask(this.entidadeSelected.CPFENT.toString());
        }

        if (this.entidadeSelected.DATNASENT) {
          // this.entidadeSelected.DATNASENT = moment(this.entidadeSelected.DATNASENT).format("DD/MM/YYYY");
          // this.dataNascimento = moment(this.entidadeSelected.DATNASENT).format("DD/MM/YYYY");
          this.dataNascimento = this.entidadeSelected.DATNASENT;
        }

        if (this.entidadeSelected.NOMLOG) {
          this.endereco = this.entidadeSelected.NOMLOG;
        }
        
        if (this.entidadeSelected.DESBAI) {
          this.bairro = this.entidadeSelected.DESBAI;
        }
        
        if (this.entidadeSelected.DESCID) {
          this.cidade = this.entidadeSelected.DESCID;
        }

        if (this.entidadeSelected.CEPENDENT) {
          this.entidadeSelected.CEPENDENT = ((this.entidadeSelected.CEPENDENT.toString()).replace(".","")).padStart(8, "0");
        }

        if (this.entidadeSelected.TELENT && this.entidadeSelected.DDDENT) {
          // this.entidadeSelected.TELENT = this.entidadeSelected.DDDENT + this.entidadeSelected.TELENT;
          this.entidadeSelected.TELENT = telefoneMask(this.entidadeSelected.DDDENT + this.entidadeSelected.TELENT);
        }

        
        (new EstadoService()).all()
        .then(
          (response) => {
            this.estados = [];
            if (response.length) {
              response.map(
                (entry) => this.estados.push({label : entry.SIGEST, value : entry.SIGEST})
              );

              if (this.entidadeSelected.SIGEST) {
                this.uf = this.entidadeSelected.SIGEST;
                this.estado = mapDropdownSearch(this.estados, this.entidadeSelected.SIGEST)
              }

            }
          }
        );
      })
      .finally(() => {
        this.loading = false
      });
    }else{
      (new EstadoService()).all()
      .then(
        (response) => {
          this.estados = [];
          if (response.length) {
            response.map(
              (entry) => this.estados.push({label : entry.SIGEST, value : entry.SIGEST})
            );
                          
            // if (this.entidadeSelected.SIGEST) {
            //   this.uf = this.entidadeSelected.SIGEST;
            //   this.entidadeSelected.SIGEST = mapDropdownSearch(this.estados, this.entidadeSelected.SIGEST)
            // }

          }
        }
      );
    }
  },
  methods : {
    formataTELENT(ev){
      console.log(ev.target.value);
      if((ev.target.value.trim().replace(["-", "(", ")"], "")).length > 9){
        this.erroTelefone = false;
        this.entidadeSelected.TELENT = telefoneMask(ev.target.value);
        ev.target.value = telefoneMask(ev.target.value);
      }else{
        this.erroTelefone = true;
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Insira o telefone com o DDD', life: 3000});
      }
    },
    formataCELENT(ev){
      this.entidadeSelected.CELENT = telefoneMask(ev.target.value);
      ev.target.value = telefoneMask(ev.target.value);
    },
    onChange() {
      // console.log("A")
//      console.log(event.target.value)
    },
    onKeyUpCpf(ev) {
      this.entidadeSelected.CPFCON = cpfMask(ev.target.value);
    },

    onKeyUpCep(ev) {
      // this.entidadeSelected.CEPENDENT = cepMask(ev.target.value);
    },

    formatSalario() {
      this.entidadeSelected.SALCON = new Intl.NumberFormat('pt-BR', { style : "decimal", minimumFractionDigits : 2 }).format( this.entidadeSelected.SALCON );
    },

    searchCpf() {
      this.loading4 = true;
      this.entidadeService.search("cpf", this.entidadeSelected.CPFCON)
      .then(response => {
        if (response[0]) 
        {
          this.entidadeSelected = response[0];
        }   
        else {
          this.$toast.add({severity:'error', summary: 'Erro', detail: 'CPF não encontrado', life: 3000});
        }     
      })
      .finally(() => {
        this.loading4 = false;
      });
    },

    searchCEP() {
      this.loading3 = true;
      this.cepConfirm = true;

      if(this.entidadeSelected.CEPENDENT){
        this.entidadeSelected.NOMLOG = "";
        this.entidadeSelected.DESBAI = "";
        this.entidadeSelected.DESCID = "";
        this.entidadeSelected.SIGEST = "";
        this.estado = null;
        (new CepService()).get(this.entidadeSelected.CEPENDENT)
        .then(response => {
          console.log(response)
          if (response.dados.length > 0) {
            this.entidadeSelected.NOMLOG = this.endereco = response.dados[0].logradouroDNEC;
            this.entidadeSelected.DESBAI = this.bairro = response.dados[0].bairro;
            this.entidadeSelected.DESCID = this.cidade = response.dados[0].localidade;
            this.entidadeSelected.SIGEST = this.uf = response.dados[0].uf;
            this.estado = this.estados.find(item => item.value == this.entidadeSelected.SIGEST);
            this.openConfirmCEP();
          }
          else {
            this.openCEPNaoLocalizado();
          }
  
          this.loading3 = false;
        })
        .finally(() => {
          this.loading3 = false;
        });
      }else if( this.entidadeSelected.NOMLOG && this.entidadeSelected.DESCID && this.entidadeSelected.SIGEST){
        (new CepService()).getCep(this.entidadeSelected.NOMLOG, this.entidadeSelected.DESCID, this.entidadeSelected.SIGEST.value)
        .then(response => {
          // console.log(response)
          if (response) {
            if(response.length == 0){
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Mais de um cep encontrado, verifique o endereço!', life: 5000});
            }else{
              this.entidadeSelected.CEPENDENT = response[0].cep;
            }
          }
          else {
            this.openCEPNaoLocalizado();
          }
  
          this.loading3 = false;
        })
        .finally(() => {
          this.loading3 = false;
        });
      }else{
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Verifique os campos para pesquisa de endereço', life: 3000});
      }

    },

    openConfirmCEP() {
      this.cepConfirmDialog = true;
    },

    openCEPNaoLocalizado() {
      this.cepNaoLocalizadoDialog = true;
    },

    noConfirmCEP() {
      this.cepConfirmDialog = false;
      this.cepConfirm = false;
    },

    confirmCEP() {
      this.cepConfirmDialog = false;
      this.cepConfirm = true;
    },

    fechaCEPNaoLocalizado() {
      this.cepNaoLocalizadoDialog = false;
    },

    async save() {
      delete this.entidadeSelected.corretor;
      let data = this.entidadeSelected;

      this.loading5 = true;
      this.submitted = true;

      if(this.erroTelefone || (data.TELENT && data.TELENT.length < 9)){
        this.erroTelefone = true;
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Insira o telefone com o DDD', life: 3000});
        this.loading5 = false;
        return;
      }

      if(data.NOMENT == null || data.NOMENT == ""){
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Preencha os campos obrigatórios', life: 3000});
        this.loading5 = false;
        return;
      }

			if (data.TIPDOCENT) {
				data.TIPDOCENT = this.TIPDOCENT.value;
			}

      if(data.estado) {
        data.SIGEST = data.estado.value;
      }

      if(data.TELENT) {
        data.TELENT = data.TELENT.replace(/\D/g, '');
        data.DDDENT = data.TELENT.slice(0, 2);
        data.TELENT = data.TELENT.slice(2);
      }

      if(this.dataNascimento) {
        // console.log("this.dataNascimento",this.dataNascimento);
        data.DATNASENT = moment(this.dataFimGuardaMoveis).format('DD/MM/YYYY');
      }

      if(this.TIPDOCENT) {
        // console.log("this.dataNascimento",this.dataNascimento);
        data.TIPDOCENT = this.TIPDOCENT.value;
      }

      var response
      if (data.CODENT) {
        response = await this.entidadeService.update(data)
      }
      else {
        // console.log("data",data);
        // console.log("this.entidadeSelected",this.entidadeSelected);
        response = await this.entidadeService.store(data)
        // console.log("response",response);
      }

      
      this.loading5 = false;

//      if (response[0] == 1) {
      if (response) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: this.entidadeSelected.NOMENT + ' salvo com sucesso', life: 3000});
        this.back()
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Entidade não salvo', life: 3000});
				// this.$toast.add({severity:'warn', summary: 'Atenção', detail: 'Verifique os campos obrigatórios', life: 3000});
			}
    },

    back() {
      this.$parent.back(0);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>