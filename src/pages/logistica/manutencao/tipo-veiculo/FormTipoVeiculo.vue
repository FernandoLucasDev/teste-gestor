<script setup>
import { onMounted } from "vue"
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useToast } from "primevue/usetoast"
import TipoVeiculoService from "../../../../service/administracao/TipoVeiculoService"

const route = useRoute()
const router = useRouter()
const toast = useToast()
const tipoVeiculo = ref({})
const loading = ref(false)
const submitted = ref(false)
const editando = ref(false)
const id = ref()

const tipoVeiculoService = new TipoVeiculoService()

const back = () => {
  router.push({ path: "/logistica/fmtlg03" })
}

const save = async () => {
  submitted.value = true
  var retorno = validateFields()
  console.log(retorno)
  if (!retorno) {
    console.log("entrou no if")
    return
  } else {
    loading.value = true
    let response

    if (id.value) {
      tipoVeiculo.value.id = tipoVeiculo.value.CODTIPVEI
      console.log(tipoVeiculo.value)
      response = await tipoVeiculoService.update(tipoVeiculo.value)
    } else {
      response = await tipoVeiculoService.store(tipoVeiculo.value)
      console.log("response", response)
    }

    if (response) {
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Salvo com sucesso",
        life: 3000,
      })
      back()
    } else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha na operação",
        life: 3000,
      })
    }

    loading.value = false
    console.log(tipoVeiculo.value)
  }
}

const validateFields = () => {
  console.log("entrou na função validateFields")
  if (
    tipoVeiculo.value.DESTIPVEI == undefined ||
    tipoVeiculo.value.DESTIPVEI == ""
  ) {
    console.log("Entrou na função de fields")
    toast.add({
      severity: "warn",
      summary: "Dados",
      detail: "Informe uma descrição",
      life: 3000,
    })
    return false
  } else {

    return true
  }
}

onMounted(() => {
  id.value = route.params.id
  console.log("recebeu o id", id.value)

  if (id.value) {
    loading.value = true
    editando.value = true
    tipoVeiculoService
      .get(id.value)
      .then((response) => {
        tipoVeiculo.value = response
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
            <Skeleton
              width="10rem"
              height="4rem"
              borderRadius="16px"
            ></Skeleton>
          </div>
          <div class="formgrid grid" v-else>
            <div class="field md:col-12 col-12">
              <label for="name">Descrição</label>
              <InputText
                required="true"
                :class="{ 'p-invalid': submitted && !tipoVeiculo.DESTIPVEI }"
                v-model="tipoVeiculo.DESTIPVEI"
                maxLength="30"
              />
              <small class="p-error" v-if="submitted && !tipoVeiculo.DESTIPVEI"
                >Descrição é obrigatória.</small>
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
  </div>
</template>
