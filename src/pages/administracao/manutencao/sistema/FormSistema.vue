<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
// import 'primeicons/primeicons.css'
import { fas, prefix } from '@fortawesome/free-solid-svg-icons'
import SistemaService from '../../../../service/administracao/SistemaService';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const sistemaService = new SistemaService();

const id = ref();
const iconOptions = ref([]);
const sistema = ref({});
const loading = ref(false);
const submitted = ref(false);

const formsubmit = (event) => {
  if (!sistema.value.CODSIS) {
    toast.add({ severity:'error', summary: 'Dados', detail: 'Informe um código de sistema', life: 3000 });
    return false;
  }

  if (!sistema.value.NOMSIS) {
    toast.add({ severity:'error', summary: 'Dados', detail: 'Informe uma descrição', life: 3000 });
    return false;
  }

  if (!sistema.value.ICOSIS) {
    toast.add({ severity:'error', summary: 'Dados', detail: 'Informe um icone', life: 3000 });
    return false;
  }

  return true;
}

const save = async () => {
  submitted.value = true;
  loading.value = true;

  if (!formsubmit()) {
    loading.value = false;
    return;
  }


  if (sistema.value.ICOSIS) {
    // let iconName = sistema.value.ICOSIS.nome
    sistema.value.ICOSIS = sistema.value.ICOSIS.nome;
  }

  let response;  
  if (id.value) {
    response = await sistemaService.update(sistema.value);
  }
  else{
    response = await sistemaService.store(sistema.value);
  }

  if (response) {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Sistema salvo com sucesso', life: 3000 });
    submitted.value = false;
    setTimeout(() => back(), 2000);
  }
  else {
    submitted.value = false;
    toast.add({severity:'error', summary: 'Erro', detail: 'Sistema não salvo', life: 3000});
    loading.value = false;
  }
};

const back = () => router.push({ path : '/administracao/fmtad04' });

const montaArrayIcones = async() => {
  let arr = Object.values(fas);
  let arrIcones = [];
  
  // iconOptions.value = arr.map((item, index) => {
  return new Promise((resolve)=>{
    arrIcones = arr.map((item, index) => {
      return {
        id: index,
        nome: item.iconName,
        prefixo: prefix
      }
    })
    resolve(arrIcones);
  });
};

onMounted(async () => {
  iconOptions.value = await montaArrayIcones();
  console.log(iconOptions.value);
  id.value = route.params.id;
  
  if (id.value) {
    loading.value = true;
    await sistemaService.get(id.value).then((response) => {
      sistema.value = response;

      if(iconOptions.value.find(icone => icone.nome ==  sistema.value.ICOSIS)){
        sistema.value.ICOSIS = iconOptions.value.find(icone => icone.nome ==  sistema.value.ICOSIS)
      }
    }).finally(() => {
      loading.value = false;
    })
  }

});
</script>
<template>
  <Toast />

  <div v-if="loading">
    <ProgressSpinner style="height: 50px;" />
  </div>

  <div class="p-fluid" v-else>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <form autocomplete="off" @submit.prevent="formsubmit">
            <input autocomplete="false" name="hidden" type="text" style="display:none;">
            <div class="formgrid grid">
              <div class="field col-12 sm:col-12 md:col-2 lg:col-2">
                <label for="name">Código</label>
                <InputText
                  v-model="sistema.CODSIS"
                  required="true"
                  maxlength="2"
                  @input="() => { sistema.CODSIS = sistema.CODSIS.toUpperCase() }" 
                  :class="{'p-invalid': !sistema.CODSIS && submitted}"/>
              </div>
              <div class="field col-12 sm:col-12 md:col-5 lg:col-5">
                <label for="name">Descrição</label>
                <InputText
                  v-model="sistema.NOMSIS"
                  required="true"
                  maxlength="20"
                  @input="() => { sistema.NOMSIS = sistema.NOMSIS.toUpperCase() }"
                  :class="{'p-invalid': !sistema.NOMSIS && submitted}"
                  />
              </div>
              <div class="field col-12 sm:col-12 md:col-5 lg:col-5">
                <label for="name">Icone</label>
                <!-- <InputText v-model="sistema.ICOSIS" required="true" maxlength="50" /> -->
                <Dropdown
                  filter
                  v-model="sistema.ICOSIS"
                  :options="iconOptions"
                  optionLabel="nome"
                  placeholder="Selecione"
                  :class="{'p-invalid': !sistema.ICOSIS && submitted}">
                  <template #value="option">
                    <div v-if="option.value" class="flex align-items-center">
                      <i :class="option.value.prefix + ' ' + option.value.name"></i>
                      {{ option.value.nome }}
                    </div>
                    <span v-else>
                      {{ option.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <i :class="slotProps.option.prefix + ' ' + slotProps.option.name"></i>
                    {{ slotProps.option.nome }}
                  </template>
                </Dropdown>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col-6 md:col-2 float-right">
                <Button
                  label="Voltar"
                  class="p-button-info"
                  style="margin-top: 15%;"
                  @click="back" />
              </div>

              <div class="field col-6 md:col-2">
                <Button
                  label="Salvar"
                  class="p-button-success"
                  icon="pi pi-check"
                  style="margin-top: 15%;"
                  @click="save" 
                  :loading="loading"/>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>