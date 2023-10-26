<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from "primevue/usetoast";

import UsuarioService from "../service/administracao/UsuarioService";

const toast = useToast();

const usuarioService = new UsuarioService();

const user = ref();
const senha = ref();
const oldSenha = ref();
const userAuth0 = ref();
const loading = ref(false);
const updatePasswordDialog = ref(false);

const me = () => {
  loading.value = true;

  usuarioService.me()
  .then(
    response => 
    user.value = response
  )
  .finally(() => {
    loading.value = false;
  });
}

const connect = async () =>{
  await this.$auth0.loginWithPopup();      

  if (process.env.VUE_APP_AUTH0_ENABLED) {
    this.$auth0?.getAccessTokenSilently()
    .then(
      (response) => {
        if (this.$auth0.user) {
          userAuth0.value = this.$auth0.user;

          loading.value = true;

          /*
          connectAuth0(userAuth0.value.sub)
          .then((response) => {
            loading.value = false;
            if (response[0] == 1) {
              toast.add({severity:'success', summary: 'Sucesso', detail: "Integração realizada com sucesso!"});
            }
            else {
              toast.add({severity:'error', summary: 'Error', detail: "Ocorreu um erro na tentativa de integração"});
            }
          })
          .catch((e) => {
            toast.add({severity:'error', summary: 'Error', detail: "Ocorreu um erro na tentativa de integração"});
          });
          */
        }
      }
    );
  }
}

const allowUpdatePassword = () => {
  updatePasswordDialog.value = true;
  senha.value = "";
  oldSenha.value = "";
}

const confirmUpdatePassword = async () =>{
  loading.value = true;
  updatePasswordDialog.value = false;

  usuarioService.updatePassword({
    senha : senha.value,
    oldSenha : oldSenha.value
  })
  .then(response => {
    if (response) {
      toast.add({severity:'success', summary: 'Alteração de senha', detail: 'Senha alterada com sucesso', life: 3000});
    } 
    else {
      if (usuarioService.api.result.response.status == 401) {
        toast.add({severity:'warn', summary: 'Alteração de senha', detail: 'Senha atual incorreta', life: 3000});
      }

      else {
        toast.add({severity:'error', summary: 'Alteração de senha', detail: 'Ocorreu um erro', life: 3000});
      }
    }       
  })
  .catch((e) => {
    toast.add({severity:'error', summary: 'Alteração de senha', detail: 'Ocorreu um erro', life: 3000});
  })
  .finally(() => {
    loading.value = false
  });
}

onMounted(() => {
  me();
});
</script>

<template>
  <Toast />

	<div class="grid">
	  <div class="col-12">
      <div class="card">
        <div class="p-fluid" v-if="user">
          Perfil
          <h3>Nome: <i>{{ user.NOMUSU }}</i></h3>

          <div class="field col-12 md:col-6">
            <Button label="Alterar Senha" icon="pi pi-arrow-right-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="allowUpdatePassword" />
          </div>          
          
          <div class="formgrid grid" v-if="this.$root.user">
            <div class="col-3" v-if="!this.$root.user.AUTH0_TOKEN">
              <Button label="Integrar sistema" icon="pi pi-arrow-right-arrow-left" class="p-button-info" style="margin-top: 15%;" @click="connect" />
            </div>            
          </div>            
        </div>
        <div class="formgrid grid">
          <div class="col-3" v-if="loading">
              <ProgressSpinner style="height: 50px;" />
          </div>        
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="updatePasswordDialog" :style="{width: '450px'}" header="Alteração de senha" :modal="true">
    <div class="flex align-items-center justify-content-center">
      <div class="col-12">
        <div class="p-fluid">
          <div class="formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="name">Senha atual:</label>
              <Password v-model="oldSenha" toggleMask :feedback="false" />
            </div>
          </div>
          <div class="formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="name">Nova senha:</label>
              <Password v-model="senha" toggleMask />      
            </div>
          </div>
        </div>
      </div>      
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="updatePasswordDialog = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="confirmUpdatePassword" />
    </template>
  </Dialog>
</template>