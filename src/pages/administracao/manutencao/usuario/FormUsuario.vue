<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from "primevue/usetoast";

import GrupoUsuarioService from '../../../../service/administracao/GrupoUsuarioService';
import UsuarioService from '../../../../service/administracao/UsuarioService';

import { mapDropdownSearch } from '../../../../defaults/map';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const usuarioService = new UsuarioService();
const grupoUsuarioService = new GrupoUsuarioService();

const id = ref();
const usuario = ref({});
const email = ref();
const loading = ref(false);
const listGruposUsuario = ref([]);
const optionsSimNao =  ref(
  [
    {label : 'Sim', value : "S"},
    {label : 'Não', value : "N"},
  ]);

const formsubmit = (event) => {
  if (!email.value && !id.value) {
    toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe um e-mail', life: 3000 });
    return false;
  }
  if (!usuario.value.SENUSU && !id.value) {
    toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe uma senha', life: 3000 });
    return false;
  }

  if (!usuario.value.NOMUSU) {
    toast.add({ severity:'warn', summary: 'Dados', detail: 'Informe um nome', life: 3000 });
    return false;
  }

  return true;
}

const save = async () => {
  if (!formsubmit()) {
    return;
  }

  loading.value = true;

  if (usuario.value.CODGRPUSU) {
    usuario.value.CODGRPUSU = usuario.value.CODGRPUSU.value;
  }

  if (usuario.value.ALTSENUSU) {
    usuario.value.ALTSENUSU = usuario.value.ALTSENUSU.value;
  }

  if (usuario.value.ALTCOMUSU) {
    usuario.value.ALTCOMUSU = usuario.value.ALTCOMUSU.value;
  }

  if (usuario.value.ATIUSU) {
    usuario.value.ATIUSU = usuario.value.ATIUSU ? "S" : "N";
  }

  usuario.value.email = email;

  let response;  
  if (id.value) {
    response = await usuarioService.update(usuario.value);
  }
  else{
    response = await usuarioService.store(usuario.value);    
  }

  if (response) {
    toast.add({ severity:'success', summary: 'Sucesso', detail: 'Usuário salvo com sucesso', life: 3000 });

    setTimeout(() => back(), 2000);
  }
  else {
    toast.add({severity:'error', summary: 'Erro', detail: 'Usuário não salvo', life: 3000});
    loading.value = false;
  }
};

const back = () => router.push({ path : '/administracao/fmtad02' });

onMounted(async () => {
  loading.value = true;

  id.value = route.params.id;

  const responseGrupo = await grupoUsuarioService.all();
  listGruposUsuario.value = [];
  responseGrupo.map(
    (entry) => listGruposUsuario.value.push({label : entry.DESGRPUSU, value : entry.CODGRPUSU})
  );

  if (id.value) {
    const response = await usuarioService.get(id.value)
    usuario.value = response;

    if (usuario.value.ATIUSU == "S") {
      usuario.value.ATIUSU = true;
    }

    if (usuario.value.CODGRPUSU) {
      usuario.value.CODGRPUSU = mapDropdownSearch(listGruposUsuario.value, usuario.value.CODGRPUSU);
    }

    if (usuario.value.email) {
      email.value = usuario.value.email;
    }
  }

  if (usuario.value.CODUSU == null){
    usuario.value.ATIUSU = true;
  }

  loading.value = false;
});
</script>
<template>
  <Toast />

  <div v-if="loading">
    <ProgressSpinner style="height: 50px;" />
  </div>

  <div class="p-fluid" v-else>
    <div class="grid">
      <div class="col-12">
        <div class="card">
          <form autocomplete="off" @submit.prevent="formsubmit">
            <input autocomplete="false" name="hidden" type="text" style="display:none;">
            <div class="formgrid grid">
              <div class="field md:col-12 col-12">
                  <label for="name">Nome</label>
                  <InputText v-model="usuario.NOMUSU" maxlength="30" />
              </div>
              <div class="field md:col-12 col-12">
                  <label for="name">E-mail</label>
                  <InputText v-model="email" maxlength="255" />
              </div>
              <div class="field col-12 md:col-5">
                <label for="estado">Grupo</label>
                <Dropdown id="estado" v-model="usuario.CODGRPUSU" :options="listGruposUsuario" optionLabel="label" placeholder="Selecione" @change="onChange" >
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
              <div class="field md:col-4 col-12" v-if="!id">
                <label for="name">Senha</label>
                <InputText
                  inputId="cadastro_senha"
                  name="cadastro_senha"
                  v-model="usuario.SENUSU"
                  aria-autocomplete="off"
                  maxlength="200" />
              </div>
              <div class="field md:col-3 col-12">
                <label for="altera_senha">Altera Senha</label>
                <Dropdown id="altera_senha" v-model="usuario.ALTSENUSU" :options="optionsSimNao" optionLabel="label" placeholder="Selecione" @change="onChange" >
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
              <div class="flex flex-column gap-3 md:col-3 col-12 pt-0">
                  <label for="username">Usuário ativo</label>
                  <Checkbox v-model="usuario.ATIUSU" :binary="true"/>
              </div>
            </div>
            <div class="formgrid grid">
              <div class="field col-6 md:col-2 float-right">
                <Button label="Voltar" class="p-button-info" style="margin-top: 15%;" @click="back" />
              </div>

              <div class="field col-6 md:col-2">
                <Button label="Salvar" class="p-button-success" icon="pi pi-check" style="margin-top: 15%;" @click="save" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>