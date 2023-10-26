<script setup>
import moment from "moment";
import Datepicker from '@vuepic/vue-datepicker';
import { ref, onMounted, onUpdated, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { moneyFormat } from '@/mixins/Formatters';

import PedidoEcommerceService from '@/service/PedidoEcommerceService';
import UsuarioService from "@/service/administracao/UsuarioService";
import FormaPagamentoService from '@/service/financeiro/FormaPagamentoService';
import CondicaoPagamentoService from '@/service/financeiro/CondicaoPagamentoService';
import ParcelamentoEntregaService from '@/service/financeiro/ParcelamentoEntregaService';
import ProdutoService from '@/service/ProdutoService';
import ProdutoCorService from '@/service/ProdutoCorService';

const ProdutoOverview = defineAsyncComponent(() => import('./ProdutoOverview.vue'));
const ProdutoImage = defineAsyncComponent(() => import('@/components/ProdutoImage.vue'));
const ProdutoView = defineAsyncComponent(() => import('./Produto.vue'));

const router = useRouter();
const route = useRoute();
const toast = useToast();

const pedidoEcommerceService = new PedidoEcommerceService();
const usuarioService = new UsuarioService();
const formaPagamentoService = new FormaPagamentoService();
const condicaoPagamentoService = new CondicaoPagamentoService();
const parcelamentoEntregaService = new ParcelamentoEntregaService();
const produtoService = new ProdutoService();
const produtoCorService = new ProdutoCorService();

const pedido = ref();
const loading = ref(false);
const loadingProducts = ref(false);
const loadingProduct = ref(false);
const total = ref(0);
const id = ref();
const confirmDialog = ref(false);
const cancelaDialog = ref(false);
const deleteDialog = ref(false);
const approveDialog = ref(false);
const rejectDialog = ref(false);
const newItemDialog = ref(false);
const reopenDialog = ref(false);
const user = ref();
const item = ref();
const produtos = ref([]);
const page = ref();
const produto = ref();
const produtoView = ref(false);
const motivo_rejeicao = ref();

const formasPagamento = ref([]);
const condicoesPagamento = ref([]);
const parcelamentosEntrega = ref([]);

const sum = () => {
    if (!pedido.value.items) return;

    total.value = 0;

    pedido.value.items.map(
        item => {
            if (item.valor && item.qtd) {
                total.value += (item.valor * item.qtd);
            }
        }
    );
}

const load = async () => {
  loading.value = true;

  if (user.value.isAdmin) {
    let response = await formaPagamentoService.all();
    formasPagamento.value = response;

    response = await condicaoPagamentoService.all()
    condicoesPagamento.value = response;
    
    response = await parcelamentoEntregaService.all()
    parcelamentosEntrega.value = response;
  }

  pedidoEcommerceService.get(id.value)
  .then(response => {
    pedido.value = response;
    if (pedido.value.codfpg) {
      formasPagamento.value.map(
        entry => {
          if (entry.CODFPG == pedido.value.codfpg) {
            pedido.value.codfpg = entry;
          }
        }
      );
    }
    
    if (pedido.value.codcnd) {
      condicoesPagamento.value.map(
        entry => {
          if (entry.CODCND == pedido.value.codcnd) {
            pedido.value.codcnd = entry;
          }
        }
      );
    }

    if (pedido.value.parcelamentos_entrega) {
      let parcelamentos_entrega = [];
      parcelamentosEntrega.value.map(
        entry => {
          pedido.value.parcelamentos_entrega.map(
            p => {
              if (p.parcelamento_entrega) {
                if (p.parcelamento_entrega.CODPARENT == entry.CODPARENT) {
                  parcelamentos_entrega.push(entry);
                }
              }
            }
          )
        }
      );

      console.log(parcelamentos_entrega);

      pedido.value.parcelamentos_entrega = parcelamentos_entrega;
    }

    if (pedido.value.pronta_entrega) {
      pedido.value.pronta_entrega = true;
    }

    loading.value = false;
    sum();

    loadProducts();
  });
}

const loadProducts = async (options) => {
    if (options) {
        if (options.page) {
            page.value = options.page;
        }
        else {
            options = null;
        }
    }

    loadingProducts.value = true;

    const response = await produtoService.all(options, pedido.value.codent);

    produtos.value = response;

    loadingProducts.value = false;
}

const openProduto = async (_produto) => {
    newItemDialog.value = false;    
    loadingProduct.value = true;    
    produtoView.value = true;

    let idx = produtos.value.findIndex(item => item.CODPRO == _produto.CODPRO);
    produtos.value[idx].loading = true;
    _produto.cores = await produtoCorService.allWithPraca(_produto.CODPRO, pedido.value.codent);
    _produto.tamanhos = await produtoService.getTamanhos(_produto.CODPRO);

    produto.value = _produto;    
    produtos.value[idx].loading = false;
    loadingProduct.value = false; 
}

const onItemAdded = () => {
  pedidoEcommerceService.addItem(id.value, produto.value)
  .then(res => load());
}

const preSave = () => {
  confirmDialog.value = true;
}

const save = () => {
  confirmDialog.value = false;
  loading.value = true;

  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Salvando pedido', life: 3000 });

  if (pedido.value.codcnd) {
    pedido.value.codcnd = pedido.value.codcnd.CODCND;
  }
  if (pedido.value.codfpg) {
    pedido.value.codfpg = pedido.value.codfpg.CODFPG;
  }

  pedidoEcommerceService.update(pedido.value)
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido salvo com sucesso', life: 3000 });
      load();
    }
    else {
      toast.add({ severity: 'error', summary: 'Pedido', detail: 'Ocorreu um erro', life: 3000 });
    }
  })
  .finally(() => {
    loading.value = false;
  });
}

const approve = () => {
  approveDialog.value = false;
  loading.value = true;

  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Aprovando pedido', life: 3000 });

  pedidoEcommerceService.approve(pedido.value)
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido aprovado com sucesso', life: 3000 });
      load();
    }
    else {
      toast.add({ severity: 'error', summary: 'Pedido', detail: 'Ocorreu um erro', life: 3000 });
    }
  })
  .finally(() => {
    loading.value = false;
  });
}

const reject = () => {
  rejectDialog.value = false;
  loading.value = true;

  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Rejeitando o pedido', life: 3000 });

  pedido.value.motivo_rejeicao = motivo_rejeicao.value;

  pedidoEcommerceService.reject(pedido.value)
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido rejeitado com sucesso', life: 3000 });
      load();
    }
    else {
      toast.add({ severity: 'error', summary: 'Pedido', detail: 'Ocorreu um erro', life: 3000 });
    }
  })
  .finally(() => {
    loading.value = false;
  });
}

const reopen = () => {
  reopenDialog.value = false;
  loading.value = true;

  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Reabrindo o pedido', life: 3000 });

  pedidoEcommerceService.reopen(pedido.value)
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido reaberto com sucesso', life: 3000 });
      load();
    }
    else {
      toast.add({ severity: 'error', summary: 'Pedido', detail: 'Ocorreu um erro', life: 3000 });
    }
  })
  .finally(() => {
    loading.value = false;
  });
}

const cancela = () => {
  cancelaDialog.value = false;
  loading.value = true;

  toast.add({ severity: 'info', summary: 'Pedido', detail: 'Cancelando pedido', life: 3000 });

  pedidoEcommerceService.delete(id.value)
  .then((response) => {
    if (response) {
      toast.add({ severity: 'success', summary: 'Pedido', detail: 'Pedido cancelado com sucesso', life: 3000 });

      router.push({ path : '/comercial/pedido-ecommerce/orders' });
    }
  })
  .finally(() => {
    loading.value = false;
  });
}

const removeItem = (_item) => {
  deleteDialog.value = true;
  item.value = _item;
}

const remove = async () => {
  deleteDialog.value = false;

  pedidoEcommerceService.removeItem(item.value.id).then(() => {
    toast.add({ severity: 'success', summary: 'Pedido', detail: 'Item removido com sucesso!', life: 3000 });
    load();
  
    item.value = null;
  }).catch(()=>{
    toast.add({ severity: 'error', summary: 'Atenção', detail: 'Ocorreu um erro!', life: 3000 });
  });
}

const pdf = () => {
  window.open(pedidoEcommerceService.getHost() + "pedido-ecommerce/" + id.value + "/pdf", "_blank");
}

const back = () => {
  router.push({ path : '/comercial/pedido-ecommerce/orders'});
}

onMounted(() => {
  id.value = route.params.id;

  loading.value = true;

  usuarioService.me()
  .then(
    response => 
    user.value = response
  )
  .finally(() => {
    load();
  });
});

onUpdated(() => {

});
</script>

<template>
  <Toast />

  <div class="grid">
		<div class="col-12">
			<div class="card">
        <h5>Pedido {{ id ? "#" + id : "" }}</h5>        
        <div v-if="loading">
          <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
          <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
          <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
          <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
        </div>
        <div class="p-fluid" style="margin-top : 20px" v-if="pedido && !loading">
            <div class="row">
              <div class="col-12">
                <h6>Criado em {{ moment(pedido.created_at).format("DD/MM/YYYY [ás] HH:mm") }}</h6>
              </div>
              <div class="col-12" v-if="pedido.usuario">
                <h6>Criado por {{ pedido.usuario.name }}</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <div v-if="pedido.usuario_requisita_aprovacao && !pedido.data_aprovacao && !pedido.data_rejeicao">
                  <InlineMessage severity="warn">Aprovação pendente</InlineMessage>
                </div>
                <div v-else-if="pedido.data_aprovacao">
                  <InlineMessage severity="success">Aprovado</InlineMessage>
                </div>
                <div v-else-if="pedido.data_rejeicao">
                  <InlineMessage severity="error">Rejeitado</InlineMessage>
                </div>
                <div v-if="pedido.motivo_rejeicao">
                  <Message severity="warn" :closable="false"><strong>Motivo da rejeição: </strong>{{ pedido.motivo_rejeicao }}</Message>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <h3>Cliente</h3> {{ pedido.entidade.NOMENT }}
              </div>
            </div>            
            <hr />
            <Accordion :activeIndex="0">
              <AccordionTab header="Venda" v-if="user">                
                <div class="field md:col-6">
                  <label>Pronta Entrega?</label>
                  <Checkbox v-model="pedido.pronta_entrega" :binary="true" style="margin-left : 10px; top : -5px" />
                </div>
                <div class="row" v-if="user.isAdmin">                  
                  <div class="field md:col-6">
                    <label>Forma de pagamento</label>
                    <Dropdown 
                      v-model="pedido.codfpg" 
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
                  <div class="field md:col-6">
                    <label>Condição de pagamento</label>
                    <Dropdown 
                      v-model="pedido.codcnd" 
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
                  <div class="field md:col-6">
                    <label>Parcelamento de Entrega</label>
                    <MultiSelect v-model="pedido.parcelamentos_entrega" display="chip" :options="parcelamentosEntrega" optionLabel="DESPARENT" placeholder="Selecione" />
                  </div>
                </div>
                <div class="row" v-else>
                  <hr />
                  <div class="col-12">
                    <h5>Comprador</h5> {{ pedido.comprador }}
                  </div>

                  <hr />
                  <div class="col-12">
                    <h5>Forma de pagamento</h5> {{ pedido.forma_pagamento ? pedido.forma_pagamento.DESFPG : "" }}
                  </div>

                  <hr />
                  <div class="col-12">
                    <h5>Condição de pagamento</h5> {{ pedido.condicao_pagamento ? pedido.condicao_pagamento.DESCND : "" }}
                  </div>

                  <hr />

                  <div class="col-12">
                    <h5>Parcelamento de Entrega</h5>
                  </div>
                  <div class="grid">
                    <div class="col-auto sm:col-auto md:col-auto lg:col-auto mx-2" v-for="item in pedido.parcelamentos_entrega" :key="item">
                      <Badge size="large" severity="info" :value="item.parcelamento_entrega.DESPARENT" v-if="item.parcelamento_entrega" />
                    </div>
                  </div>
                </div>               
                
                <hr />                
                <div class="row" v-if="pedido.usuario_requisita_aprovacao">
                  <div class="field md:col-12">
                    <h5>Vendedor:</h5>
                    <strong>{{ pedido.usuario_requisita_aprovacao.NOMUSU }}</strong>
                  </div>
                </div>
              </AccordionTab>
              <AccordionTab header="Datas">
                <div class="field md:col-4">
                  <label>Data da venda</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_venda" :disabled="!user.isAdmin" />
                </div>
                
                <div class="field md:col-4">
                  <label>Data de aceitação</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_aceitacao" :disabled="!user.isAdmin" />
                </div>
                <div class="field md:col-4">
                  <label>Produção iniciada em</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_producao_inicio" :disabled="!user.isAdmin" />
                </div>
                <div class="field md:col-4">
                  <label>Produção finalizada em</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_producao_fim" :disabled="!user.isAdmin" />
                </div>
                <div class="field md:col-4">
                  <label>Despachado em</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_despacho" :disabled="!user.isAdmin" />
                </div>
                <div class="field md:col-4">
                  <label>Entregue em</label>
                  <Datepicker locale="pt-br" :enable-time-picker="false" format="dd/MM/yyyy" v-model="pedido.data_entrega" :disabled="!user.isAdmin" />
                </div>
              </AccordionTab>              
              <AccordionTab header="Items">                
                <DataView :value="pedido.items" v-if="!loading && pedido.items">
                  <template #list="slotProps">
                    <ProdutoOverview :data="slotProps.data" showDelete @removed="(data) => removeItem(data)" />  
                  </template>
                  <template #footer>
                      <div class="col-12">
                          <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                              Total <span class="text-2xl font-semibold">R$ {{ moneyFormat(total) }}</span>
                          </div>
                      </div>            
                  </template>
                </DataView>
                <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1">
                  <Button label="Adicionar Item" icon="pi pi-plus" class="p-button-secondary" @click="newItemDialog = true" />
                </div>
              </AccordionTab>
            </Accordion>  
            
            <div class="formgrid grid" style="margin-top: 20px;">
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1">
                <Button label="Voltar" icon="pi pi-arrow-left" class="p-button-info" @click="back"  text />  
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-danger" @click="cancelaDialog = true"  text />  
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1" v-if="pedido.data_aprovacao && user && pedido.forma_pagamento && pedido.condicao_pagamento && pedido.parcelamentos_entrega.length">
                <Button label="PDF" icon="pi pi-file-pdf" class="p-button-secondary" @click="pdf" text v-if="user.isAdmin" />  
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1" v-if="pedido.data_aprovacao">
                <Button label="Salvar" icon="pi pi-check" class="p-button-success" @click="preSave" autofocus />
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1" v-if="!pedido.data_aprovacao && !pedido.data_rejeicao && user.grupo.ADMGRPUSU == 'S'">
                <Button label="Aprovar" icon="pi pi-check" class="p-button-success" @click="approveDialog = true" autofocus />
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1" v-if="!pedido.data_aprovacao && !pedido.data_rejeicao && user.grupo.ADMGRPUSU == 'S'">
                <Button label="Rejeitar" icon="pi pi-times" class="p-button-warning" @click="rejectDialog = true" autofocus />
              </div>
              <div class="col-6 sm:col-6 md:col-3 lg:col-3 my-1" v-if="pedido.data_rejeicao">
                <Button label="Reabrir pedido" icon="pi pi-check" class="p-button-warning" @click="reopenDialog = true" autofocus />
              </div>
            </div>
        </div>
      </div>
    </div>
  </div>
  <Dialog v-model:visible="newItemDialog" modal header="Novo Item" :style="{ width: '50vw' }">
    <DataView 
        :value="produtos" 
        layout="list" 
        :paginator="true" 
        :rows="9"                 
        :loading="loadingProducts"
        responsiveLayout="scroll" 
        dataKey="CODPRO"
        >
        <template #header>
        </template>
        
        <template #list="slotProps">                        
            <div class="col-12">
                <div class="flex flex-column md:flex-row align-items-center p-3 w-full">
                    <ProdutoImage :CodPro="slotProps.data.CODPRO" :className="'my-4 md:my-0 w-9 md:w-10rem ' + (slotProps.data.out_of_range ? 'shadow-out-of-range' : 'shadow-2') + ' mr-5'" />
                    <div class="flex-1 text-center md:text-left">
                        <div class="font-bold text-2xl">{{ slotProps.data.DESPRO }}</div>
                        <div class="mb-3">{{ slotProps.data.description }}</div>
                        <div class="flex align-items-center">
                            <i class="pi pi-tag mr-2"></i>
                            <span class="font-semibold">{{ slotProps.data.category }}</span>
                        </div>
                    </div>
                    <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                        <span class="text-2xl font-semibold mb-2 align-self-center md:align-self-end">R$ {{ moneyFormat(slotProps.data.VALPRO) }}</span>
                        <Button icon="pi pi-shopping-cart" label="Adicionar" class="p-button-secondary mb-2" :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK'" @click="openProduto(slotProps.data)"></Button>
                        <Button icon="pi pi-question" class="p-button-warn"  @click="openModalOutOfRange(slotProps.data)" v-if="slotProps.data.out_of_range"></Button>
                    </div>
                </div>
            </div>
        </template>      
    </DataView>
    <template #footer>
        <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="newItemDialog = false" text />            
    </template>
  </Dialog>
  <Dialog v-model:visible="confirmDialog" modal header="Pedido" :style="{ width: '50vw' }">
      <p>
      Confirma estas informações deste pedido?
      </p>
      <template #footer>
          <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="confirmDialog.value = false" text />            
          <Button label="Confirmar" icon="pi pi-check" class="p-button-success" @click="save" autofocus />
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
  <Dialog v-model:visible="cancelaDialog" modal header="Pedido" :style="{ width: '50vw' }">
      <p>
      Deseja realmente cancelar deste pedido?
      </p>
      <template #footer>
          <Button label="Fechar" class="p-button-info" @click="cancelaDialog = false" text />            
          <Button label="Confirmar" icon="pi pi-times" class="p-button-danger" @click="cancela" autofocus />
      </template>
  </Dialog>
  <Dialog v-model:visible="approveDialog" modal header="Aprovação de Pedido" :style="{ width: '50vw' }">
      <p>
      Deseja realmente <strong>aprovar</strong> dste pedido?
      </p>
      <template #footer>
          <Button label="Fechar" class="p-button-info" @click="approveDialog = false" text />            
          <Button label="Confirmar aprovação de pedido" icon="pi pi-check" class="p-button-warning" @click="approve" autofocus />
      </template>
  </Dialog>
  <Dialog v-model:visible="rejectDialog" modal header="Aprovação de Pedido" :style="{ width: '50vw' }">
      <p>
      Deseja realmente <strong>rejeitar</strong> este pedido?
      </p>
      <div class="formgrid grid p-fluid">
          <div class="col-12 sm:col-10">
              <InputText v-model="motivo_rejeicao" placeholder="Motivo" />
          </div>
      </div>
      <template #footer>
          <Button label="Fechar" class="p-button-info" @click="rejectDialog = false" text />            
          <Button label="Confirmar rejeição de pedido" icon="pi pi-check" class="p-button-warning" @click="reject" autofocus />
      </template>
  </Dialog>
  <Dialog v-model:visible="reopenDialog" modal header="Reabertura de Pedido" :style="{ width: '50vw' }">
      <p>
      Deseja realmente <strong>reabrir</strong> este pedido?
      </p>
      <template #footer>
          <Button label="Fechar" class="p-button-info" @click="reopenDialog = false" text />            
          <Button label="Confirmar reabertura de pedido" icon="pi pi-check" class="p-button-warning" @click="reopen" autofocus />
      </template>
  </Dialog>

  <ProdutoView
    :data="produto"
    :visible="produtoView"
    :entidade="entidade"
    :loading="loadingProduct"
    label="Pedido"
    @hide="produtoView = false"
    @added="onItemAdded"
    @out-of-range="onOutOfRange"
    />
</template>