<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <Toast />
        <div class="formgrid grid">
          <div class="field md:col-12 col-12">
            <label for="name">Descrição</label>
            <InputText
              required="true"
              :class="{ 'p-invalid': submitted && !praca.DESPRA }"
              v-model="praca.DESPRA"
            />
            <small class="p-invalid" v-if="submitted && !praca.DESPRA"
              >Descrição é obrigatória.</small
            >
          </div>
          <div class="field md:col-6 col-12">
            <label for="name">Sigla do Estado</label>
            <Dropdown
              required
              v-model="siglaEstado"
              :options="listaSiglaEstado"
              optionLabel="label"
              :class="{
                'p-invalid':
                  submitted &&
                  (praca.SIGEST === '' || praca.SIGEST === undefined),
              }"
              placeholder="Selecione"
              @change="changeEstado"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'product-badge status-' + slotProps.value.value"
                    >{{ slotProps.value.label }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small class="p-invalid" v-if="submitted && !praca.SIGEST"
              >Estado é obrigatório.</small
            >
          </div>
          <div class="field md:col-6 col-12">
            <label for="name">Raio da Praça</label>
            <div class="p-inputgroup flex-1">
              <!-- <span class="p-inputgroup-addon">$</span> -->
              <InputNumber
                v-model="praca.RAIPRA"
                :class="{ 'p-invalid': submitted && praca.RAIPRA <= 0 }"
                placeholder="Insira o raio"
              />
              <span class="p-inputgroup-addon">KM</span>
            </div>
            <small class="p-invalid" v-if="submitted && !praca.RAIPRA"
              >Raio da praça é obrigatório.</small
            >
          </div>
          <!-- <div class="field md:col-6 col-12">
                    <label for="name">Raio da Praça</label>
                    <InputNumber v-model="praca.RAIPRA"/>
                </div> -->
          <div class="field md:col-6 col-12">
            <label for="name">Mais de uma cor?</label>
            <Dropdown
              v-model="corIgual"
              :options="opcoesSimNao"
              optionLabel="label"
              :class="{
                'p-invalid':
                  submitted &&
                  (praca.REPCORPRA === '' || praca.REPCORPRA === undefined),
              }"
              placeholder="Selecione"
              @change="changeCorIgual"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'product-badge status-' + slotProps.value.label"
                    >{{ slotProps.value.label }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small
              class="p-invalid"
              v-if="
                submitted &&
                (praca.REPCORPRA === '' || praca.REPCORPRA === undefined)
              "
              >Campo obrigatório.</small
            >
          </div>
          <div class="field md:col-6 col-12">
            <label for="name">Quantidade de cores</label>
            <InputNumber
              v-model="praca.QTDREPCORPRA"
              :class="{
                'p-invalid':
                  submitted &&
                  praca.REPCORPRA === 'S' &&
                  praca.QTDREPCORPRA <= 0,
              }"
              :disabled="corIgualDisabled"
            />
            <small
              class="p-invalid"
              v-if="
                submitted && praca.REPCORPRA === 'S' && praca.QTDREPCORPRA <= 0
              "
              >Campo obrigatório.</small
            >
          </div>
          <div class="field md:col-6 col-12">
            <label for="name">Mais de uma cor diferente?</label>
            <Dropdown
              v-model="corDiferente"
              :options="opcoesSimNao"
              optionLabel="label"
              :class="{
                'p-invalid':
                  submitted &&
                  (praca.REPCORDIFPRA === '' ||
                    praca.REPCORDIFPRA === undefined),
              }"
              placeholder="Selecione"
              @change="changeCorDiferente"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <span
                    :class="'product-badge status-' + slotProps.value.value"
                    >{{ slotProps.value.label }}</span
                  >
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
            <small
              class="p-invalid"
              v-if="
                submitted &&
                (praca.REPCORDIFPRA === '' || praca.REPCORDIFPRA === undefined)
              "
              >Campo obrigatório.</small
            >
          </div>
          <div class="field md:col-6 col-12">
            <label for="name">Quantidade de cores diferentes</label>
            <InputNumber
              v-model="praca.QTDREPCORDIFPRA"
              :min="0"
              :max="100"
              :class="{
                'p-invalid':
                  submitted &&
                  praca.REPCORDIFPRA === 'S' &&
                  praca.QTDREPCORDIFPRA <= 0,
              }"
              :disabled="corDiferenteDisabled"
            />
            <small
              class="p-invalid"
              v-if="
                submitted &&
                praca.REPCORDIFPRA === 'S' &&
                praca.QTDREPCORDIFPRA <= 0
              "
              >Campo obrigatório.</small
            >
          </div>
          <div class="field col-6 md:col-2 float-right">
            <Button
              label="Voltar"
              class="p-button-info"
              style="margin-top: 15%"
              @click="back"
            />
          </div>

          <div class="field col-6 md:col-2">
            <Button
              label="Salvar"
              class="p-button-success"
              icon="pi pi-check"
              style="margin-top: 15%"
              @click="save"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PracaService from "../../../../service/geral/PracaService"
// import FormPraca from './FormCampoDocumento.vue'

export default {
  props: ["pra"],
  components: {
    // FormPraca,
  },

  data() {
    return {
      praca: {
        DESPRA: "",
        RAIPRA: "",
        SIGEST: "",
        REPCORPRA: "",
        REPCORDIFPRA: "",
        QTDREPCORPRA: "",
        QTDREPCORDIFPRA: "",
      },
      corIgual: {},
      corDiferente: {},
      siglaEstado: {},
      opcoesSimNao: [
        { label: "Sim", value: "S" },
        { label: "Não", value: "N" },
      ],
      listaSiglaEstado: [
        { label: "AC", value: "AC" },
        { label: "AL", value: "AL" },
        { label: "AP", value: "AP" },
        { label: "AM", value: "AM" },
        { label: "BA", value: "BA" },
        { label: "CE", value: "CE" },
        { label: "DF", value: "DF" },
        { label: "ES", value: "ES" },
        { label: "GO", value: "GO" },
        { label: "MA", value: "MA" },
        { label: "MT", value: "MT" },
        { label: "MS", value: "MS" },
        { label: "MG", value: "MG" },
        { label: "PA", value: "PA" },
        { label: "PB", value: "PB" },
        { label: "PR", value: "PR" },
        { label: "PE", value: "PE" },
        { label: "PI", value: "PI" },
        { label: "RJ", value: "RJ" },
        { label: "RN", value: "RN" },
        { label: "RS", value: "RS" },
        { label: "RO", value: "RO" },
        { label: "RR", value: "RR" },
        { label: "SC", value: "SC" },
        { label: "SP", value: "SP" },
        { label: "SE", value: "SE" },
        { label: "TO", value: "TO" },
      ],
      pracaService: null,
      SelectPraca: true,
      listPraca: [],
      codDisabled: false,
      corIgualDisabled: true,
      corDiferenteDisabled: true,
      submitted: false,
      saving: false,
    }
  },

  created() {
    this.codDisabled = true
    if (this.pra != null) {
      this.praca = this.pra
      this.siglaEstado = this.listaSiglaEstado.find(
        (estado) => estado.value == this.praca.SIGEST
      )
      this.corIgual = this.opcoesSimNao.find(
        (opcao) => opcao.value == this.praca.REPCORPRA
      )
      this.corDiferente = this.opcoesSimNao.find(
        (opcao) => opcao.value == this.praca.REPCORDIFPRA
      )
      if (this.corIgual?.value === "S") {
        this.corIgualDisabled = false
      }
      if (this.corDiferente?.value === "S") {
        this.corDiferenteDisabled = false
      }
      // // console.log("this.corIgual", this.corIgual);
      // // console.log("this.corDiferente", this.corDiferente);
    }
    // console.log("codDisabled", this.codDisabled);
    // console.log("this.pra", this.pra);
    this.pracaService = new PracaService()
  },

  methods: {
    back(page) {
      this.$parent.back(0)
    },

    validaCampos() {
      if (
        this.praca.DESPRA == "" ||
        this.praca.DESPRA == undefined ||
        this.praca.SIGEST == "" ||
        this.praca.SIGEST == undefined ||
        this.praca.REPCORPRA == "" ||
        this.praca.REPCORPRA == undefined ||
        this.praca.REPCORDIFPRA == "" ||
        this.praca.REPCORDIFPRA == undefined
      ) {
        this.$toast.add({
          severity: "error",
          summary: "Atenção",
          detail: "Preencha os campos obrigatórios!",
          life: 3000,
        })
        return false
      } else if (
        (this.praca.REPCORPRA === "S" && this.praca.QTDREPCORPRA <= 0) ||
        (this.praca.REPCORDIFPRA === "S" && this.praca.QTDREPCORDIFPRA <= 0)
      ) {
        this.$toast.add({
          severity: "error",
          summary: "Atenção",
          detail: "Preencha os campos obrigatórios!",
          life: 3000,
        })
        return false
      } else {
        return true
      }
    },

    async save() {
      this.submitted = true

      // this.praca.SIGEST = this.siglaEstado.value;
      // this.praca.REPCORPRA = this.corIgual.value;
      // this.praca.REPCORDIFPRA = this.corDiferente.value;

      // console.log("praca", this.praca);

      if (!this.validaCampos()) return
      if (this.saving) return

      this.back()
      // console.log("Salvando", this.pra);
      let data = this.praca
      // console.log("this.codigo :>>", data);
      this.saving = true
      let response

      if (this.praca.CODPRA) {
        // console.log("Editouuuuu");
        response = await this.pracaService.update(this.praca)
      } else {
        // console.log("Cadastrouuuuuu");
        response = await this.pracaService.store(this.praca)
      }

      if (response[0]) {
        this.$toast.add({
          severity: "success",
          summary: "Sucesso",
          detail: "Sucesso - Registro Salvo com sucesso",
          life: 3000,
        })
      } else {
        this.$toast.add({
          severity: "error",
          summary: "Erro",
          detail: "Praça não salva",
          life: 3000,
        })
      }

      // this.productDialog = false;
      this.saving = false

      setTimeout(() => {
        this.$parent.buscaPraca()
      }, 100)
    },

    changeEstado() {
      this.praca.SIGEST = this.siglaEstado.value
    },

    changeCorIgual() {
      // // console.log("this.praca.REPCORPRA", this.praca.REPCORPRA)
      if (this.corIgual.value == "N") {
        this.praca.QTDREPCORPRA = 0
        this.corIgualDisabled = true
      } else {
        this.corIgualDisabled = false
      }
      this.praca.REPCORPRA = this.corIgual.value
      // console.log("this.praca.REPCORPRA", this.praca.REPCORPRA)
    },

    changeCorDiferente() {
      //   // console.log("Entrou no changeAcrescimo")
      if (this.corDiferente.value == "N") {
        this.praca.QTDREPCORDIFPRA = 0
        this.corDiferenteDisabled = true
      } else {
        this.corDiferenteDisabled = false
      }
      this.praca.REPCORDIFPRA = this.corDiferente.value
      // console.log("this.praca.REPCORDIFPRA", this.praca.REPCORDIFPRA)
    },
  },
}
</script>

<style></style>
