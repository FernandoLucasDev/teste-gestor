<script setup>
import { ref, onMounted, onUpdated, defineProps, defineEmits, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";
import { moneyFormat } from '@/mixins/Formatters';

import PedidoEcommerceCarrinhoService from '@/service/PedidoEcommerceCarrinhoService';

const ProdutoOverview = defineAsyncComponent(() => import('./ProdutoOverview.vue'));

const router = useRouter();
const toast = useToast();

const props = defineProps({
    data : Object,
    visible : Boolean
});

const emit = defineEmits(['hide', 'cleared', 'updated']);

const pedidoEcommerceCarrinhoService = new PedidoEcommerceCarrinhoService();

const show = ref(false);
const carrinho = ref(props.data);
const loading = ref(false);
const total = ref(0);
const deleteDialog = ref(false);
const item = ref();

const removeItem = (_item) => {
    deleteDialog.value = true;
    item.value = _item;
}

const remove = async () => {
    loading.value = true;
    deleteDialog.value = false;

    await pedidoEcommerceCarrinhoService.removeItem(item.value.id);
    carrinho.value = await pedidoEcommerceCarrinhoService.get();
    // console.log("📍 -> file: Carrinho.vue:43 -> remove -> carrinho.value:", carrinho.value)

    loading.value = false;
    item.value = null;
    emit('updated');
}

const updateItem = async (_data) => {
  // console.log("começou");
    carrinho.value.items.map(
        (entry, index) => {
            const newEntry = entry;
            if (entry.id == _data.id) {
                newEntry.qtd = _data.qtd;
                newEntry.shouldUpdate = true;
                newEntry.observacao = _data.observacao;

                if (_data.tamanho) {
                    newEntry.tamanho = _data.tamanho;
                }
              // console.log(newEntry, index);
                carrinho.value.items[index] = newEntry;
            }
        }
    );
  // console.log("terminou");

    await sum();
}

const clear = () => {
    show.value = false;
    pedidoEcommerceCarrinhoService.delete()
    .then(res => {
        emit("cleared");
    })
}

const sum = async () => {
    // carrinho.value = await pedidoEcommerceCarrinhoService.get();
    if (!carrinho.value.items) return;
    // console.log("📍 -> file: Carrinho.vue:79 -> sum -> carrinho.value.items:", carrinho.value.items)
    total.value = 0;

    carrinho.value.items.map(
        item => {
            if (item.valor && item.qtd) {
                total.value += (item.valor * item.qtd);
            }
        }
    );
}

const onHide = () => {
  emit("hide", true);
}

const save = async () => {
    // console.log(carrinho.value.items);

    // const length = carrinho.value.items.length - 1;
    const length = carrinho.value.items.length;

    for (let i = 0; i < length; i++) {
        const item = carrinho.value.items[i];
      // console.log("📍 -> file: Carrinho.vue:105 -> save -> item.shouldUpdate:", item.shouldUpdate)
        if (!item.shouldUpdate)  continue;

        toast.add({ severity: 'info', summary: 'Carrinho', detail: 'Atualizando item #' + (i+1), life: 3000 });

        const response = await pedidoEcommerceCarrinhoService.updateItem(item.id, {
            qtd : item.qtd,
            tamanho : item.tamanho,
            observacao : item.observacao
        });

        if (response) {
            toast.add({ severity: 'success', summary: 'Carrinho', detail: 'Item #' + (i+1) + " atualizado", life: 3000 });
        }
    }

    sum();

    emit('updated');
}

const saveAndConfirm = async () => {
    await save();
    confirm();
}

const confirm = () => {
    router.push({ path : "pedido-ecommerce/confirm"});
}

onMounted(() => {
    sum();
});

onUpdated(() => {
    show.value = props.visible;
    carrinho.value = props.data;

    sum();
});
</script>

<template>
    <Toast />
    <Dialog v-model:visible="show" modal header="Carrinho" :style="{ width: '300vw' }" @hide="onHide">
        <ProgressSpinner style="margin-left: auto; margin-right: auto; display: block" v-if="loading" />
        <div class="grid">
            <div class="lg:col-12">
                <h3>Cliente: <strong>{{ carrinho.entidade.NOMENT }}</strong></h3> 
            </div>
        </div>
        <DataView :value="carrinho.items" v-if="!loading">
            <template #list="slotProps">
                <ProdutoOverview 
                    :data="slotProps.data" 
                    :show-delete="true"
                    :can-edit="true"
                    @removed="(data) => removeItem(data)"
                    @updated="(data) => updateItem(data)"
                 />               
            
            </template>
            <template #footer>
                <div class="col-12">
                    <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        Total <span class="text-2xl font-semibold">R$ {{ moneyFormat(total) }}</span>
                    </div>
                </div>            
            </template>
        </DataView>

        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="onHide" text />
            <Button label="Limpar" icon="pi pi-trash" class="p-button-danger" @click="clear" autofocus />
            <Button label="Salvar" icon="pi pi-check" class="p-button-secondary" @click="save" />
            <Button label="Confirmar" icon="pi pi-check" class="p-button-success" @click="confirm" autofocus />
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