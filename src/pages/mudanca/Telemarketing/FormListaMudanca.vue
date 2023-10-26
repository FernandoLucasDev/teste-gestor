<template>
	<div class="grid">
	  <div class="col-12">
      <div class="p-fluid">

        <div v-if="loading1">
          <ProgressSpinner style="height: 50px;" />
        </div>

        
        <div class="formgrid grid">
          <div class="col-6 md:col-2">
            <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="back" />
          </div>
          <div class="field col-6 md:col-2 float-right">
            <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="newMudanca" />
          </div>
          <div class="col-3" v-if="loading5">
            <ProgressSpinner style="height: 50px;" />
          </div>
        </div>

        

      </div>
	  </div>
	</div>

  <div>
    <DataTable :value="mudancas"  
      :paginator="true" 
      :rows="10"
      :loading="loading"
      :totalRecords="totalRecords"
      :rowClass="rowClass"
      @page="onPage($event)"
      @sort="onSort($event)"
      responsiveLayout="scroll" 
      dataKey="CODENT"
      >      
        <template #empty v-if="!loading">
            Nenhuma mudança encontrada
        </template>
        <template #loading>
            Carregando mudanças. Por favor, aguarde...
        </template>
        <template #footer v-if="!loading">
          Total de registros {{ totalRecords}}
        </template>
        <Column field="TIPMUD" header="Tipo" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.TIPMUD}}-{{data.EXCMUD}}
            </template>
        </Column>
        <Column field="GM" header="GM" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
              {{data.STATUS}}
            </template>
        </Column>
        <Column field="ANOMUD" header="Ano" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.ANOMUD}}
            </template>
        </Column>
        <Column field="NUMMUD" header="Número" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.NUMMUD}}
            </template>
        </Column>
        <Column header="Cliente" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.entidade.NOMENT}}
            </template>
        </Column>
        <Column field="DATORCMUD" header="Data" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
              {{formatDate(data.DATORCMUD)}}
            </template>
        </Column>
        <Column field="HORORCMUD" header="Hora" :sortable="true" style="min-width:12rem">
            <template #body="{data}">
                {{data.HORORCMUD}}
            </template>
        </Column>
        <Column field="STATUS" header="Status" style="min-width:8rem">
            <template #body="{data}">
                {{data.STATUS}}
            </template>
        </Column>
        <Column headerStyle="min-width:10rem; width:10rem;">
          <template #body="props">
            <Button icon="pi pi-arrow-right" v-tooltip.top="'Avançar'" class="p-button-rounded p-button-warning mr-2" @click="selectMudanca(props.data)" />
          </template>
        </Column>
        
    </DataTable>
  </div>
</template>

<script>
import MudancaService from '../../../service/mudanca/MudancaService';
import EntidadeService from '../../../service/EntidadeService';
import { toNumber } from '../../../defaults/number';
import { mapDropdownSearch } from '../../../defaults/map';
import moment from "moment";
import { data } from 'vue3-timepicker';

export default {
  props : ["entidade", "mudanca"],
	data() {
		return {
      loading: false,
      loading1: false,
      loading2: false,
      loading3: false,
      loading4: false,
      loading5: false,
      loading6: false,
      loading7: false,
      loadingDep : false,
      mudancas : [],
      entidadeSelected : {},
      mudancaSelected : {},
      estilo: {
        backgroundColor:"#16a085"
      },
      calendar : null,
      tipo : null,
      typeSelected : null,
      subtypeSelected : null,
      endereco : null,
      bairro : null,
      cidade : null,
      uf : null,
    }
	},
  entidadeService : null,
  mudancaService : null,
  
  created() {
    this.mudancaService = new MudancaService();
    this.entidadeService = new EntidadeService();

    this.entidadeSelected = this.entidade;
    

    this.loading = true;
    
    (new MudancaService()).search(this.entidade.CODENT)
      .then(response => {
        this.mudancas = response;
        this.totalRecords = response.length;
        
        console.log("123", this.mudancas)
        this.mudancas.forEach(
          function(value, key) {
            console.log("aqui", key)
            if (value.CANMUD == "S") {
              value.STATUS = "Mudança Cancelada"
              // this.STATUS="backgroundColor:'#16a085'"
            } 
            else {
              if (value.DATFINMUD != null) {
                value.STATUS = "Mudança Efetuada"
                // this.STATUS.fontcolor('green')        
              }
              else if (value.DATINIMUD != null){
                value.STATUS = "Mudança em Andamento"
              }
              else if (value.DATFECMUD != null){
                value.STATUS = "Mudança Fechada"
              }
              else {
                value.STATUS = "Orçamento"
              }
            }

            value.teste = [{id: 1, ds: "Marcelo"},{id: 2, ds: "Caio"}]
            // (new EntidadeService()).procura(null, null, value.CODENT, null)
            //   .then(response => {
            //     value.NOMENT = response.data[0].NOMENT
            //   })
          }
        )

/*        this.entidadeSelected = response[0];

        this.entidadeSelected = this.entidade;

        this.TIPDOCENT = mapDropdownSearch(this.tiposDocumento, this.entidadeSelected.TIPDOCENT);

        if (this.entidadeSelected.DATNASENT) {
          this.entidadeSelected.DATNASENT = moment(this.entidadeSelected.DATNASENT).format("DD/MM/YYYY");      
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
                this.entidadeSelected.SIGEST = mapDropdownSearch(this.estados, this.entidadeSelected.SIGEST)
              }

            }
          }
        );
*/
        // this.loading6 = true;

      })
      .finally(() => {
        this.loading6 = false
        this.loading = false
      });




//    if (this.mudancaSelected.CODENT) {
//      this.mudanca = {
//        value : this.mudancaSelected.CODENT,
//        label : this.mudancaSelected.entidade.NOMENT,
//      };
//    }
  },
  methods : {
    async save() {
      let data = this.contatoSelected;
      data.beneficios = this.beneficios;

      if (data.beneficios.length == 0) {
        this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.typeLabel, life: 3000});
      }
      else {
        let canContinue = true;
        data.beneficios.map(
          (entry) => {
            if (!entry.value) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.typeLabel, life: 3000});
              canContinue = false;
            }
            else if (!entry.subValue) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um ' + this.subtypeLabel, life: 3000});
              canContinue = false;
            }
            else if (!entry.calendar) {
              this.$toast.add({severity:'error', summary: 'Erro', detail: 'Selecione um início', life: 3000});
              canContinue = false;
            }
          }
        );

        if (!canContinue) return;
      }

      data.tipo = this.tipo.value;
      //data.calendar = this.calendar;
           
      data.CODENT = this.entidade.value;

      if (data.SEXCON) {
        data.SEXCON = data.SEXCON.value;
      }
      if (data.CODCAR) {
        data.CODCAR = data.CODCAR.value;
      }
      if(data.SIGEST) {
        data.SIGEST = data.SIGEST.value;
      }

      if (data.SALCON) {
        data.SALCON = toNumber(data.SALCON);
      }

      this.loading5 = true;      

      const response = await this.service.send(data);
      
      this.loading5 = false;

      if (response[0] == 1) {
				this.$toast.add({severity:'success', summary: 'Sucesso', detail: this.mudancaSelected.NOMCON + ' salvo com sucesso'});

        if (response.errors) {
          response.errors.map(
            (error) => this.$toast.add({severity:'error', summary: 'Erro', detail: error})
          );
        }
        if (response.success) {
          response.success.map(
            (msg) => this.$toast.add({severity:'success', summary: 'Sucesso', detail: msg})
          );
        }
			}
			else {
				this.$toast.add({severity:'error', summary: 'Erro', detail: 'Mudança não salva', life: 3000});
			}
    },
    
    back() {
      this.$parent.back(0);
    },
    formatDate(value) {
      return value.substr(8, 2) + "/" + 
            value.substr(5, 2) + "/" + 
            value.substr(0, 4)
    },
    newMudanca() {
      this.$parent.entidade = this.entidadeSelected;
      this.$parent.mudanca = this.mudancaSelected;
      this.$parent.newMudanca();
    },
    selectMudanca(data) {
      this.$parent.mudanca = data;
      this.$parent.page = 3
    },
    rowClass(data) {
      if (data.CANMUD == "S") {
        console.log("12345")
        return [{ 'bg-red-500 text-gray-50': data.CANMUD === 'S' }];
      } 
      else {
        if (data.DATFINMUD != null) {
          return [{ 'bg-green-500 text-gray-50': data.DATFINMUD !== null }];
        }
        else if (data.DATINIMUD != null){
          return [{ 'bg-orange-500 text-gray-50': data.DATINIMUD !== null }];
        }
        else if (data.DATFECMUD != null){
          return [{ 'bg-yellow-400': data.DATFECMUD !== null }];
        }
        else {
          return [{ 'bg-purple-500 text-gray-50': data.DATFECMUD === null }];
        }
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/demo/badges.scss';
</style>