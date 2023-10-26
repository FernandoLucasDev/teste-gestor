<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "primevue/usetoast";

import LoginService from "../service/LoginService";

const router = useRouter();
const route = useRoute();
const toast = useToast();

const loginService = new LoginService();

const email = ref();
const senha = ref();
const senhaConfirm = ref();
const loading = ref(false);

const resetPassword = () => {
    if (senha.value != senhaConfirm.value) {
        toast.add({severity:'warn', summary: 'Alteração de senha', detail: 'Senhas não conferem', life: 3000});
        return;
    }

    toast.add({severity:'info', summary: 'Alteração de senha', detail: 'Salvando nova senha...', life: 3000});

    loginService.updatePassword({
        email : email.value, 
        password : senha.value, 
        password_confirmation: senha.value, 
        token : route.params.token
    })
    .then(
        response => {
            if (response) {
                if (response[0] == "passwords.reset") {
                    toast.add({severity:'success', summary: 'Alteração de senha', detail: 'Senha alterada com sucesso', life: 3000});

                    setTimeout(() => router.push({ path : '/login' }), 3500);
                }
                else if (response[0] == "passwords.user") {
                    toast.add({severity:'warn', summary: 'Alteração de senha', detail: 'Usuário não encontrado', life: 3000});
                }
                else if (response[0] == "passwords.token") {
                    toast.add({severity:'warn', summary: 'Alteração de senha', detail: 'Link de recuperação expirado.', life: 3000});
                }
                
                else {
                    toast.add({severity:'info', summary: 'Alteração de senha', detail: 'Ocorreu um erro desconhecido', life: 3000});
                }
            }
            else {
                if (loginService.api.result.response.status == 422) {
                    if (loginService.api.result.response.data.message) {
                        toast.add({severity:'warn', summary: 'Alteração de senha', detail: loginService.api.result.response.data.message, life: 3000});
                    }

                }
            }
        }
    );
}

onMounted(() => {
    loading.value = true;
    loginService.getEmail({ token : route.params.token})
    .then(response => email.value = response[0])
    .finally(() => {
        loading.value = false
    });
});

</script>

<template>
    <Toast />
    <div v-if="loading">
        <div class="formgrid grid">
            <div class="col-12">
                <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
            </div>          
        </div>          
    </div>
    <div class="surface-0 flex align-items-center justify-content-center overflow-hidden h-full" v-else>
      <div class="grid justify-content-center p-2 lg:p-0 h-full" style="min-width:80%;">
          <div class="col-12 mt-5 xl:mt-0 text-center">
          </div>
          <div class="col-12 xl:col-6" style="height: 100%; border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%);">
              <div class="flex justify-content-center h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                  <div class="grid flex-column align-items-center">
                    <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Recuperação de senha</h1>

                    <div class="col-6 md:col-2"></div>  
                    <div class="col-6 md:col-8">
                        <div class="p-fluid">
                            <div class="formgrid grid">
                                <div class="field md:col-12">
                                    <h3>{{ email }}</h3>
                                </div>
                            </div>
                            <div class="formgrid grid">
                                <div class="field col-12 md:col-12">
                                    <label for="name">Nova senha:</label>
                                    <Password v-model="senha" toggleMask />
                                </div>
                            </div>
                            <div class="formgrid grid">
                                <div class="field col-12 md:col-12">
                                    <label for="name">Confirmação de senha:</label>
                                    <Password v-model="senhaConfirm" toggleMask />
                                </div>
                            </div>
                            <div class="formgrid grid">
                                <Button label="Alterar senha" severity="success" class="p-button-success" @click="resetPassword"/>
                            </div>
                        </div>
                    </div> 
                    <div class="col-6 md:col-2"></div>  
                      
                      <div class="col-12 mt-5 text-center">
                          <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align:center;"></i>
                          <router-link to="/" class="text-blue-500">Voltar para a home</router-link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<style>
body { height : 100% }
#app { height : 100% }
</style>