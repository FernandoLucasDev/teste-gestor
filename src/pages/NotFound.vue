<template>
    <div class="surface-0 flex align-items-center justify-content-center overflow-hidden">
        <div class="grid justify-content-center p-2 lg:p-0" style="min-width:80%">
            <div class="col-12 mt-5 xl:mt-0 text-center">
                <img src="images/blockchain.png" alt="Sakai logo" class="mb-5" style="height:60px;">
            </div>
            <div class="col-12 xl:col-6" style="border-radius:56px; padding:0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%);">
                <div class="flex justify-content-center h-full w-full m-0 py-7 px-4" style="border-radius:53px; background: linear-gradient(180deg, var(--surface-50) 38.9%, var(--surface-0));">
                    <div class="grid flex-column align-items-center">
                        <span class="text-blue-500 font-bold text-3xl">404</span>
                        <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Esta página não existe</h1>
                        <span class="text-gray-600">Recurso não disponível.</span>
                        <div class="col-12 flex align-items-center py-5 mt-6 border-300 border-bottom-1">
                            <div class="flex justify-content-center align-items-center bg-cyan-400 border-round" style="height:3.5rem; width:3.5rem;">
                                <i class="pi pi-fw pi-table text-50 text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <router-link to="/">
                                    <p class="text-900 lg:text-xl font-medium mb-0">Tentei entrar direto</p>
                                </router-link>
                                <span class="text-gray-600 lg:text-xl">Tente sempre usar os links do menu.</span>
                            </div>
                        </div>
                        <div class="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                            <div class="flex justify-content-center align-items-center bg-orange-400 border-round" style="height:3.5rem; width:3.5rem;">
                                <i class="pi pi-fw pi-question-circle text-50 text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <router-link to="/">
                                    <p class="text-900 lg:text-xl font-medium mb-0">Não sei como voltar</p>
                                </router-link>
                                <span class="text-gray-600 lg:text-xl">Clique aqui para voltar.</span>
                            </div>
                        </div>
                        <div class="col-12 flex align-items-center py-5 border-300 border-bottom-1">
                            <div class="flex justify-content-center align-items-center bg-indigo-400 border-round" style="height:3.5rem; width:3.5rem;">
                                <i class="pi pi-fw pi-unlock text-50 text-2xl"></i>
                            </div>
                            <div class="ml-4">
                                <router-link to="/">
                                    <p class="text-900 lg:text-xl font-medium mb-0">Você não tem permissão</p>
                                </router-link>
                                <span class="text-gray-600 lg:text-xl">A página ou recurso não está disponível para você</span>
                            </div>
                        </div>
                        <div class="col-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align:center;"></i>
                            <router-link to="/" class="text-blue-500">Go to Dashboard</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>