<script setup>
import Datepicker from '@vuepic/vue-datepicker';
import { ref, onMounted, onUpdated, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { moneyFormat } from '@/mixins/Formatters';

import PedidoEcommerceCarrinhoService from '@/service/PedidoEcommerceCarrinhoService';
import PedidoEcommerceService from '@/service/PedidoEcommerceService';
import FormaPagamentoService from '@/service/financeiro/FormaPagamentoService';
import CondicaoPagamentoService from '@/service/financeiro/CondicaoPagamentoService';
import ParcelamentoEntregaService from '@/service/financeiro/ParcelamentoEntregaService';
import UsuarioService from "@/service/administracao/UsuarioService";

const ProdutoOverview = defineAsyncComponent(() => import('./ProdutoOverview.vue'));

const router = useRouter();
const toast = useToast();

const pedidoEcommerceCarrinhoService = new PedidoEcommerceCarrinhoService();
const pedidoEcommerceService = new PedidoEcommerceService();
const formaPagamentoService = new FormaPagamentoService();
const condicaoPagamentoService = new CondicaoPagamentoService();
const parcelamentoEntregaService = new ParcelamentoEntregaService();
const usuarioService = new UsuarioService();

const carrinho = ref({
  items : []
});
const loading = ref(false);
const total = ref(0);
const confirmDialog = ref(false);
const deleteDialog = ref(false);
const item = ref();
const entidade = ref();
const comprador = ref();
const formaPagamento = ref();
const formasPagamento = ref([]);
const condicaoPagamento = ref();
const condicoesPagamento = ref([]);
const parcelamentosEntregaSelected = ref([]);
const parcelamentosEntrega = ref([]);
const dataVenda = ref();
const prontaEntrega = ref(false);
const user = ref();

const sum = () => {
    if (!carrinho.value.items) return;

    total.value = 0;

    carrinho.value.items.map(
        item => {
            if (item.valor && item.qtd) {
                total.value += (item.valor * item.qtd);
            }
        }
    );
}

const preDone = () => {  
  if (user.value.isAdmin) {
    if (!formaPagamento.value) {
      toast.add({ severity: 'error', summary: 'Carrinho', detail: 'Informe uma forma de pagamento', life: 3000 });
      return;
    }
    
    if (!condicaoPagamento.value) {
      toast.add({ severity: 'error', summary: 'Carrinho', detail: 'Informe uma condição de pagamento', life: 3000 });
      return;
    }
    
    if (parcelamentosEntregaSelected.value.length == 0) {
      toast.add({ severity: 'error', summary: 'Carrinho', detail: 'Informe um parcelamento de entrega', life: 3000 });
      return;
    }
  }

  confirmDialog.value = true;
}

const done = () => {
  confirmDialog.value = false;
  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Registrando pedido...', life: 3000 });

  pedidoEcommerceService.store({
    CODFPG : formaPagamento.value ? formaPagamento.value.CODFPG : null,
    CODCND : condicaoPagamento.value ? condicaoPagamento.value.CODCND : null,
    comprador: comprador.value,
    dataVenda : dataVenda.value,
    parcelamentos_entrega : parcelamentosEntregaSelected.value ? parcelamentosEntregaSelected.value : null,
    pronta_entrega : prontaEntrega.value
  })
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido realizado com sucesso', life: 3000 });

      setTimeout(() => router.push({ path : "/comercial/fdgco12"}), 3300);
    }    
    else {
      toast.add({ severity: 'error', summary: 'Pedido', detail: 'Ocorreu um erro', life: 3000 });
    }
  })
  .finally(() => {
    entidade.value = null;
    loading.value = false;
  });
}

const load = () => {
  pedidoEcommerceCarrinhoService.get()
  .then(response => {
    // console.log("responseresponse",response);
    carrinho.value = response;
    loading.value = false;
    sum();
  });
}

const back = () => {
  // console.log("Entrou na funçao back");
  router.push({ path : '/comercial/fdgco12'});
}

onMounted(() => {
  loading.value = true;

  formaPagamentoService.all()
  .then(response => formasPagamento.value = response)

  condicaoPagamentoService.all()
  .then(response => condicoesPagamento.value = response)
  
  parcelamentoEntregaService.all()
  .then(response => parcelamentosEntrega.value = response)

  usuarioService.me()
  .then(
    response => 
    user.value = response
  )
  .finally(() => {
    load();
  });
});

</script>

<template>
  <Toast />

  <div class="grid">
		<div class="col-12">
			<div class="card">
        <h5>Pedido E-commerce / Confirmação</h5>
      
        <ProgressSpinner style="margin-left: auto; margin-right: auto; display: block" v-if="loading" />

        <h3 v-if="!carrinho.items">Nenhum item encontrado adicionado ao carrinho</h3>
        <div class="grid" v-if="!loading && user">
            <div class="lg:col-12" v-if="carrinho.entidade">
                <h3>Cliente: <strong>{{ carrinho.entidade.NOMENT }}</strong></h3> 
            </div>
            <div class="lg:col-12">
              <DataView :value="carrinho.items" v-if="!loading && carrinho.items">
                <template #list="slotProps">
                  <ProdutoOverview :data="slotProps.data" />
                </template>
                <template #footer>
                    <div class="col-12">
                        <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            Total <span class="text-2xl font-semibold">R$ {{ moneyFormat(total) }}</span>
                        </div>
                    </div>            
                </template>
            </DataView>  

            <div class="p-fluid"  style="margin-top : 50px" v-if="carrinho.items">
              <div class="field md:col-6">
                <label>Comprador</label>
                <InputText v-model="comprador" />
              </div>
              <div class="field md:col-6" v-if="user.isAdmin">
                <label>Forma de pagamento</label>
                <Dropdown 
                  v-model="formaPagamento" 
                  :options="formasPagamento" 
                  optionLabel="DESFPG" 
                  placeholder="Selecione" 
                  :showClear="true" 
                  emptyFilterMessage="Nenhum registro encontrado"
                  filter
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value">
                      <span :class="'product-badge status-' +slotProps.value">{{slotProps.value.DESFPG}}</span>
                    </div>
                    <span v-else>
                      {{slotProps.placeholder}}
                    </span>
                  </template>
                </Dropdown>
              </div>
              <div class="field md:col-6" v-if="user.isAdmin">
                <label>Condição de pagamento</label>
                <Dropdown 
                  v-model="condicaoPagamento" 
                  :options="condicoesPagamento" 
                  optionLabel="DESCND" 
                  placeholder="Selecione" 
                  :showClear="true" 
                  emptyFilterMessage="Nenhum registro encontrado"
                  filter
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value">
                      <span :class="'product-badge status-' +slotProps.value">{{slotProps.value.DESCND}}</span>
                    </div>
                    <span v-else>
                      {{slotProps.placeholder}}
                    </span>
                  </template>
                </Dropdown>
              </div>
              <div class="field md:col-6" v-if="user.isAdmin">
                <label>Parcelamento de Entrega</label>
                <MultiSelect v-model="parcelamentosEntregaSelected" display="chip" :options="parcelamentosEntrega" optionLabel="DESPARENT" placeholder="Selecione" />            
              </div>
              <div class="field md:col-6">
                <label>Pronta Entrega?</label>
                <Checkbox v-model="prontaEntrega" :binary="true" style="margin-left : 10px; top : -5px" />
              </div>
              <div class="formgrid grid">
                <div class="col-6 sm:col-12 md:col-6 lg:col-2">
                  <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" @click="back" text />
                </div>
                <div class="col-6 sm:col-12 md:col-6 lg:col-3">
                  <Button label="Fazer pedido" icon="pi pi-check" class="p-button-success" @click="preDone" autofocus />
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  </div>

    <Dialog v-model:visible="confirmDialog" modal header="Fechamento de pedido" :style="{ width: '50vw' }">
        <p>
        Confirma o fechamento deste pedido?
        </p>
        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="confirmDialog = false" text />            
            <Button label="Confirmar" icon="pi pi-check" class="p-button-success" @click="done" autofocus />
        </template>
    </Dialog>
    <Dialog v-model:visible="deleteDialog" modal header="Exclusão de item" :style="{ width: '50vw' }">
        <p>
        Confirma a exclusão deste item <strong>{{ item.produto.DESPRO }}</strong>?
        </p>
        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="deleteDialog = false" text />            
            <Button label="Confirmar" icon="pi pi-check" class="p-button-danger" @click="remove" autofocus />
        </template>
    </Dialog>
</template>