<script setup>
import { ref, onBeforeMount, onUpdated, defineProps, defineEmits } from 'vue';
import { moneyFormat } from '@/mixins/Formatters';

const emit = defineEmits(['removed', 'updated']);

const props = defineProps({
    data : Object,
    showDelete : Boolean,
    canEdit : Boolean
});

const data = ref(props.data);
const showDelete = ref(props.showDelete ?? false);
const canEdit = ref(props.canEdit ?? false);

const qtd = ref(props.data.qtd);
const tamanho = ref(props.data.tamanho ? props.data.tamanho.codtam : null);
const observacao = ref(props.data.observacao);

const tamanhos = ref([]);

const removeItem = (item) => {
    emit("removed", item);
}

const qtdUpdated = () => dataUpdated();

const tamanhoUpdated = () => dataUpdated();

const dataUpdated = () => {
  // console.log("update emit", observacao.value);
    emit('updated', {
        id : data.value.id,
        qtd : qtd.value,
        tamanho : tamanho.value.id,
        observacao : observacao.value
    });
}

const loadTamanhos = async () => {
    tamanhos.value = [];
    data.value.produto.tamanhos.map(
        entry => {
            const _data = {
                id : entry.id,
                DESTAM : entry.tamanho.DESTAM,
            };
            tamanhos.value.push(_data);
            
            if (data.value.tamanho.codtam == entry.tamanho.CODTAM) {
              // console.log(_data);
                tamanho.value = _data;
            }
        }        
    );
}

onBeforeMount(async () => {
    data.value = props.data;
    showDelete.value = props.showDelete;
    canEdit.value = props.canEdit;

//   console.log("data.value", data.value);

    qtd.value = data.value.qtd;
    tamanho.value = data.value.tamanho ?? null;
    observacao.value = data.value.observacao;
    if(tamanho.value){
        await loadTamanhos();
    }
});

onUpdated(() => {
  // console.log("Aquiiii");
    // dataUpdated();
});

</script>

<template>
    <div class="col-12">
        <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
            
            <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="data.produto.default_image" v-if="data.produto.default_image" />
            <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="'images/no-photo.png'" v-else style="max-width : 200px" />
            <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                    <div class="text-2xl font-bold text-900">{{ data.produto.DESPRO }}</div>
                    <div class="flex align-items-center gap-3">
                        <i class="pi pi-tag"></i>
                        <Tag :value="data.cor.cor.DESCOR" severity="primary" v-if="data.cor" />                    
                    </div>
                    <div class="flex flex-wrap align-items-center gap-3">
                        <!-- <span class="flex align-items-center gap-2"> -->
                            <div class="form grid">
                                <div class="field md:col-4" v-if="canEdit">
                                    <label class="font-bold block mb-2">Qtd:</label>
                                    <InputNumber v-model="qtd" inputId="minmax-buttons" mode="decimal" showButtons :min="1" :max="100" @input="qtdUpdated" />
                                </div>
                                <div class="field md:col-6" v-else>
                                    Qtd:    
                                    {{ data.qtd }}
                                </div>
                            </div>
                            <div class="grid">
                                <div class="field md:col-6" v-if="canEdit && tamanhos">
                                    <label class="font-bold block mb-2">Tamanho:</label>
                                    <Dropdown 
                                        v-model="tamanho"
                                        :options="tamanhos"
                                        optionLabel="DESTAM"
                                        placeholder="Selecione"
                                        :showClear="true"
                                        emptyFilterMessage="Nenhum registro encontrado"
                                        @change="tamanhoUpdated"
                                        >
                                        <template #value="slotProps">
                                            <div v-if="slotProps.value">
                                                <span :class="'product-badge status-' +slotProps.value">{{ slotProps.value.DESTAM }}</span>
                                            </div>
                                            <span v-else>
                                                {{ slotProps.placeholder }}
                                            </span>
                                        </template>
                                    </Dropdown>  
                                </div>
                                <div class="md:col-6" v-else>
                                    <Tag :value="tamanho.DESTAM" severity="success" v-if="data.tamanho" />
                                </div>
                            </div>
                        <!-- </span> -->
                    </div>
                    <div class="grid" v-if="observacao || data.observacao">
                        <div class="md:col-3" v-if="canEdit">
                            <label class="font-bold block mb-2">Observação:</label>
                            <!-- <InputText v-model="observacao" maxlength="254" /> -->
                            <Textarea @change="dataUpdated" v-model="observacao" cols="40" maxlength="254" />
                        </div>
                        <div class="md:col-6" v-else>
                        <!-- <div class="md:col-6" v-if="data.observacao"> -->
                            <!-- Observação: -->
                            <label class="font-bold block mb-2">Observação:</label>
                            {{ data.observacao }}
                        </div>
                    </div>
                    <Button icon="pi pi-trash" style="" class="p-button-danger" @click="removeItem(data)" v-if="showDelete" />
                </div>
                <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">                  
                    <span class="text-2xl font-semibold" v-if="data.produto.valores">R$ {{ moneyFormat(data.valor * data.qtd) }}</span>
                    <span class="text-1xl font-semibold" v-if="data.produto.valores">R$ {{ moneyFormat(data.valor) }} (Valor unitário)</span>
                </div>
            </div>
        </div>
    </div>
</template>