<template>
    <Toast />
    <div class="surface-0 flex align-items-center justify-content-center min-h-screen overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <!-- <img :src="'images/blockchain.png'" alt="Sakai logo" class="mb-5" style="height:60px;"> -->
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, var(--primary-color), rgba(33, 150, 243, 0) 30%);">
                <div class="h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Bem-vindo!</div>
                        <span class="text-600 font-medium">Autentique-se para continuar</span>
                    </div>
                
                    <div class="w-full md:w-10 mx-auto">
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" v-model="email" type="text" class="w-full mb-3" placeholder="Email" style="padding:1rem;" />
                
                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Senha</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" :feedback="false" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                
                        <div class="flex align-items-center justify-content-between mb-5" v-if="error">
                            <InlineMessage severity="error">Usuário ou senha incorretos!</InlineMessage>
                        </div>
                        <div class="flex align-items-center justify-content-between mb-5" v-if="warn">
                            <InlineMessage severity="warn">Preencha o e-mail e a senha</InlineMessage>
                        </div>
                        <div class="flex align-items-center justify-content-between mb-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" :binary="true" class="mr-2"></Checkbox>
                                <label for="rememberme1">Lembrar-me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)" @click="recoverPasswordDialog = true">Esqueceu a senha?</a>
                        </div>
                        <Button label="Entrar" class="w-full p-3 text-xl" @click="login()"> 
                            <ProgressSpinner style="height: 25px;" stroke-width="4" aria-label="Custom ProgressSpinner" animationDuration="1s" v-if="loading" />
                        </Button>

                        <div class="flex align-items-center mb-5" v-if="auth0Enabled">
                            <a class="font-medium no-underline ml-2 text-center cursor-pointer" style="color: var(--primary-color); margin-top:20px" @click="loginAuth0()">Entrada compartilhada</a>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Dialog v-model:visible="recoverPasswordDialog" :style="{width: '450px'}" header="Recuperação de senha" :modal="true">
        <div class="flex align-items-center justify-content-center">
            <div class="col-12">
                <div class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="name">E-mail:</label>
                            <InputText v-model="email" />
                        </div>
                    </div>
                </div>
            </div>     
        </div>
        <template #footer>
            <Button label="Fechar" icon="pi pi-times" class="p-button-text" @click="recoverPasswordDialog = false"/>
            <Button label="Enviar link de recuperação" icon="pi pi-check" class="p-button-text" severity="success" @click="confirmRecoverPassword" />
        </template>
    </Dialog>
</template>

<script>
import LoginMixin from "../mixins/Login";

export default {
    mixins : [LoginMixin],
    data() {
        return {
            email: '',
            password: '',
            checked: false,
            user: this.$auth0?.user,
            loading: false,
            error : false,
            warn : false,
            recoverPasswordDialog : false,
            auth0Enabled : false,
        }
    },
    created() {
        this.auth0Enabled = process.env.VUE_APP_AUTH0_ENABLED;
        this.loginStart();
	},
    computed: {
        logoColor() {
            if (this.$appState.darkTheme) return 'white';
            return 'dark';
        }
    },
    methods : {
        login() {
            this.error = false;
            this.warn = false;
            if(this.email == "" || this.password == ""){
                this.warn = true;
            }else{
                this.loading = true;
                this.loginSend(this.email, this.password).then((result) => {
                    if (result) {
                        this.loginCheck()
                        .then(() => this.goToApp());
                    }else{
                        this.error = true;
                        this.loading = false;
                    }
                }).catch(()=>{
                    this.loading = false;
                });
            }
        },
        goToApp() {
            this.$router.push({ path : "/"});
            //Este timeout é para que dê tempo da rota mudar sem que o loading pare
            setTimeout(() => {
                this.loading = false;
            }, 2000);
        },
        loginAuth0() {
           this.$auth0.loginWithRedirect();
        },
        confirmRecoverPassword() {
            this.recoverPasswordDialog = false;
            this.$toast.add({severity: 'info', summary: 'Recuperação de senha', detail: 'Enviando e-mail de recuperação de conta', life: 3000});

            this.passwordRecovery(this.email)
            .then(response => {
                console.log(response);

                if (response) {
                    if (response[0] == "passwords.sent") {
                        this.$toast.add({severity: 'success', summary: 'Recuperação de senha', detail: 'E-mail de recuperação enviado com sucesso!', life: 3000});
                    }
                    else if (response[0] == "passwords.throttled") {
                        this.$toast.add({severity: 'warn', summary: 'Recuperação de senha', detail: 'Aguarde para fazer uma nova solicitação!', life: 3000});
                    }
                    else if (response[0] == "passwords.user") {
                        this.$toast.add({severity: 'error', summary: 'Recuperação de senha', detail: 'E-mail não registrado!', life: 3000});
                    }
                    else {
                        this.$toast.add({severity: 'error', summary: 'Recuperação de senha', detail: 'Ocorreu um erro desconhecido!', life: 3000});
                    }
                }
            });
        }
    },
}
</script>

<style scoped>
.pi-eye {
    transform:scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform:scale(1.6);
    margin-right: 1rem;
}

.p-progress-circle{
    size: 5px;
}
</style>
<style>

@keyframes p-progress-spinner-color {
    from{
        stroke: #fff;
    }
    to{
        stroke: #fff;
    }
}
</style>