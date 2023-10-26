<script setup>
import { FilterMatchMode } from "primevue/api"
import { onMounted, reactive } from "vue"
import { useToast } from "primevue/usetoast"
import { ref } from "vue"
import DefcontribService from "@/service/DefContribService"
import FormDefContrib from './Form.vue'

const defcontribService = new DefcontribService();
const toast = useToast();
const defContribDialog = ref(false);
const visible = ref(false);
const loading = ref(false);
const skeleton = ref(false);
const editando = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const totalRecords = ref(0);

const id = ref();
const objDefcontrib = reactive({});
const listaDefcontrib = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const load = (options) => {
  loading.value = true;
  skeleton.value = true;
  listaDefcontrib.value.length = 10;
  defcontribService.all(options).then((response) => {
    if (response.length) {
      listaDefcontrib.value = [];
      totalRecords.value = response.length;
      listaDefcontrib.value = response;
    }
  })
  .finally(() => {
    loading.value = false;
    skeleton.value = false;
  });
}

const novo = () => {
  id.value = null;
  objDefcontrib.value = {};
  defContribDialog.value = true;
  visible.value = true;
  submitted.value = false;
  editando.value = false;
}

const edit = (_defcontrib) => {
  editando.value = true;
  id.value = _defcontrib.CODDFC;
  
  objDefcontrib.value = _defcontrib;
  defContribDialog.value = true;

}

const confirmDelete = (_defcontrib) => {
  objDefcontrib.value = _defcontrib;
  deleteDialog.value = true;
}

const deleteFunction = async () => {
  deleteDialog.value = false;

  let response = await defcontribService.delete(objDefcontrib.value);

  if (response) {
    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Registro excluído com sucesso!",
      life: 3000,
    });

    load();
  } else {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Ocorreu um erro",
      life: 3000,
    });
  }
}

const save = async () => {
  // submitted.value = true;
  console.log("objDefcontrib", objDefcontrib.value);

  // let retorno = validateFields();
  let retorno = true;
  if (!retorno) {
    return;
  } else {
    loading.value = true;
    let response;

    if (editando.value) {
      // objDefcontrib.value.id = objDefcontrib.value.CODDFC;
      response = await defcontribService.update(objDefcontrib.value);
      editando.value = false;
    } else {
      response = await defcontribService.store(objDefcontrib.value);
    }

    if (response) {
      defContribDialog.value = false;
      load();
      toast.add({
        severity: "success",
        summary: "Sucesso",
        detail: "Registro salvo com sucesso",
        life: 3000,
      });
    }else {
      toast.add({
        severity: "error",
        summary: "Erro",
        detail: "Falha na operação",
        life: 3000,
      });
    }
    loading.value = false;
  }
}

const validateFields = () => {
  console.log("entrou na função validateFields")
  if (objDefcontrib.value.DESDFC == undefined || objDefcontrib.value.DESDFC == "") {
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Preencha os campos obrigatórios",
      life: 3000,
    });
    return false;
  } else {
    return true;
  }
}

function hideDialog(){
  defContribDialog.value = false;
}

onMounted(() => {
  load();
});
</script>

<template>
  <div class="p-fluid">
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <Toast/>
          <h4>
            <Translate text="Definição de Contribuição" />
          </h4>

          <Toolbar class="mb-4">
            <template v-slot:start>
              <div class="my-2">
                <Button label="Novo" icon="pi pi-plus" class="p-button-success" @click="novo" />
                <!-- <Button label="Novo" class="p-button-success" @click="defContribDialog = true" /> -->
              </div>
            </template>
          </Toolbar>

          <Dialog v-model:visible="defContribDialog" :style="{width: '80vw'}" header="Detalhes da Definição" class="p-fluid" maximizable modal>
            <FormDefContrib :dfc="objDefcontrib" />
            <template #footer>
						  <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
						  <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
					  </template>
          </Dialog>
        </div>
      </div>

      <div class="col-12">
					<div class="card">
						<DataTable 
							:value="listaDefcontrib"
							:paginator="true" 
							:rows="10"
							:totalRecords="totalRecords"
							responsiveLayout="scroll" 
							dataKey="CODENT">

								<template #empty v-if="!loading">
										Nenhum registro encontrado
								</template>
								<template #loading>
									<Skeleton></Skeleton>
								</template>
								<template #footer v-if="!loading">
								Total de registros {{ totalRecords}}
								</template>

								<div v-if="loading">
									<Column header="Código" style="min-width:12rem">
										<template #body>
											<Skeleton style="height: 2rem;" class="mt-2"/>
										</template>
									</Column>
									<Column header="Descrição" style="min-width:12rem">
										<template #body>
											<Skeleton style="height: 2rem;" class="mt-2"/>
										</template>
									</Column>
									<Column headerStyle="min-width:10rem; width:10rem;">
										<template #body>
											<div class="flex align-items-center gap-2 mt-2">
                        <Skeleton shape="circle" style="height: 2.5rem; width: 2.5rem;" />
                        <Skeleton shape="circle" style="height: 2.5rem; width: 2.5rem;" />
                    	</div>
										</template>
									</Column>
								</div>
								<div v-else>
									<Column field="CODDFC" header="Código" :sortable="true" style="min-width:12rem">
											<template v-if="!loading" #body="{data}">
												{{data.CODDFC}}
											</template>
									</Column>
									<Column field="DESDFC" header="Descrição" :sortable="true" style="min-width:12rem">
											<template #body="{data}">
													{{data.DESDFC}}
											</template>
									</Column>
									<Column headerStyle="min-width:10rem; width:10rem;">
										<template #body="props">
												<Button icon="pi pi-pencil" v-tooltip.top="'Editar'" class="p-button-rounded p-button-success mr-2" @click="edit(props.data)" />
												<Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDeleteProduct(props.data)" />
										</template>
									</Column>
								</div>
								
						</DataTable>
					</div>
				</div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';
</style>
