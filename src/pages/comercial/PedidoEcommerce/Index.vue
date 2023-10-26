<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";

import EventBus from '@/AppEventBus';

import ProdutoService from '@/service/ProdutoService';
import PedidoEcommerceCarrinhoService from '@/service/PedidoEcommerceCarrinhoService';
import EntidadeService from '@/service/EntidadeService';
import ProdutoCorService from '@/service/ProdutoCorService';

import { moneyFormat } from '@/mixins/Formatters';
import { removeAccents } from '@/defaults/string';
import moment from "moment";

const toast = useToast();
const router = useRouter();
const route = useRoute();

const user = ref();
const layout = ref('grid');
const sortKey = ref(null);
const sortOrder = ref(null);
const sortField = ref(null);
const nomeProduto = ref();

const sortOptions = ref([
    { label: 'Maior para menor', value: '!VALPRO' },
    { label: 'Menor para maior', value: 'VALPRO' }
]);

const cartOpen = ref(false);
const loading = ref(false);
const loadingProduto = ref(false);
const totalRecords = ref(0);
const perPage = ref(40);
const produtos = ref([]);
const produtosData = ref([]);
const carrinho = ref({
    items : [],
    qtd : 0
});
const listaEntidade = ref([]);
const produto = ref();
const produtoView = ref(false);
const entidade = ref();
const produtoOutOfRange = ref(false);
const entidadeModal = ref(false);
const dialogOutOfRange = ref(false);

const page = ref(0);

const CarrinhoView = defineAsyncComponent(() => import('./Carrinho.vue'));
const ProdutoView = defineAsyncComponent(() => import('./Produto.vue'));
const ProdutoImage = defineAsyncComponent(() => import('@/components/ProdutoImage.vue'));

const produtoService = new ProdutoService();
const pedidoEcommerceCarrinhoService = new PedidoEcommerceCarrinhoService();
const entidadeService = new EntidadeService();
const produtoCorService = new ProdutoCorService();

const onEntidadeSelected = () => {
  // console.log("entidade", entidade);
    entidadeModal.value = false;
    if(entidade.value){
        load();
        loadCart();
    }
}

const load = async (options) => {
    console.log(options);

    if (options) {
        if (options.page) {
            page.value = options.page;
        }
        else {
            options = null;
        }
    }

    loading.value = true;

    const response = await produtoService.all(options, entidade.value.value);

    produtosData.value = produtos.value = response;

    loading.value = false;
}

const openProduto = async (_produto) => {
    if (!entidade.value) {
        toast.add({ severity: 'warn', summary: 'Carrinho', detail: 'Selecione um cliente primeiro', life: 3000 });
        return;
    }

    let idx = produtos.value.findIndex(item => item.CODPRO == _produto.CODPRO);
    produtos.value[idx].loading = true;
    _produto.cores = await produtoCorService.allWithPraca(_produto.CODPRO, entidade.value.value);
    _produto.tamanhos = await produtoService.getTamanhos(_produto.CODPRO);

    produto.value = _produto;
    produtoView.value = true;
    produtos.value[idx].loading = false;
}

const onCartItemAdding = () => {
    toast.add({ severity: 'info', summary: 'Carrinho', detail: 'Adicionando Item', life: 3000 });

    loadCart();
}

const onCartItemAdded = () => {
    pedidoEcommerceCarrinhoService.store({
        CODENT : entidade.value.value
    })
    .then((response) => {
        pedidoEcommerceCarrinhoService.addItem(produto.value)
        .then((response) => {
            if (response[0] == 1) {
                toast.add({ severity: 'success', summary: 'Carrinho', detail: 'Item adicionado', life: 3000 });

                loadCart();
            }   
            else {
                if (pedidoEcommerceCarrinhoService.result) {
                    if (pedidoEcommerceCarrinhoService.result.response.status == 403) {
                        onOutOfRange();
                    }
                }          
            }   
        });
    });
}

const onCartCleared = () => {
    toast.add({ severity: 'success', summary: 'Carrinho', detail: 'Carrinho esvaziado', life: 3000 });

    loadCart();
}

const onCartUpdated = () => {
    toast.add({ severity: 'info', summary: 'Carrinho', detail: 'Carrinho atualizado', life: 3000 });

    loadCart();
}

const onOutOfRange = () => {
    produtoOutOfRange.value = true;
}

const loadCart = async () => {
    const data = await pedidoEcommerceCarrinhoService.get()
    carrinho.value = data;
    if (carrinho.value) {
        if (carrinho.value.entidade) {
            entidade.value = {
                label : carrinho.value.entidade.NOMENT,
                value : carrinho.value.entidade.CODENT,
            };
        }
    }
}
// Abre o modal do carrinho
const toggleCart = (event) => {
    cartOpen.value = !cartOpen.value;
    event.preventDefault();
}

const onPage = (event) => {
    load(event);
}
const onSort = (event) => {
    //load(event);
    const value = event.value.value;
    const sortValue = event.value;

    if (value.indexOf('!') === 0) {
        sortOrder.value = -1;
        sortField.value = value.substring(1, value.length);
        sortKey.value = sortValue;
    }
    else {
        sortOrder.value = 1;
        sortField.value = value;
        sortKey.value = sortValue;
    }
}

const goToOrders = () => {
    router.push({ path : "/comercial/pedido-ecommerce/orders" });
}

const openModalOutOfRange = (data) => {
    produto.value = data;
    dialogOutOfRange.value = true;
}

const openPedido = (id) => router.push({ path : '/comercial/pedido-ecommerce/order/' + id });

const search = () => {
    let data = produtosData.value;

    if (nomeProduto.value) {
        data = data.filter(
            entry => removeAccents(entry.DESPRO).toLowerCase().indexOf(removeAccents(nomeProduto.value).toLowerCase()) > -1
        );
    }

    produtos.value = data;
}

onMounted(async () => {
    loading.value = true;
    
    // Load user data
    EventBus.on('user-checked', (response) => user.value = response);  

    const responseEntidade = await entidadeService.allResumido();
    const listaEntidadeData = responseEntidade;    

    listaEntidade.value = listaEntidadeData.map((entry) => ({
        label: entry.NOMENT,
        value: entry.CODENT,
    }));

    await loadCart();

    if(entidade.value){
        load();
    }
    else {
        loading.value = false;
    }
});

</script>

<template>
    <Toast />

    <div id="layout-config" style="top: 150px; z-index: 700; width: 50%" v-if="carrinho.items && carrinho.items.length" :class="'layout-config'">
        <button class="layout-cart-button p-link" type="button" @click="toggleCart">
            <i class="pi pi-shopping-cart"></i>
        </button>
        <Badge severity="success" :value="carrinho.items.length" style="top: 235px; left: -25px; position: fixed" />
    </div>    
    
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Pedido E-commerce / Produtos</h5>
                <div class="col-12" v-if="loading">
                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <Skeleton class="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <Skeleton class="w-8rem border-round h-2rem" />
                                <Skeleton class="w-6rem border-round h-1rem" />
                                <div class="flex align-items-center gap-3">
                                    <Skeleton class="w-6rem border-round h-1rem" />
                                    <Skeleton class="w-3rem border-round h-1rem" />
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <Skeleton class="w-4rem border-round h-2rem" />
                                <Skeleton shape="circle" class="w-3rem h-3rem" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <Skeleton class="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <Skeleton class="w-8rem border-round h-2rem" />
                                <Skeleton class="w-6rem border-round h-1rem" />
                                <div class="flex align-items-center gap-3">
                                    <Skeleton class="w-6rem border-round h-1rem" />
                                    <Skeleton class="w-3rem border-round h-1rem" />
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <Skeleton class="w-4rem border-round h-2rem" />
                                <Skeleton shape="circle" class="w-3rem h-3rem" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                        <Skeleton class="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                        <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                                <Skeleton class="w-8rem border-round h-2rem" />
                                <Skeleton class="w-6rem border-round h-1rem" />
                                <div class="flex align-items-center gap-3">
                                    <Skeleton class="w-6rem border-round h-1rem" />
                                    <Skeleton class="w-3rem border-round h-1rem" />
                                </div>
                            </div>
                            <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <Skeleton class="w-4rem border-round h-2rem" />
                                <Skeleton shape="circle" class="w-3rem h-3rem" />
                            </div>
                        </div>
                    </div>
                </div>

                <DataView 
                    :value="produtos" 
                    :layout="layout" 
                    :paginator="true" 
                    :rows="9"                    
                    :loading="loading"
                    :rowsPerPageOptions="[3, 6, 9, 12]" 
                    :sortOrder="sortOrder"
                    :sortField="sortField"
                    responsiveLayout="scroll" 
                    dataKey="CODPRO"
                    v-if="!loading"
                    >
                    <template #header>
                        <div class="formgrid grid overflow-hidden">
                            <div class="col-auto sm:col-auto md:col-auto lg:col-auto my-3 px-2">
                                <Button label="Pedidos" icon="pi pi-folder" class="p-button-primary" @click="goToOrders" />            
                            </div>
                            <div class="col-12 sm:col-12 md:col-5 lg:col-4 my-3">
                                <Button label="Selecionar cliente" class="p-button-info" @click="entidadeModal = true" text />            
                            </div>                            
                            <div class="col-12 sm:col-12 md:col-4 my-3">
                                <Dropdown v-model="sortKey" class="min-w-full" :options="sortOptions" optionLabel="label" placeholder="Ordenar por preço" @change="onSort($event)" />
                            </div>
                            <div class="col-12 sm:col-2 text-right my-3">
                                <DataViewLayoutOptions v-model="layout" />
                            </div>
                            <div class="col-12 sm:col-12">
                                <div class="formgrid grid p-fluid">
                                    <div class="col-12 sm:col-10">
                                        <InputText v-model="nomeProduto" placeholder="Pesquisar por nome do produto" />
                                    </div>
                                    <div class="col-12 sm:col-2">
                                        <Button label="Procurar" class="p-button-info" icon="pi pi-search" @click="search" text />            
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 sm:col-12 text-right my-3">
                                <h2 class="text-center" v-if="entidade">{{ entidade.label }}</h2>
                            </div>                            
                        </div>
                    </template>
                    <template #empty v-if="!loading">                        
                        <div v-if="entidade">                            
                            <Message severity="info">Nenhum produto encontrado</Message>
                        </div>
                        <div v-else>
                            <Message severity="warn">Selecione um cliente</Message>
                        </div>
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

                    <template #grid="slotProps">
                        <div class="col-12 md:col-4">
                            <div :class=" 'card m-3 flex justify-content-between flex-column ' + (!slotProps.data.out_of_range ? ' shadow-2' : ' border-3 border-red-500') + ' my-3 mx-2'" style="min-height: 515px;">
                                <div class="flex align-items-center justify-content-between"></div>
                                <div class="text-center">
                                    <ProdutoImage :CodPro="slotProps.data.CODPRO" :className="'w-9 my-3 mx-0'" />
                                    <div class="text-2xl font-bold">{{ slotProps.data.DESPRO }}</div>
                                    <div class="mb-3">{{ slotProps.data.description }}</div>
                                    <span class="text-2xl font-semibold" v-if="slotProps.data.VALPRO">R$ {{ moneyFormat(slotProps.data.VALPRO) }}</span>
                                </div>
                                <div class="flex align-items-center justify-content-between">
                                    <Button :loading="slotProps.data.loading" icon="pi pi-shopping-cart" class="p-button-secondary" :disabled="slotProps.data.inventoryStatus === 'OUTOFSTOCK' || slotProps.data.loading" @click="openProduto(slotProps.data)"></Button>
                                    <Button icon="pi pi-question" class="p-button-warn"  @click="openModalOutOfRange(slotProps.data)" v-if="slotProps.data.out_of_range"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>                      
            </div>
        </div>
    </div>
    <CarrinhoView
        :data="carrinho"
        :visible="cartOpen"
        @hide="cartOpen = false"
        @cleared="onCartCleared"
        @updated="onCartUpdated"
    />
    <ProdutoView
        :data="produto"
        :visible="produtoView"
        :entidade="entidade"
        @hide="produtoView = false"
        @adding="onCartItemAdding"
        @added="onCartItemAdded"
        @out-of-range="onOutOfRange"
    />

    <Dialog v-model:visible="entidadeModal" modal header="Cliente" class="w-full lg:w-7 p-fluid" @hide="onHide">
        <div class="formgrid grid">
            <div class="field col-12">
                <!-- <div class="field"> -->
                    <Dropdown v-model="entidade" :options="listaEntidade" optionLabel="label" placeholder="Selecione" filter>
                        <template #value="slotProps">
                        <div v-if="slotProps.value && slotProps.value.value">
                            <span :class="'product-badge status-' +slotProps.value.value">{{slotProps.value.label}}</span>
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                        </template>
                    </Dropdown>

                    <!-- </div> -->
                </div>
            </div>

        <template #footer>
            <Button label="OK" icon="pi pi-check" class="p-button-info" @click="onEntidadeSelected" text />
        </template>
    </Dialog>

    <Dialog v-model:visible="produtoOutOfRange" modal header="Produto" @hide="produtoOutOfRange = false" :style="{ width: '50vw' }">
        <p>
            <strong>{{ produto.DESPRO }}</strong> já vendido nesta praça com esta cor!
        </p>
        <p>
            Este item não pode ser adicionado
        </p>
        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="produtoOutOfRange = false" text></Button>            
        </template>
    </Dialog>
    <Dialog v-model:visible="dialogOutOfRange" modal header="Produto" @hide="dialogOutOfRange = false" :style="{ width: '50vw' }">
        <p>
            <strong>{{ produto.DESPRO }}</strong>
        </p>
        <p>
            Vendas nesta praça
        </p>

        <div class="formgrid">
            <div class="col-12">
                <Accordion>
                    <AccordionTab :header="entry.entidade.NOMENT" v-for="(entry, index) in produto.out_of_range" :key="index">
                        <Chip :label="entry.cor.DESCOR" />
                        <p><strong>Data da venda:</strong> {{ moment(entry.data_venda).format("DD/MM/YYYY") }}</p>

                        <Button label="Abrir pedido" icon="pi pi-external-link" class="p-button-info" @click="openPedido(entry.id)" text></Button>
                    </AccordionTab>
                </Accordion>                
            </div> 
        </div>
        
        
        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="dialogOutOfRange = false" text></Button>
        </template>
    </Dialog>
</template>

<style scoped lang="scss">
@import '@/assets/demo/badges.scss';

.shadow-out-of-range {
    // Mudança a pedido do Ricardo para destacar melhor o card
    // box-shadow : 0px 10px 10px rgba(255, 0, 0, 0.5), 0px 0px 2px rgba(255, 0, 0, 0.5), 1px 10px 10px rgba(255, 0, 0, 0.5) !important;
    box-shadow : 0px 0px 0px 3px rgba(255, 0, 0, 1) !important;
}
</style>