<script setup>
import { ref, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "primevue/usetoast"
import TipoTarefaService from "../../../../service/administracao/TipoTarefaService"

const route = useRoute()
const router = useRouter()
const toast = useToast()
const tipoTarefa = ref({})
const loading = ref(false)
const editando = ref(false)
const submitted = ref(false)
const id = ref()

const tipoTarefaService = new TipoTarefaService()

const back = () => {
  router.push({ path: "/administracao/fmtad03" })
}

const formsubmit = () => {
  let hasError = false;

  if (!tipoTarefa.value.CODTIPTAR) {
    toast.add({
      severity: "warn",
      summary: "Dados",
      detail: "Informe um código de sistema",
      life: 3000,
    });
    hasError = true;
  }

  if (!tipoTarefa.value.DESTIPTAR) {
    toast.add({
      severity: "warn",
      summary: "Dados",
      detail: "Informe uma descrição",
      life: 3000,
    });
    hasError = true;
  }

  if (!tipoTarefa.value.ICOTIPTAR) {
    toast.add({
      severity: "warn",
      summary: "Dados",
      detail: "Informe um ícone",
      life: 3000,
    });
    hasError = true;
  }

  submitted.value = hasError; // Set submitted to true if there's an error
  return !hasError;
};



const save = async () => {
  if (!formsubmit()) {
    return
  }

  loading.value = true

  // if (tipoTarefa.value.ICOTIPTAR) {
  //   let iconName = tipoTarefa.value.ICOTIPTAR
  //   tipoTarefa.value.ICOTIPTAR = iconName
  // }

  let response

  if (id.value) {
    response = await tipoTarefaService.update(tipoTarefa.value)
  } else {
    response = await tipoTarefaService.store(tipoTarefa.value)
  }

  if (response) {
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Salvo com sucesso",
      life: 3000,
    })
    setTimeout(() => back(), 2000);
  } else {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Falha na operação",
      life: 3000,
    });
    loading.value = false;
  }

}

onMounted(async () => {
  id.value = route.params.id
  console.log("recebeu o id", id.value)

  if (id.value) {
    loading.value = true
    editando.value = true
    await tipoTarefaService
      .get(id.value)
      .then((response) => {
        tipoTarefa.value = response
      })
      .finally(() => {
        loading.value = false
      })
  }
})
</script>

<template>
  <Toast />

  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <div v-if="loading">
            <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
            <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
            <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
            <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
            <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
          </div>
          <div class="formgrid grid" v-else>
            <div class="field col-12 md:col-3">
              <label for="name">Código</label>
              <InputText required="true" :class="{ 'p-invalid': submitted && !tipoTarefa.CODTIPTAR }"
                v-model="tipoTarefa.CODTIPTAR" :disabled="codDisabled" maxLength="2" />
              <small class="p-error" v-if="submitted && !tipoTarefa.CODTIPTAR">Código é obrigatório.</small>
            </div>
            <div class="field md:col-12 col-12">
              <label for="name">Descrição</label>
              <InputText required="true" :class="{ 'p-invalid': submitted && !tipoTarefa.DESTIPTAR }"
                v-model="tipoTarefa.DESTIPTAR" maxLength="30" />
              <small class="p-error" v-if="submitted && !tipoTarefa.DESTIPTAR">Descrição é obrigatória.</small>
            </div>
            <div class="field md:col-12 col-12">
              <label for="name">Icone</label>
              <InputText required="true" :class="{ 'p-invalid': submitted && !tipoTarefa.ICOTIPTAR }"
                v-model="tipoTarefa.ICOTIPTAR" maxLength="15" />
              <small class="p-error" v-if="submitted && !tipoTarefa.ICOTIPTAR">Icone é obrigatório.</small>
            </div>

            <div class="field col-6 md:col-2 float-right">
              <Button label="Voltar" class="p-button-info" style="margin-top: 15%" @click="back" />
            </div>

            <div class="field col-6 md:col-2">
              <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%" @click="save" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
