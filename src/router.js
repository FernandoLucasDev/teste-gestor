import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import EventBus from './AppEventBus';
import LoginService from './service/LoginService';

const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('./components/Dashboard.vue')
            },
            
            {
                path: '/profile',
                name: 'profile',
                component: () => import('./pages/Profile.vue')
            },
            {
                path: '/theme',
                name: 'theme',
                component: () => import('./pages/Theme.vue')
            },
            {
                path: '/administracao',
                children:[
                    {
                        path: '/administracao/fmtad02',
                        component: () => import('./pages/administracao/manutencao/usuario/Index.vue')
                    },
                
                    {
                        path: '/administracao/fmtad02/novo',
                        component: () => import('./pages/administracao/manutencao/usuario/FormUsuario.vue')
                    },
                    {
                        path: '/administracao/fmtad02/:id',
                        component: () => import('./pages/administracao/manutencao/usuario/FormUsuario.vue')
                    },
                    {
                        path: '/administracao/fmtad03',
                        component: () => import('./pages/administracao/manutencao/tipo-tarefa/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad03/novo',
                        component: () => import('./pages/administracao/manutencao/tipo-tarefa/FormTipoTarefa.vue')
                    },
                    {
                        path: '/administracao/fmtad03/alterar/:id',
                        component: () => import('./pages/administracao/manutencao/tipo-tarefa/FormTipoTarefa.vue')
                    },
                    {
                        path: '/administracao/fmtad01',
                        component: () => import('./pages/administracao/manutencao/grupo-usuario/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad05',
                        component: () => import('./pages/administracao/manutencao/tarefa/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad05/novo',
                        component: () => import('./pages/administracao/manutencao/tarefa/FormTarefa.vue')
                    },
                    {
                        path: '/administracao/fmtad06',
                        component: () => import('./pages/administracao/manutencao/permissao/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad23',
                        component: () => import('./pages/administracao/manutencao/automatizacao/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad04',
                        component: () => import('./pages/administracao/manutencao/sistema/Index.vue')
                    },
                    {
                        path: '/administracao/fmtad04/novo',
                        component: () => import('./pages/administracao/manutencao/sistema/FormSistema.vue')
                    },
                    {
                        path: '/administracao/fmtad04/:id',
                        component: () => import('./pages/administracao/manutencao/sistema/FormSistema.vue')
                    },
                ],
            },
            {
                 path: '/comercial',
                 children: [
                    {
                        path: '/comercial/fdgco12',
                        component: () => import('./pages/comercial/PedidoEcommerce/Index.vue')
                    },                    
                    {
                        path: '/comercial/pedido-ecommerce/confirm',
                        component: () => import('./pages/comercial/PedidoEcommerce/Confirmacao.vue')
                    }, 
                    {
                        path: '/comercial/pedido-ecommerce/orders',
                        component: () => import('./pages/comercial/PedidoEcommerce/Pedidos.vue')
                    }, 
                    {
                        path: '/administracao/fmtad06',
                        component: () => import('./pages/administracao/manutencao/permissao/Index.vue')
                    },                               
                ],
            },
            {
                 path: '/comercial',
                 children: [
                    {
                        path: '/comercial/fdgco12',
                        component: () => import('./pages/comercial/PedidoEcommerce/Index.vue')
                    },                    
                    {
                        path: '/comercial/pedido-ecommerce/confirm',
                        component: () => import('./pages/comercial/PedidoEcommerce/Confirmacao.vue')
                    }, 
                    {
                        path: '/comercial/pedido-ecommerce/orders',
                        component: () => import('./pages/comercial/PedidoEcommerce/Pedidos.vue')
                    }, 
                    {
                        path: '/comercial/pedido-ecommerce/order/:id',
                        component: () => import('./pages/comercial/PedidoEcommerce/Pedido.vue')
                    }, 
                 ],
            },
            {
                path: '/logistica',
                children: [
                    {
                        path: '/logistica/fmtlg03',
                        component: () => import('./pages/logistica/manutencao/tipo-veiculo/Index.vue')
                    },
                    {
                        path: '/logistica/fmtlg03/novo',
                        component: () => import('./pages/logistica/manutencao/tipo-veiculo/FormTipoVeiculo.vue')
                    },
                    {
                        path: '/logistica/fmtlg03/alterar/:id',
                        component: () => import('./pages/logistica/manutencao/tipo-veiculo/FormTipoVeiculo.vue')
                    },
                    
                ]
            },
            {
                path: '/geral',
                //component: () => import('./components/MenuDemo.vue'),
                children: [
                    {
                        path: '/geral/fmtgr01',
                        component: () => import('./pages/geral/manutencao/situacao/Index.vue')
                    },
                    {
                        path: '/geral/fmtgr03',
                        component: () => import('./pages/geral/manutencao/parametro/Index.vue')
                    },
                    {
                        path: '/geral/fmtgr04',
                        component: () => import('./pages/geral/Entidade.vue')
                    },                    
                    {
                        path: '/geral/fmtgr06',
                        component: () => import('./pages/geral/TipoEntidade.vue')
                    },                    
                    {
                        path: '/geral/fmtgr42',
                        component: () => import('./pages/geral/manutencao/corretor/Index.vue')
                    },                    
                    {
                        path: '/geral/fmtgr12',
                        component: () => import('./pages/geral/manutencao/grau-parentesco/Index.vue')
                    },                    
                    {
                        path: '/geral/fmtgr12/alterar/:id',
                        component: () => import('./pages/geral/manutencao/grau-parentesco/Index.vue')
                    },                    
                    {
                        path: '/geral/fmtgr13',
                        component: () => import('./pages/geral/EstadoCivil.vue')
                    },
                    {
                        path: '/geral/fmtgr14',
                        component: () => import('./pages/geral/manutencao/grau-instrucao/Index.vue')
                    },
                    {
                        path: '/geral/fmtgr26',
                        component: () => import('./pages/geral/manutencao/tipo-endereco/Index.vue')
                    },                    
                    {
                        path: '/geral/fmtgr21',
                        component: () => import('./pages/geral/manutencao/secao-cnae/Index.vue')
                    },
                    {
                        path: '/geral/fmtgr29',
                        component: () => import('./pages/geral/Idioma.vue')
                    },
                    {
                        path: '/geral/fmtgr30',
                        component: () => import('./pages/geral/manutencao/traducao/Index.vue')
                    },                    
                    {
                        path: '/geral/fmtgr05',
                        component: () => import('./pages/geral/GrupoEntidade.vue')
                    },                    
                    {
                        path: '/geral/fmtgr28',
                        component: () => import('./pages/geral/SubGrupoEntidade.vue')
                    },
                    {
                        path: '/geral/fmtgr41',
                        component: () => import('./pages/geral/manutencao/praca/Index.vue')
                    },
                    {
                        path: '/estoque/fmtes01',
                        component: () => import('./pages/estoque/manutencao/tamanho/Index.vue')
                    },
                    {
                        path: '/estoque/fmtes01/novo',
                        component: () => import('./pages/estoque/manutencao/tamanho/FormTamanho.vue')
                    },
                    {
                        path: '/estoque/fmtes01/alterar/:id',
                        component: () => import('./pages/estoque/manutencao/tamanho/FormTamanho.vue')
                    },
                    {
                        path: '/estoque/fmtes21',
                        component: () => import('./pages/estoque/manutencao/modelo/Index.vue')
                    },
                    {
                        path: '/estoque/fmtes07',
                        component: () => import('./pages/estoque/Marca.vue')
                    },    
                    {
                        path: '/enderecamento/fmten07',
                        component: () => import('./pages/enderecamento/MacroRegiao.vue')
                    },    
                    {
                        path: '/enderecamento/fmten01',
                        component: () => import('./pages/enderecamento/Estado.vue')
                    },     
                    {
                        path: '/financeiro/fmtfi06',
                        component: () => import('./pages/financeiro/Moeda.vue')
                    },
                    {
                        path: '/logistica/fmtlg06',
                        component: () => import('./pages/logistica/TipoCombustivel.vue')
                    },      
                    {
                        path: '/geral/fmtgr20',
                        component: () => import('./pages/geral/Porte.vue')
                    },
                    {
                        path: '/financeiro/fmtfi01',
                        component: () => import('./pages/financeiro/Banco.vue')
                    },   
                    {
                        path: '/financeiro/fmtfi02',
                        component: () => import('./pages/financeiro/manutencao/tipo-despesa/Index.vue')
                    },   
                    {
                        path: '/recursos-humanos/fmtrh01',
                        component: () => import('./pages/rh/Cbo.vue')
                    }, 
                    {
                        path: '/recursos-humanos/fmtrh10',
                        component: () => import('./pages/rh/TipoBeneficio.vue')
                    },   
                    {
                        path: '/eleicoes/fmtel01',
                        component: () => import('./pages/eleicoes/Eleicao.vue')
                    }, 
                    {
                        path: '/icontribui/fmtic17',
                        component: () => import('./pages/icontribui/manutencao/mandato/Index.vue')
                    }, 
                    {
                        path: '/icontribui/fmtic18',
                        component: () => import('./pages/icontribui/Hierarquia.vue')
                    }, 
                    {
                        path: '/icontribui/fmtic21',
                        component: () => import('./pages/geral/manutencao/motivo/Index.vue')
                    }, 
                     
                    {
                        path: '/icontribui/fmtic29',
                        component: () => import('./pages/icontribui/GrupoConvenio.vue')
                    },
                    {
                        path: '/recursos-humanos/fmtrh04',
                        component: () => import('./pages/rh/Evento.vue')
                    }, 
                    {
                        path: '/enderecamento/fmten04',
                        component: () => import('./pages/enderecamento/TipoLogradouro.vue')
                    },  
                    {
                        path: '/recursos-humanos/fmtrh03',
                        component: () => import('./pages/rh/Funcionario.vue')
                    },  
                    {
                        path: '/logistica/fmtlg01',
                        component: () => import('./pages/logistica/Veiculo.vue')
                    },    
                    {
                        path: '/financeiro/fmtfi07',
                        component: () => import('./pages/financeiro/TipoDocumento.vue')
                    }, 
                    {
                        path: '/financeiro/fmtfi03',
                        component: () => import('./pages/financeiro/CondicaoPagamento.vue')
                    },
                    {
                        path: '/financeiro/fmtfi13',
                        component: () => import('./pages/financeiro/manutencao/forma-pagamento/Index.vue')
                    },
                    {
                        path: '/financeiro/fmtfi05',
                        component: () => import('./pages/financeiro/manutencao/conta/Index.vue')
                    },
                    {
                        path: '/financeiro/fmtfi15',
                        component: () => import('./pages/financeiro/manutencao/parcelamento-entrega/Index.vue')
                    },
                    {
                        path: '/estoque/fmtes22',
                        component: () => import('./pages/estoque/manutencao/cor/Index.vue')
                    },
                ],
            },          
            {
                path: '/icontribui',
                children: [
                    {
                        path: '/icontribui/fmtic01',
                        component: () => import('./pages/icontribui/manutencao/tipo-dissidio/Index.vue')
                    },
                    {
                        path: '/icontribui/fctic02',
                        component: () => import('./pages/icontribui/consulta/consulta-contribuicao/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic02',
                        component: () => import('./pages/icontribui/manutencao/segmento/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic03',
                        component: () => import('./pages/icontribui/manutencao/referencia/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic05',
                        component: () => import('./pages/icontribui/manutencao/definicao-de-contribuicao/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic06',
                        component: () => import('./pages/icontribui/manutencao/convenio/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic09',
                        component: () => import('./pages/icontribui/manutencao/premio/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic10',
                        component: () => import('./pages/icontribui/manutencao/nosso-numero/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic07',
                        component: () => import('./pages/icontribui/manutencao/apolice/Index.vue')
                    },
                    {
                        path: '/icontribui/fpric07',
                        component: () => import('./pages/icontribui/processamento/associacao/Index.vue')
                    },
                    {
                        path: '/icontribui/fpric14',
                        component: () => import('./pages/icontribui/processamento/cancela-contribuicao/Index.vue')
                    },
                    {
                        path: '/icontribui/fpric16',
                        component: () => import('./pages/icontribui/ProcessamentoEmpregado/Index.vue')
                    },
                    {
                        path: '/icontribui/fpric17',
                        component: () => import('./pages/icontribui/processamento/envia-contribuicao-email/Index.vue')
                    },
                    // {
                    //     path: '/icontribui/fmtic18',
                    //     component: () => import('./pages/icontribui/manutencao/hierarquia/Index.vue')
                    // },
                    {
                        path: '/icontribui/fmtic35',
                        component: () => import('./pages/icontribui/manutencao/grupo-def-contribuicao/Index.vue')
                    },
                    {
                        path: '/icontribui/fmtic36',
                        component: () => import('./pages/icontribui/manutencao/beneficio/Index.vue')
                    },
                    {
                        path: '/icontribui/fpric02',
                        component: () => import('./pages/icontribui/processamento/gera-contribuicao/Index.vue')
                    },          
                    {
                        path: '/icontribui/fpric12',
                        component: () => import('./pages/icontribui/processamento/rescisao/Index.vue')
                    },          
                    {
                        path: '/icontribui/ric150',
                        component: () => import('./pages/icontribui/relatorio/ResumoMensalBeneficios.vue')
                    },          
                ],
            },          
            {
                path: '/estoque',
                children: [
                    {
                        path: '/estoque/fmtes08',
                        component: () => import('./pages/estoque/Produto/Index.vue')
                    },                    
                ],
            },          
            {
                path: '/mudanca',
                children: [
                    {
                        path: '/mudanca/fdgmu02',
                        component: () => import('./pages/mudanca/Telemarketing/Index.vue')
                    },                    
                    {
                        path: '/mudanca/fmtmu02',
                        component: () => import('./pages/mudanca/HorarioVistoria.vue')
                    },                    
                    {
                        path: '/mudanca/fmtmu05',
                        component: () => import('./pages/mudanca/manutencao/campo-documento/Index.vue')
                    },                    
                    {
                        path: '/mudanca/fmtmu03',
                        component: () => import('./pages/mudanca/manutencao/documento/Index.vue')
                    },                    
                    {
                        path: '/mudanca/fmtmu01',
                        component: () => import('./pages/mudanca/manutencao/mudanca/Index.vue')
                    },                    
                    {
                        path: '/mudanca/fmtmu04',
                        component: () => import('./pages/mudanca/manutencao/TipoDocumento/Index.vue')
                    },                    
                ],
            }, 

            {
                path: '/rede-seguro-facil',
                children:[
                    {
                        path:'/rede-seguro-facil/fmtse01',
                        component: () => import('./pages/rede-seguro-facil/manutencao/nivel-educacao/Index.vue')
                    }
                ]
            }         
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('./pages/Login.vue')
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('./pages/LandingDemo.vue')
    },
    {
        path: '/error',
        name: 'error',
        component: () => import('./pages/Error.vue')
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: () => import('./pages/NotFound.vue')
    },
    {
        path: '/access',
        name: 'access',
        component: () => import('./pages/Access.vue')
    },
    {
        path: '/reset-password/:token',
        component: () => import('./pages/PasswordReset.vue'),
        meta : { requiresAuth : false }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('./pages/NotFound.vue') },

];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to, from) => {
    if (to.path == "/login") {
        return true;
    }

    const loginService = new LoginService();

    if (typeof(to.meta.requiresAuth) != 'undefined') {
        if (!to.meta.requiresAuth) {
            return true;
        }
    }
    else {
        const result = await loginService.check();

        if (result) {
            const user = result[2];
            if (user) {
                if (user.theme) {
                    EventBus.emit('theme-change', { theme: user.theme, dark: false });
                }                        
            }
            return true;
        }
        else {
            console.log("Not logged");
            return { path: '/login' };
        }
    }
})

export default router;
