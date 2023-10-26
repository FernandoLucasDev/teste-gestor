<template>
    <div class="card">
        <TabView>
            <TabPanel header="Adm">
                <FormAdministracao ref="adm" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="CRM">
                <FormCrm ref="crm" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Financeiro">
                <FormFinanceiro ref="financeiro" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Comercial">
                <FormComercial ref="comercial" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Geral">
                <FormGeral ref="geral" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Icontribui">
                <FormIcontribui ref="icontribui" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Idioma">
                <FormIdioma ref="idiomaSelected" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Fiscal">
                <FormFiscal ref="fiscal" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="WsPub">
                <FormWspub ref="wspub" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="GS">
                <FormGs ref="gs" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Log">
                <FormLog ref="log" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Condomínio">
                <FormCondominio ref="condominio" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
            <TabPanel header="Layout">
                <FormLayout ref="layout" :editando="editando" :propParametro="parametro"/>
            </TabPanel>
        </TabView>
    </div>
</template>

<script>
import FormAdministracao from './FormAdministracao.vue';
import FormComercial from './FormComercial.vue';
import FormCondominio from './FormCondominio.vue';
import FormCrm from './FormCrm.vue';
import FormFinanceiro from './FormFinanceiro.vue';
import FormFiscal from './FormFiscal.vue';
import FormGeral from './FormGeral.vue';
import FormGs from './FormGs.vue';
import FormIcontribui from './FormIcontribui.vue';
import FormIdioma from './FormIdioma.vue';
import FormLog from './FormLog.vue';
import FormWspub from './FormWspub.vue';
import FormLayout from './FormLayout.vue';
import ParametroService from '../../../../service/geral/ParametroService';

export default {
    data() {
        return {
            parametroService: null,
            parametro: {
                // CODMOE: null,
                // CODCND: null,
                // CODTIPDOC: null,
                // CODCTA: null,
                // CODFPG: null,
                // CODTIPDES: null,
                // CODCENCUS: null,
                // VENBANPAR: null,
                // VALMINCONPAR: null,
                // DIAMOCVEN: null,
            },
            editando: true,
        };
    },
    created() {
        this.parametroService = new ParametroService();
        this.parametroService.all().then((response)=>{
            // console.log("aquiii", response);
            // response.length = 0;
            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.financeiro.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.crm.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.comercial.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.geral.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.icontribui.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.idiomaSelected.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.fiscal.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.wspub.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.gs.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.log.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.condominio.preencheDados(response);
            }

            if(response.length != 0){
                this.parametro = response;
                this.editando = true;
                this.$refs.layout.preencheDados(response);
            }
          })

    },
    // components: { FormFinanceiro, FormCrm, FormComercial, FormGeral, FormIcontribui, FormIdioma, FormFiscal, FormWspub, FormLog, FormCondominio, FormGs }
    components: {
        FormAdministracao, 
        FormCrm, 
        FormFinanceiro, 
        FormComercial, 
        FormIcontribui, 
        FormIdioma,
        FormFiscal, 
        FormWspub, 
        FormGs, 
        FormLog, 
        FormCondominio, 
        FormGeral,
        FormLayout
    }
}
</script>