<script setup>
import moment from "moment";
import { ref, onMounted, onUpdated } from 'vue';
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';
import { moneyFormat } from '@/mixins/Formatters';

import PedidoEcommerceService from '@/service/PedidoEcommerceService';

const router = useRouter();
const toast = useToast();

const pedidoEcommerceService = new PedidoEcommerceService();

const loading = ref(false);
const pedidos = ref([]);
const totalRecords = ref();
const optionsStatus = ref(
  [
    {label : 'Todos', value : ""},
    {label : 'Aceitos', value : "A"},
    {label : 'Entregues', value : "E"},
    {label : 'Produção iniciada', value : "I"},
    {label : 'Produção finalizada', value : "F"},
  ]
);
const status = ref("");
const entidade = ref();

const load = (options) => {
  loading.value = true;

  if (!options) {
    options = {};
  }

  if (status.value || entidade.value) {
    options.query = {};
  }

  if (status.value) {
    options.query.status = status.value.value
  }

  if (entidade.value) {
    options.query.entidade = entidade.value.value
  }

  pedidoEcommerceService.all(options)
  .then(response => {
    loading.value = false;
    pedidos.value = response.data;
    totalRecords.value = response.totalRecords;
  });
}

const open = (pedido) => {
  router.push({ path : '/comercial/pedido-ecommerce/order/' + pedido.id });
}

const back = () => {
  router.push({ path : '/comercial/fdgco12'});
}

const onPage = (event) => load(event);

const onSort = (event) => load(event);

onMounted(() => {
  load();
});

onUpdated(() => {

});
</script>

<template>
  <Toast />

  <div class="grid">
		<div class="col-12">
			<div class="card">
        <h5>Pedido E-commerce / Pedidos</h5>
      
        <DataTable :value="pedidos" 
          :lazy="true" 
          :paginator="true" 
          :rows="10"
          :loading="loading"
          :totalRecords="totalRecords"
          @page="onPage($event)"
          @sort="onSort($event)"
          responsiveLayout="scroll" 
          dataKey="id"
          >      
            <template #header>        
              <div class="formgrid grid">
                <div class="field col-12 sm:col-12 md:col-6 lg:col-6">
                    <EntidadeBox :selected="entidade" v-model="entidade" class='min-w-full'/>
                </div>
                  <div class="field col-10 sm:col-6 md:col-5 lg:col-5" >
                    <label for="name"> </label>
                    <Dropdown v-model="status" :options="optionsStatus" optionLabel="label" placeholder="Status" class='min-w-full'>
                      <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                          <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                          {{slotProps.placeholder}}
                        </span>
                      </template>
                    </Dropdown>
                  </div>
                <div class="field col-2 sm:col-1 md:col-1 lg:col-1">
                  <Button label="" icon="pi pi-search" class="p-button-text" @click="load" />
                </div>
              </div>
            </template>
            <template #empty v-if="!loading">
                Nenhum pedido encontrado
            </template>
            <template #loading>
                Carregando pedidos. Por favor, aguarde...
            </template>
            <template #footer v-if="!loading">
              Total de registros {{ totalRecords}}
            </template>          
            <Column field="id" header="#" :sortable="true" style="max-width:15rem">
                <template #body="{data}">
                    {{data.id}}
                </template>
            </Column>
            <Column field="NOMENT" header="Cliente" :sortable="true" style="min-width:12rem">
                <template #body="{data}">
                    {{data.entidade.NOMENT}}
                </template>
            </Column>
            <Column field="usuario.name" header="Vendedor" :sortable="true" style="min-width:12rem">
                <template #body="{data}">
                    {{data.usuario.name}}
                </template>
            </Column>
            <Column field="total" header="Total" :sortable="true" style="min-width:12rem">
                <template #body="{data}">
                    R$ {{ moneyFormat(data.total) }}
                </template>
            </Column>
            <Column field="created_at" header="Data e Hora" :sortable="true" style="min-width:12rem">
                <template #body="{data}">
                    {{ moment(data.created_at).format("DD/MM/YYYY HH:mm") }}
                </template>
            </Column>
            <Column field="usuario_requisita_aprovacao" header="Status" :sortable="true" style="min-width:12rem">
                <template #body="{data}">
                  <div v-if="data.usuario_requisita_aprovacao && !data.data_aprovacao && !data.data_rejeicao">
                    <InlineMessage severity="warn">Aprovação pendente</InlineMessage>
                  </div>
                  <div v-else-if="data.data_aprovacao">
                    <InlineMessage severity="success">Aprovado</InlineMessage>
                  </div>
                  <div v-else-if="data.data_rejeicao">
                    <InlineMessage severity="error">Rejeitado</InlineMessage>
                  </div>
                </template>
            </Column>
                
            <Column headerStyle="min-width:10rem; width:10rem;">
              <template #body="props">
                <Button icon="pi pi-eye" class="p-button-rounded p-button-success mr-2" @click="open(props.data)" />
              </template>
            </Column>
        </DataTable>  
        <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1">
          <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" @click="back" text />  
        </div>
      </div>      
    </div>
  </div>
</template>