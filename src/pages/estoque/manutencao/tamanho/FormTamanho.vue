<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRoute, useRouter } from 'vue-router';
import TamanhoService from '../../../../service/estoque/TamanhoService';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const tamanhoService = new TamanhoService();

const id = ref();
const tamanho = ref({});
const loading = ref(false);
const editando = ref(false);


const save = async () => {
  toast.add({ severity:'info', summary: 'Tamanho', detail: 'Salvando tamanho', life: 3000});

  let response;
  if (id.value) {
    tamanho.value.id = tamanho.value.CODTAM;
    response = await tamanhoService.update(tamanho.value);
  }
  else {
    response = await tamanhoService.store(tamanho.value);			
  }  

  if (response) {
    toast.add({severity:'success', summary: 'Sucesso', detail: 'Tamanho salvo com sucesso', life: 3000});

    setTimeout(() => router.push({ path : '/estoque/fmtes01' }), 3000)
  }
  else {
    toast.add({severity:'error', summary: 'Erro', detail: 'Tamanho não salvo', life: 3000});
  }
}

const back = () => router.push({ path : '/estoque/fmtes01' });

onMounted(() => {
  id.value = route.params.id;

  if (id.value) {
    loading.value = true;
    editando.value = true;
    tamanhoService.get(id.value)
    .then( (response) => {
      tamanho.value = response
    })
    .finally(() => {
      loading.value = false;
    });
  }
});

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
                  <InputText :disabled="editando" v-model="tamanho.CODTAM"/>
              </div>
              <div class="field md:col-2 col-12">
                  <label for="name">Ordem</label>
                  <InputText v-model="tamanho.order" type="number"/>
              </div>
              <div class="field md:col-12 col-12">
                  <label for="name">Descrição</label>
                  <InputText v-model="tamanho.DESTAM"/>
              </div>              
            <div class="field col-6 md:col-2 float-right">
              <Button label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
            </div>

            <div class="field col-6 md:col-2">
              <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>