<script setup>
import { onMounted, onUpdated, reactive, defineEmits } from "vue"
import { ref, defineProps } from "vue"
import BancoService from "@/service/financeiro/BancoService"

const bancoService = new BancoService();

const submitted = ref(false);

const props = defineProps({
  ced: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["change"]);

const objCedente = reactive(props.ced);

const objBanco = ref();
const objAgencia = ref();
const objConta = ref();

const listaBanco = ref([]);
const listaAgencia = ref([]);
const listaConta = ref([]);

const srcBancos = (CodBan) => {
  let banco;
  listaBanco.value.map(
    entry => {
      if (entry.value == CodBan) {
        banco = entry;

        return;
      }
    }
  );

  console.log(banco)

  return banco;
}

const onChange = () => {
  emit("change", {
    CODBAN : objBanco.value.value
  });
}

onMounted(()=>{
  // console.log("objCedente",objCedente);
  bancoService.all().then((response)=>{
    // console.log(response);
    listaBanco.value = response.map((entry)=>{
      return { label: entry.NOMBAN, value: entry.CODBAN};
    })
  })
})

onUpdated(() => {
  console.log(props.ced.CODBAN);
  if (props.ced.CODBAN) {
    objBanco.value = srcBancos(props.ced.CODBAN);
  }
})

</script>

<template>
  <div class="form grid">
    <div class="field col-12 sm:col-12 md:col-4">
      <label for="name">Banco</label>
      <Dropdown v-model="objBanco" @change="onChange" :options="listaBanco" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <!-- <InputText v-model.trim="objCedente.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objCedente.DESDFC}" /> -->
      <small class="p-invalid" v-if="submitted && !objCedente.DESDFC">Este campo é obrigatório.</small>
    </div>
    <div class="field col-12 sm:col-12 md:col-4">
      <label for="name">Agência</label>
      <Dropdown v-model="objAgencia" :options="listaAgencia" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <!-- <InputText v-model.trim="objCedente.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objCedente.DESDFC}" /> -->
      <small class="p-invalid" v-if="submitted && !objCedente.DESDFC">Este campo é obrigatório.</small>
    </div>
    <div class="field col-12 sm:col-12 md:col-4">
      <label for="name">Conta</label>
      <Dropdown v-model="objConta" :options="listaConta" optionLabel="label" placeholder="Selecione">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <span :class="'product-badge status-' + slotProps.value.value">{{ slotProps.value.label }}</span>
          </div>
          <span v-else>
            {{ slotProps.placeholder }}
          </span>
        </template>
      </Dropdown>
      <!-- <InputText v-model.trim="objCedente.DESDFC" required="true" autofocus :class="{'p-invalid': submitted && !objCedente.DESDFC}" /> -->
      <small class="p-invalid" v-if="submitted && !objCedente.DESDFC">Este campo é obrigatório.</small>
    </div>

  </div>
</template>