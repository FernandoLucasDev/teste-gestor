<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import TamanhoService from '../../../../service/estoque/TamanhoService';

const router = useRouter();
const toast = useToast();

const tamanhoService = new TamanhoService();

const tamanhos = ref([]);
const tamanho = ref();
const deleteDialog = ref(false);
const loading = ref(false);

const load = () => {
  loading.value = true;

  tamanhoService.all()
  .then(response => tamanhos.value = response)
  .finally(() => {
    loading.value = false;
  });
}

const novo = () => {
  router.push({ path : '/estoque/fmtes01/novo' });
}

const edit = (id) => {
  router.push({ path : '/estoque/fmtes01/alterar/' + id });
}

const confirmDelete = (_tamanho) => {
  tamanho.value = _tamanho;
  deleteDialog.value = true;
}

const deleteFunction = async () => {
  deleteDialog.value = false;
  toast.add({ severity:'info', summary: 'Tamanho', detail: 'Excluindo tamanho', life: 3000});

  tamanhoService.delete(tamanho.value.CODTAM)
  .then(response => {
    if (response) {
      toast.add({ severity:'success', summary: 'Tamanho', detail: 'Tamanho removido com sucesso', life: 3000});

      load();
    }
    else {
      toast.add({ severity:'error', summary: 'Tamanho', detail: 'Ocorreu um erro', life: 3000});
    }
  });
}

onMounted(() => {
  load();
});
</script>

<template>
  <Toast />

  <div class="grid">
		<div class="col-12">
			<div class="card">
        <h5>Tamanhos</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Novo" class="p-button-success" style="margin-top: 15%;" @click="novo" />
            </div>
          </template>
        </Toolbar>

        <DataTable :value="tamanhos" 
          :paginator="true" 
          :rows="10"
          :loading="loading"
          responsiveLayout="scroll" 
          dataKey="CODTAM"
            >      
                <template #empty v-if="!loading">
                    Nenhum registro encontrado
                </template>
                <template #loading>
                    Carregando. Por favor, aguarde...
                </template>
                <template #footer v-if="!loading">
                Total de registros {{ totalRecords}}
                </template>
                <Column field="CODTAM" header="Código" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.CODTAM}}
                    </template>
                </Column>
                <Column field="DESTAM" header="Descrição" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESTAM}}
                    </template>
                </Column>
                <!-- <Column field="DESDOC" header="Extensão" :sortable="true" style="min-width:12rem">
                    <template #body="{data}">
                        {{data.DESDOC}}
                    </template>
                </Column> -->
                <Column headerStyle="min-width:10rem; width:10rem;">
                <template #body="props">
                    <Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data.CODTAM)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(props.data)" />
                </template>
              </Column>
            
        </DataTable>
        <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmação de remoção" :modal="true">
          <div class="flex align-items-center justify-content-center">
            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
            <span>Deseja realmente excluir este Tamanho <b>{{tamanho.DESTAM}}</b>?</span>
          </div>
          <template #footer>
            <Button label="Não" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
            <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="deleteFunction" />
          </template>
        </Dialog>
      </div>
    </div>
  </div>
  </template>