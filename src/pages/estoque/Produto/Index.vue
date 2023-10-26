<script setup>
import { readAndCompressImage } from 'browser-image-resizer';
import { defineAsyncComponent, getCurrentInstance, onMounted, ref } from 'vue';
import { moneyFormat } from '../../../mixins/Formatters';
import ProdutoCorService from '../../../service/ProdutoCorService';
import ProdutoService from '../../../service/ProdutoService';
import CorService from '../../../service/estoque/CorService';
import TamanhoService from '../../../service/estoque/TamanhoService';

const InputCurrency = defineAsyncComponent(() => import('@/components/InputCurrency.vue'));

const internalInstance = getCurrentInstance();

// Lista de produtos
const produtos = ref([]);
const coresSelected = ref([]);
const cores = ref([]);
const tamanhosSelected = ref([]);
const tamanhos = ref([]);
// Total de registros de produtos
const totalRecords = ref(0);
// Loading da lista
const loading = ref(false);
const skeleton = ref(false);
// Controla o produto dialogo
const productDialog = ref(false);
// Produto selecionado
const produto = ref({});
// Arquivo de foto selecionado
const imgProduto = ref([]);
const deleteDialog = ref(false);
const images = ref([])
const displayBasic = ref(false);
const corImageView = ref(false);
const nenhumRegistro = ref(false);
const corImage = ref([]);

const responsiveOptions = ref([
    {
        breakpoint: '991px',
        numVisible: 4
    },
    {
        breakpoint: '767px',
        numVisible: 3
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const produtoService = new ProdutoService();
const produtoCorService = new ProdutoCorService();
const corService = new CorService();
const tamanhoService = new TamanhoService();

const load = async (options) => {
  loading.value = true;

  if (!options) {
    options = {};
    nenhumRegistro.value = true;
  }

  const response = await produtoService.buscaTodos();
// console.log(response);
  produtos.value = response;
  produtos.value.forEach((item)=>{
    //if(item.default_image[0]){
      //item.default_image = item.default_image[0].image
    //}
  })
  loading.value = false;
  // totalRecords.value = response.totalRecords;

  cores.value = await corService.all();

  tamanhos.value = await tamanhoService.all();

}

const validaCampos = () => {
  for (let item of coresSelected.value) {
    if(!item.file && item.image == undefined){
      internalInstance.proxy.$toast.add({severity:'error', summary: 'Produto não salvo', detail: 'Alguma cor está sem imagem!', life: 4000});
      return false;
    }
  }
  return true;
}

const save = async () => {
  // if(!validaCampos()){
  //   return;
  // }

  internalInstance.proxy.$toast.add({severity:'info', summary: 'Produto', detail: 'Salvando...', life: 3000});

  productDialog.value = false;
  loading.value = true;

  if (tamanhosSelected.value) {
    produto.value.tamanhos = tamanhosSelected.value;
  }

  let response;

  if (produto.value.CODPRO) {
    produto.value.id = produto.value.CODPRO;
    response = await produtoService.update(produto.value);
  }
  else {
    response = await produtoService.store(produto.value);

    produto.value.CODPRO = response[0];
  }

  if(imgProduto.value.length > 0) {
    const imagemProdutoCompactada = await imageResize(imgProduto.value[0]);
    let img = await produtoService.upload(produto.value.CODPRO, imagemProdutoCompactada);
  }

  // Produto COR
  if (coresSelected.value.length) {
    const _coresToSent = coresSelected.value.filter(
      entry => entry.cor && !entry.created_at
    )

    if (_coresToSent.length) {
      internalInstance.proxy.$toast.add({severity:'info', summary: 'Cores', detail: 'Salvando...', life: 3000});

      let totalCores = _coresToSent.length-1;

      let responseCores;

      for (let i = 0; i <= totalCores; i++) {
        if(_coresToSent[i].file != undefined && _coresToSent[i].file != null){
          const imageResized = await imageResize(_coresToSent[i].file);
          //responseCores = await produtoCorService.store(produto.value.CODPRO, { CODCOR : _coresToSent[i].cor.CODCOR }, _coresToSent[i].file);
          responseCores = await produtoCorService.store(produto.value.CODPRO, { CODCOR : _coresToSent[i].cor.CODCOR }, imageResized);
        }else{
          responseCores = await produtoCorService.store(produto.value.CODPRO, { CODCOR : _coresToSent[i].cor.CODCOR });
        }
      }

      if (responseCores) {
        internalInstance.proxy.$toast.add({severity:'success', summary: 'Cores', detail: 'Cores salvas com sucesso', life: 3000});
      }
      else {
        internalInstance.proxy.$toast.add({severity:'error', summary: 'Cores', detail: 'Cores não salvas', life: 3000});
      }
    }
  }

  if (response) {
    internalInstance.proxy.$toast.add({severity:'success', summary: 'Produto', detail: 'Produto salvo com sucesso', life: 3000});
  }
  else {
    internalInstance.proxy.$toast.add({severity:'error', summary: 'Produto', detail: 'Produto não salvo', life: 3000});
  }
  
  await load();
}

const remove = async () => {
  deleteDialog.value = false;
  loading.value = true;
  const response = await produtoService.delete(produto.value.CODPRO);
  load();

  if (response) {
    internalInstance.proxy.$toast.add({severity:'success', summary: 'Exclusão de produto', detail: 'Produto removido com sucesso!', life: 3000});
  }  
}

const loadProduto = async (CodPro) => {
  skeleton.value = true;
  produto.value =  await produtoService.get(CodPro);
  // images.value = produto.value.images ?? [];
  if (produto.value.default_image) {
    images.value = produto.value.default_image.length ? produto.value.default_image : null;
  }
  imgProduto.value = [];

  if (produto.value.cores) {
    coresSelected.value = produto.value.cores;
  }

  if (produto.value.tamanhos) {
    tamanhosSelected.value = [];
    produto.value.tamanhos.map(
      entry => tamanhosSelected.value.push({
        CODTAM : entry.tamanho.CODTAM,
        DESTAM : entry.tamanho.DESTAM,
      })
    );
  }

  skeleton.value = false;
}

// Abre o modal para edição
const edit = async (_produto) => {
  productDialog.value = true;

  await loadProduto(_produto.CODPRO);
}

// Abre o modal para registro de um novo produto
const openNew = () => {
  produto.value = {};
  productDialog.value = true;
  imgProduto.value = [];
  images.value = null;

  coresSelected.value = [];
  tamanhosSelected.value = [];
}

const confirmDelete = (_produto) => {
  produto.value = _produto;
  deleteDialog.value = true;
}

// Fecha o modal de detalhes
const hideDialog = () => productDialog.value = false;

const addCor = () => coresSelected.value.push({ cor : null, });

const removeCor = async (index) => {
  const _cor = coresSelected.value[index];

  if (_cor.created_at) {
    internalInstance.proxy.$toast.add({severity:'info', summary: 'Cor', detail: 'Removendo cor', life: 3000});

    const responseDelete = await produtoCorService.delete(produto.value.CODPRO, _cor.id);
    
    await loadProduto(produto.value.CODPRO);

    if (responseDelete) {
      internalInstance.proxy.$toast.add({severity:'success', summary: 'Cor', detail: 'Cor removida', life: 3000});
    }
  }
  else {
    coresSelected.value.splice(index, 1);
  }
}

const showImage = (_cor) => {
  corImage.value = [];
  corImage.value.push(_cor.image);
  corImageView.value = true;
}

const removeImage = (_produto) => {
  produtoService.removeImage(_produto.CODPRO)
  .finally(() =>{
    loadProduto(_produto.CODPRO);
  });  
}

const onProdutoImagemSelect = (event, index = null) => {
  // console.log("onProdutoImagemSelect");
  // console.log(event);

  if (event.files) {
      if(index != null){
      coresSelected.value[index].file = event.files[0];
    }else{
      imgProduto.value.push(event.files[0]);
      // console.log(imgProduto.value);
    }
  }
}

const onProdutoImagemRemoved = (event, index = null) => {
  // console.log("onProdutoImagemRemoved");
  // console.log(event);
  if(index != null){
    coresSelected.value[index].file = null;
  }else{
    imgProduto.value = null;
  }
}

const imageResize = async (file) => {
  const img = new Image();
  img.src = file.objectURL;

  return await readAndCompressImage(
    file, 
    {
      quality: 1,
      width: img.width * .1,
      height: img.height *.1
    }
  );
}

onMounted(() => {
  load();
})

</script>

<template>
  <Toast />

  <div class="grid">
		<div class="col-12">
			<div class="card">
        <h5>Produtos</h5>

        <Toolbar class="mb-4">
          <template v-slot:start>
            <div class="my-2">
              <Button label="Novo" icon="pi pi-plus" class="p-button-success mr-2" @click="openNew" />
            </div>
          </template>
        </Toolbar>

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
        <DataView :value="produtos" paginator :rows="10" v-if="!loading">
          <template #empty v-if="nenhumRegistro">
            <div>
                <Message severity="info">Nenhum produto encontrado</Message>
            </div>
          </template>
          <template #list="slotProps">
            <div class="col-12">
                <div class="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                  <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="`${slotProps.data.default_image}`" :alt="slotProps.data.DESPRO" v-if="slotProps.data.default_image" style="max-height : 200px" />
                  <img class="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" :src="'images/no-photo.png'" v-if="!slotProps.data.default_image" />
                  <div class="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div class="flex flex-column align-items-center sm:align-items-start gap-3">
                      <div class="text-2xl font-bold text-900">{{ slotProps.data.DESPRO }}</div>
                      <div class="flex align-items-center gap-3">
                        <span class="flex align-items-center gap-2">
                          <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="edit(slotProps.data)" />
                          <Button icon="pi pi-trash" class="p-button-rounded p-button-warning mt-2" @click="confirmDelete(slotProps.data)" />
                        </span>
                      </div>
                    </div>
                    <div class="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <span class="text-2xl font-semibold" v-if="slotProps.data.VALPRO">R$ {{ moneyFormat(slotProps.data.VALPRO) }}</span>
                    </div>
                  </div>
                </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="productDialog" :style="{width: '70%'}" header="Detalhes do Produto" :modal="true" class="p-fluid">
    <div v-if="skeleton">
      <Skeleton class="mb-2"></Skeleton>
      <Skeleton width="10rem" class="mb-2"></Skeleton>
      <Skeleton width="5rem" class="mb-2"></Skeleton>
      <Skeleton height="2rem" class="mb-2"></Skeleton>
      <Skeleton width="10rem" height="4rem"></Skeleton>
    </div>

    <div v-else>
      <div class="formgrid grid">
        <div class="field col-12 md:col-12">
          <label for="name">Descrição</label>
          <InputText v-model.trim="produto.DESPRO" required="true" autofocus :class="{'p-invalid': submitted && !entidade.NOMENT}" />
        </div>
        <div class="field col-12 md:col-12">
          <label for="name">Descrição Detalhada</label>
          <Textarea v-model="produto.DESDETPRO" rows="5" cols="30" />
        </div>
        <div class="field sm:col-12 md:col-3 lg:col-3">
          <label for="name">Valor:</label>
          <InputCurrency v-model="produto.VALPRO" />
        </div>
        <div class="field sm:col-12 md:col-9 lg:col-9">
          <label for="name">Tamanhos:</label>
          <MultiSelect v-model="tamanhosSelected" display="chip" :options="tamanhos" optionLabel="DESTAM" placeholder="Selecione" />
        </div>
        <div class="field col-12 md:col-8 lg:col-6">
          <label for="name">Imagem base</label>
          <Button label="Visualizar imagem" icon="pi pi-image px-auto" class="p-button-info justify-content-center" v-if="produto.image" @click="showImage(produto)"  /> 
          <Button label="Remover imagem" icon="pi pi-trash px-auto" class="p-button-danger justify-content-center" v-if="produto.image" @click="removeImage(produto)"  /> 

          <FileUpload 
            name="foto" 
            @select="$event => onProdutoImagemSelect($event)"
            @remove="$event => onProdutoImagemRemoved($event)"
            @clear="$event => onProdutoImagemRemoved($event)"
            :multiple="FALSE" 
            accept="image/*" 
            chooseLabel="Selecionar"
            cancelLabel="Cancelar"
            :showUploadButton="false" 
            :customUpload="true"
            v-if="!produto.image"
            />
        </div>
      </div>
      <Divider />
      <h4 class="pl-1">Cores</h4>
      <Divider />
      <div class="formgrid grid">
        <div class="col-12">
          <Card v-for="(item, index) in coresSelected" :key="index" :id="index">
            <template #content>
              <div class="formgrid grid">
                <div class="field md:col-4">
                  <label for="name">Cor</label>
                  <Dropdown   
                    v-model="coresSelected[index].cor"
                    :options="cores" 
                    optionLabel="DESCOR" 
                    placeholder="Selecione" 
                    :showClear="true" 
                    emptyFilterMessage="Nenhum registro encontrado"
                  >
                    <template #value="slotProps">
                      <div v-if="slotProps.value">
                        <span :class="'product-badge status-' + slotProps.value.CODCOR">{{ slotProps.value.DESCOR }}</span>
                      </div>
                      <span v-else>
                        {{slotProps.placeholder}}
                      </span>
                    </template>
                  </Dropdown>   
                </div>
                <div class="field md:col-8">
                  <label for="name">Imagem</label>
                  <Button label="Visualizar imagem" icon="pi pi-image px-auto" class="p-button-info justify-content-center" v-if="item.image" @click="showImage(item)"  /> 

                  <FileUpload 
                    name="foto" 
                    @select="$event => onProdutoImagemSelect($event, index)"
                    @remove="$event => onProdutoImagemRemoved($event, index)"
                    @clear="$event => onProdutoImagemRemoved($event, index)"
                    :multiple="FALSE" 
                    accept="image/*" 
                    chooseLabel="Selecionar"
                    cancelLabel="Cancelar"                    
                    :showUploadButton="false" 
                    :customUpload="true"
                    v-if="!item.image"
                    />
                </div>
              </div>
              <div class="formgrid grid">
                <div class="field md:col-2">
                  <Button icon="pi pi-trash px-auto" class="p-button-danger justify-content-center" @click="removeCor(index)" /> 
                </div>
              </div>
            </template>
          </Card>
          <div class="field md:col-3">
            <Button label="Adicionar Cor" icon="pi pi-plus px-auto" class="p-button-primary justify-content-center" @click="addCor" />
          </div>
        </div>
      </div>
      <div class="field col-4">
        <!-- <Button label="Visualizar imagens" icon="pi pi-images" @click="displayBasic = true;" class="p-button-primary" v-if="produto.images" /> -->
      </div>
      <div class="field col-4">
      </div>
    </div>
    
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
      <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="save" />
    </template>			
  </Dialog>
  <Dialog v-model:visible="deleteDialog" modal header="Exclusão de produto" :style="{ width: '50vw' }">
    <p>
      Confirma a exclusão do produto <strong>{{ produto.DESPRO }}</strong>?
    </p>
    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-info" @click="deleteDialog.value = false" text />
      <Button label="Confirmar" icon="pi pi-check" class="p-button-danger" @click="remove" autofocus />
    </template>
  </Dialog>
  
  <Galleria v-model:visible="corImageView" :value="corImage" :responsiveOptions="responsiveOptions" :numVisible="corImage" containerStyle="max-width: 50%" :circular="true" :fullScreen="true" :showItemNavigators="true" :showThumbnails="false">
    <template #item="slotProps">
      <img :src="slotProps.item" style="width: 100%; display: block" />
    </template>
    <template #thumbnail="slotProps">
      <img :src="slotProps.item"  style="max-width: 100px ;display: block" />
    </template>
  </Galleria>
</template>