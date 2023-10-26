<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <Toast />
        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button
                label="Nova"
                icon="pi pi-plus"
                class="p-button-success mr-2"
                @click="openNew"
              />
            </div>
          </template>
        </Toolbar>

        <DataTable
          ref="dt"
          :value="niveisEducacao"
          :loading="loading"
          v-model:selection="selectedTasks"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Exibindo {first} de {last} NivelEducação"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="flex flex-column md:flex-row md:justify-content-between md:align-items-center"
            >
              <h5 class="m-0">
                <Translate text="Niveis de educação" />
              </h5>
              <span class="block mt-2 md:mt-0 p-input-icon-left">
                <i class="pi pi-search" />
                <InputText
                  v-model="filters['global'].value"
                  placeholder="Procurar..."
                />
              </span>
            </div>
          </template>
          <Column
            field="CODNIVEDU"
            header="Cód."
            :sortable="true"
            headerStyle="width:40%; min-width:5rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Code</span>
              {{ slotProps.data.CODNIVEDU }}
            </template>
          </Column>
          <Column
            field="DESNIVEDU"
            header="Descrição"
            :sortable="true"
            headerStyle="width:40%; min-width:5rem;"
          >
            <template #body="slotProps">
              <span class="p-column-title">Description</span>
              {{ slotProps.data.DESNIVEDU }}
            </template>
          </Column>
          <Column headerStyle="width:10%; min-width:10rem;">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success mr-2"
                @click="edit(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning mt-2"
                @click="confirmDeleteNivelEducacao(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="nivelEducacaoDialog"
          :style="{ width: '70%' }"
          header="Nivel de Educação"
          :modal="true"
          class="p-fluid"
        >
          <div class="field">
            <label for="name">Descrição</label>
            <InputText
              v-model.trim="nivelEducacao.DESNIVEDU"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !nivelEducacao.DESNIVEDU }"
              maxLength="45"
            />
            <small class="p-error" v-if="submitted && !nivelEducacao.DESNIVEDU"
              >Descrição is required.</small
            >
          </div>
          <template #footer>
            <Button
              label="Fechar"
              icon="pi pi-times"
              class="p-button-text"
              @click="hideDialog"
            />
            <Button
              label="Salvar"
              icon="pi pi-check"
              class="p-button-text"
              @click="save"
            />
          </template>
        </Dialog>

        <Dialog
          v-model:visible="deleteDialog"
          :style="{ width: '450px' }"
          header="Confirmação de remoção"
          :modal="true"
        >
          <div class="flex align-items-center justify-content-center">
            <i
              class="pi pi-exclamation-triangle mr-3"
              style="font-size: 2rem"
            />
            <span>Deseja realmente excluir o registro <b>{{nivelEducacao.DESNIVEDU}}</b>?</span>
          </div>
          <template #footer>
            <Button
              label="Não"
              icon="pi pi-times"
              class="p-button-text"
              @click="deleteDialog = false"
            />
            <Button
              label="Sim"
              icon="pi pi-check"
              class="p-button-text"
              @click="deleteFunction"
            />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { FilterMatchMode } from "primevue/api"
// import FormaPagamentoService from '../../../../service/financeiro/FormaPagamentoService';
import NivelEducacaoService from "../../../../service/rede-seguro-facil/NivelEducacaoService"
//import Translate from '../../components/Translate.vue';
//import { translate } from '../../service/Translate';

export default {
  //mixins : [translate],
  data() {
    return {
      // translate : null,
      loading: true,
      nivelEducacao: {},
      niveisEducacao: [],
      nivelEducacaoDialog: false,
      deleteDialog: false,
      deletesDialog: false,
      selectedTasks: null,
      filters: {},
      submitted: false,
      saving: false,
    }
  },
  created() {
    this.nivelEducacaoService = new NivelEducacaoService()
    this.initFilters()
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.loading = true;
      this.nivelEducacaoService.all().then((data) => {
        console.log("fp", data);
        this.niveisEducacao = data;
        this.loading = false;
      })
    },

    openNew() {
      console.log("Entrou na função de openNew")
      this.nivelEducacao = {}
      this.submitted = false
      this.nivelEducacaoDialog = true
    },
    hideDialog() {
      this.nivelEducacaoDialog = false
      this.submitted = false
    },
    async save() {
      if (this.saving) return
      this.submitted = true
      if (!this.validateFields()) return
      this.saving = true

      let response
      if (this.nivelEducacao.CODNIVEDU) {
        response = await this.nivelEducacaoService.update(this.nivelEducacao)
      } else {
        response = await this.nivelEducacaoService.store(this.nivelEducacao)
        this.load()
      }
      if (response) {
        this.$toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Registro Salvo com sucesso",
          life: 3000,
        })
      } else {
        console.log("Entrou no else")
        this.$toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Registro não salvo",
          life: 3000,
        })
      }
      this.nivelEducacaoDialog = false
      this.saving = false
    },

    validateFields() {
      console.log("entrou na função validateFields")
      if (
        this.nivelEducacao.DESNIVEDU == undefined ||
        this.nivelEducacao.DESNIVEDU == ""
      ) {
        console.log("Entrou na função de Validatefields")
        this.$toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Registro não salvo, preencha o campo obrigatorio",
          life: 3000,
        })
        console.log("1")
        return false
      } else {
        console.log("Entrou no else")
        return true
      }
    },
    edit(nivelEducacao) {
      console.log(nivelEducacao)
      this.loading2 = true
      this.nivelEducacao = nivelEducacao
      this.nivelEducacaoDialog = true
    },

    confirmDeleteNivelEducacao(nivelEducacao) {
      this.nivelEducacao = nivelEducacao
      this.deleteDialog = true
    },
    async deleteFunction() {
      console.log("Entrou na função deleteFunction");
      this.deleteDialog = false;
      await this.nivelEducacaoService.delete(this.nivelEducacao.CODNIVEDU);
      this.nivelEducacao = {};
      this.$toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Registro removido com sucesso",
        life: 3000,
      });
      this.load();
    },
    confirmDeleteSelected() {
      this.deletesDialog = true
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      }
		this.loading = true
    },
  },
}
</script>

<style scoped lang="scss">
@import "../../../../assets/demo/badges.scss";
</style>
