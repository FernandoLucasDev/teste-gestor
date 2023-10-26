<script setup>
import { ref, onMounted, onUpdated, defineProps, defineAsyncComponent, defineEmits } from 'vue';
import { useToast } from "primevue/usetoast";

import PedidoEcommerceCarrinhoService from '@/service/PedidoEcommerceCarrinhoService';

import { moneyFormat } from '../../../mixins/Formatters';

const ProdutoImage = defineAsyncComponent(() => import('@/components/ProdutoImage.vue'));

const toast = useToast();

const emit = defineEmits(['hide', "adding", "added", "out-of-range"]);

const props = defineProps({
    data : Object,
    visible : Boolean,
    entidade : Object,
    loading : Boolean,
    label : String
});

const pedidoEcommerceCarrinhoService = new PedidoEcommerceCarrinhoService();

const entidade = ref();
const show = ref(false);
const produto = ref(props.data)
const valor = ref();
const qtd = ref(1);
const observacao = ref();
const corImageView = ref(false);
const corImage = ref([]);
const loading = ref(props.loading);
const label = ref('Carrinho');

const corSelected = ref();
const tamanhoSelected = ref();

const onHide = () => {
  emit("hide", true);
}

const add = () => {
  if (!corSelected.value) {
    toast.add({ severity: 'warn', summary: label, detail: 'Selecione uma cor', life: 3000 });
    return;
  }
  
  if (!tamanhoSelected.value) {
    toast.add({ severity: 'warn', summary: label, detail: 'Selecione um tamanho', life: 3000 });
    return;
  }
  
  if (!qtd.value) {
    toast.add({ severity: 'warn', summary: label, detail: 'Escolha uma quantidade', life: 3000 });
    return;
  }

  emit("adding");
  produto.value.qtd = qtd.value;
  produto.value.tamanho = tamanhoSelected.value.id;
  produto.value.cor = corSelected.value.id;
  produto.value.observacao = observacao.value;
  show.value = false;

  console.log("added");

  emit("added");  

  /*

  pedidoEcommerceCarrinhoService.store({
    CODENT : entidade.value.value
  })
  .then((response) => {
    pedidoEcommerceCarrinhoService.addItem(produto.value)
      .then((response) => {
        if (response[0] == 1) {
          emit("added");          
        }   
        else {
          if (pedidoEcommerceCarrinhoService.result) {
            if (pedidoEcommerceCarrinhoService.result.response.status == 403) {
              emit("out-of-range", {});
            }
          }          
        }   
    });
  });
  */
}

const showImage = (_produto) => {
  corImage.value = [];
  corImage.value.push(_produto);
  corImageView.value = true;
}

const selectCor = (item) => corSelected.value = item;
const selectTamanho = (item) => tamanhoSelected.value = item;

const clear = () => {
  valor.value = null;
  qtd.value = 1;
  corSelected.value = null;
  tamanhoSelected.value = null;
  observacao.value = null;
}

onMounted(() => {
  clear();
});

onUpdated(() => {
  show.value = props.visible;
  produto.value = props.data;
  entidade.value = props.entidade;
  loading.value = props.loading;
  label.value = props.label ?? 'Carrinho';

  clear();
});

</script>

<template>
  <Toast />

  <Dialog v-model:visible="show" modal maximizable header="Produto" class="w-full lg:w-7" @hide="onHide">
    <div v-if="loading">
      <Skeleton class="mb-2" borderRadius="16px"></Skeleton>
      <Skeleton width="10rem" class="mb-2" borderRadius="16px"></Skeleton>
      <Skeleton width="5rem" borderRadius="16px" class="mb-2"></Skeleton>
      <Skeleton height="2rem" class="mb-2" borderRadius="16px"></Skeleton>
      <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
    </div>
    <div class="col-12" v-else>
      <div class="grid">
        <div class="col-12 sm:col-12 md:col-5 lg:col-5">
            <Carousel :value="produto.cores">
              <template #item="slotProps">
                <div class="border-1 surface-border border-round m-2 text-center p-2">
                    <div class="mb-3">
                      <ProdutoImage :CodPro="produto.CODPRO" className='w-8 shadow-2' />
                    </div>
                    <div>
                        <h4 class="mb-1">{{ slotProps.data.cor.DESCOR }}</h4>  
                        <Tag value="Selecionado" severity="success" v-if="corSelected == slotProps.data" />
                        <div class="mt-5">
                            <Button icon="pi pi-check" rounded class="mr-2 p-button-success" @click="selectCor(slotProps.data)" v-if="corSelected == slotProps.data" />
                            <Button icon="pi pi-check" rounded class="mr-2 p-button-secondary" @click="selectCor(slotProps.data)" v-else />
                            <Button icon="pi pi-eye" rounded class="mr-2" severity="help" @click="showImage(produto)" />
                        </div>
                    </div>
                </div>
              </template>
            </Carousel>
        </div>
        <div class="col-12 sm:col-12 md:col-7 lg:col-7">
          <div class="text-2xl font-bold text-900">{{ produto.DESPRO }}</div>
          <div class="grid" style="margin-top:20px">
            <div class="md:col-6">
              <h3>R$ {{ moneyFormat(produto.VALPRO)  }}</h3>
            </div>            
          </div>
          <div class="grid">
            <div class="md:col-2 col-12">
              <h3>Quantidade:</h3>
              <InputText type="number" v-model="qtd" />
            </div>
          </div>                        

          <h3>Tamanhos</h3>
          <div class="grid" style="margin-top: 20px">
            <div class="col-2" v-for="item in produto.tamanhos" :key="item.tamanho.CODTAM">
              <Chip :label="item.tamanho.CODTAM" :class=" item == tamanhoSelected ? 'chipSelected' : 'chipDefault' " @click="selectTamanho(item)" />
            </div>
          </div>

          <div class="row">
            <div class="md:col-6">
              <h3>Observação:</h3>
              <Textarea v-model="observacao" cols="40" maxlength="254" />
            </div>
          </div>
        </div>
      </div>
    </div> 

    <template #footer>
        <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="onHide" text />
        <Button label="Adicionar" icon="pi pi-check" class="p-button-success" @click="add"  autofocus />
    </template>
  </Dialog>

  <Galleria v-model:visible="corImageView" :value="corImage" :responsiveOptions="responsiveOptions" :numVisible="corImage" containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
    <template #item="slotProps">
      <ProdutoImage :CodPro="slotProps.item.CODPRO" style="width: 100%; display: block" />
    </template>
    <template #thumbnail="slotProps">
      <ProdutoImage :CodPro="slotProps.item.CODPRO" style="max-width: 100px ;display: block" />
    </template>
  </Galleria>
</template>

<style>
.chipDefault {
  cursor: pointer;
}
.chipSelected {
  background-color: green;
  color: white;
}
</style>