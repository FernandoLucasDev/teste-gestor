<script setup>
import { onMounted, reactive } from "vue"
import { ref, defineProps } from "vue"
// import BancoService from "@/service/financeiro/BancoService"
// import AgenciaService from "@/service/AgenciaService"
// import ContaService from "@/service/ContaService"
import { useToast } from "primevue/usetoast";

// const bancoService = new BancoService();

const submitted = ref(false);
const erroININNUDFC = ref(false);
const toast = useToast();

const props = defineProps({
  val: {
    type: Object,
    required: true
  }
});

// console.log(props.ced);

const objValores = reactive(props.val);
objValores.exercicio = {};

const objBanco = ref();
const objAgencia = ref();
const objConta = ref();

const listaTipo = ref([
  {label: "", value: 0},
  {label: "", value: 0},
  {label: "", value: 0}
]);
const opcoesSimNao = reactive([
	{ label: "Sim", value: "S" },
	{ label: "Não", value: "N" },
]);
const listaBanco = ref([]);
const listaAgencia = ref([]);
const listaConta = ref([]);

function log(){
  // console.log("objValores",objValores);
}

onMounted(()=>{
  // console.log("objValores",objValores);
  // bancoService.all().then((response)=>{
  //   console.log(response);
  //   listaBanco.value = response.map((entry)=>{
  //     return { label: entry.NOMBAN, value: entry.CODBAN};
  //   })
  // })
})

</script>

<template>
  <div class="form grid">
    <div class="field col-12 sm:col-12 md:col-4">
      <label for="name">Calculos</label>
      <Dropdown v-model="objCalculos" @change="objValores.CODBAN = objBanco.value" :options="listaBanco" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <!-- <InputText v-model.trim="objValores.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" /> -->
      <small class="p-invalid" v-if="submitted && !objValores.CODBAN">Este campo é obrigatório.</small>
    </div>
    <div class="field col-12 sm:col-6 md:col-4 lg:col-2">
      <label for="name">Versão do cálculo</label>
      <InputText v-model.trim="objValores.VERCALDFC" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" />
      <!-- <small class="p-invalid" v-if="submitted && !objValores.DESDFC">Este campo é obrigatório.</small> -->
    </div>
    <div class="field col-12 sm:col-6 md:col-4 lg:col-2">
      <label for="name">Exercício</label>
      <InputText v-model.trim="objValores.exercicio.ANODCE" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" />
      <!-- <small class="p-invalid" v-if="submitted && !objValores.DESDFC">Este campo é obrigatório.</small> -->
    </div>
    <div class="field col-12 sm:col-6 md:col-4 lg:col-2">
      <label for="name">Juros</label>      
      <div class="p-inputgroup flex-1">
        <InputText v-model.trim="objValores.exercicio.JURDCE" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" />
        <span class="p-inputgroup-addon">%</span>
      </div>
      <!-- <InputText v-model.trim="objValores.exercicio.JURDCE" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" /> -->
      <!-- <small class="p-invalid" v-if="submitted && !objValores.DESDFC">Este campo é obrigatório.</small> -->
    </div>
    <div class="field col-12 sm:col-6 md:col-4 lg:col-2">
      <label for="name">Multa</label>
      <div class="p-inputgroup flex-1">
        <InputText v-model.trim="objValores.exercicio.MULDCE" required="true" autofocus :class="{'p-invalid': submitted && !objValores.DESDFC}" />
        <span class="p-inputgroup-addon">%</span>
      </div>
      <!-- <small class="p-invalid" v-if="submitted && !objValores.DESDFC">Este campo é obrigatório.</small> -->
    </div>

  </div>
</template>