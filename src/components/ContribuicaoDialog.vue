<script setup>
import { ref, defineProps, defineEmits, onMounted, onUpdated } from 'vue';
import moment from 'moment';

import { moneyFormat } from "@/mixins/Formatters";
import { cnpjMask } from "@/defaults/mask";

import ContribuicaoService from "@/service/icontribui/ContribuicaoService";

const emit = defineEmits(['hide']);

const contribuicaoService = new ContribuicaoService();

const props = defineProps({
  data : Object,
  visible : Boolean
});

const contribuicao = ref(props.data ?? []);
const show = ref(false);

const meses = ref({
  1 : "Janeiro",
  2 : "Fevereiro",
  3 : "Março",
  4 : "Abril",
  5 : "Maio",
  6 : "Junho",
  7 : "Julho",
  8 : "Agosto",
  9 : "Setembro",
  10 : "Outubro",
  11 : "Novembro",
  12 : "Dezembro",
});

const print = () => {
	window.open(contribuicaoService.api.getHost() + "contribuicao/pdf/" + contribuicao.value.ANOCNT + "/" + contribuicao.value.NUMCNT, '_blank');
}

const onHide = () => {
  emit("hide", true);
}

onMounted(() => {
  
})

onUpdated(() => {
  show.value = props.visible;
  contribuicao.value = props.data;
})

</script>

<template>
  <Dialog v-model:visible="show" modal header="Contribuição" :style="{ width: '50vw' }" @hide="onHide">
    <div class="field col-6 md:col-2" v-if="!contribuicao.DATCANCNT">
			<Chip label="Pago" style="background: green;" v-if="contribuicao.DATPAGCNT" />
			<Chip label="Aberta" style="background: orange;" v-else />
		</div>
		<div class="field col-6 md:col-2">
			<Chip label="Cancelada" style="background: red;" v-if="contribuicao.DATCANCNT" />
		</div> 

    <p><strong>{{ contribuicao.defcontrib ? contribuicao.defcontrib.DESDFC : "" }}</strong></p>
    
    <p><strong>Exercício:</strong> {{ contribuicao.ANOCNT }}</p>
    <p><strong>Número:</strong> {{ contribuicao.NUMCNT }}</p>
    <p><strong>Mês de Referência:</strong> {{ meses[contribuicao.MESCNT] }}</p>
    <p><strong>Valor:</strong> {{ moneyFormat(contribuicao.VALCNT) }}</p>
    <p>
			<span v-if="contribuicao.banco">
				<strong>Banco:</strong> {{ contribuicao.banco.NOMBAN }}
			</span>			
		</p>  
		
		<Accordion>
			<AccordionTab :header="contribuicao.entidade.NOMENT" v-if="contribuicao.entidade">
				<p><strong>Nome: </strong>{{ contribuicao.entidade.NOMENT }}</p>
				<p><strong>Documento: </strong>{{ cnpjMask(contribuicao.entidade.DOCENT) }}</p>
				<p><strong>Endereco: </strong>{{ contribuicao.entidade.DESTIPLOG }} {{ contribuicao.entidade.NOMLOG }}</p>
				<p><strong>Bairro: </strong>{{ contribuicao.entidade.DESBAI }}</p>
				<p><strong>Cidade: </strong>{{ contribuicao.entidade.DESCID }}</p>
				<p><strong>Estado: </strong>{{ contribuicao.entidade.SIGEST }}</p>
				<p><strong>CEP: </strong>{{ contribuicao.entidade.CEPENDENT }}</p>
			</AccordionTab>
			<AccordionTab header="Pagamento" v-if="contribuicao.DATPAGCNT">
				<p><strong>Data: </strong>{{ moment(contribuicao.DATPAGCNT).format('DD/MM/YYYY') }}</p>
				<p><strong>Valor: </strong>{{ moneyFormat(contribuicao.VALPAGCNT) }}</p>
				<p>
					<span v-if="contribuicao.banco_pagamento">
						<strong>Banco: </strong>{{ contribuicao.banco_pagamento.NOMBAN }}
						<strong>Agência: </strong>{{ contribuicao.CODAGE }}
					</span>
				</p>
			</AccordionTab>
			<AccordionTab header="Histórico" v-if="contribuicao.historico">
				<div class="field col-6 md:col-12" v-if="contribuicao.historico.length == 0">					
					<Message severity="info" :closable="false">Nenhum registro</Message>
				</div>
				<div class="field col-6 md:col-12" v-else>					
					<div class="field col-6 md:col-12" v-for="entry in contribuicao.historico" v-bind:key="entry.NUMCNH">					
						<Card>
								<template #title>{{ moment(entry.DATCNH).format("DD/MM/YYYY") }} {{ entry.HORCNH }}</template>
								<template #content>
									<span v-if="entry.TIPCNH == 6">
										<p><strong>Pagamento</strong></p>
										<p>Atual: {{ entry.VALDESCNH ? moment(entry.VALDESCNH).format('DD/MM/YYYY') : 'Aberto' }}</p>
										<p>Anterior: {{ entry.VALORICNH ? moment(entry.VALORICNH).format('DD/MM/YYYY') : 'Aberto' }}</p>
									</span>
									<span v-else>
										<Message severity="info" closable="false">Sem registros</Message>
									</span>
								</template>
						</Card>					
					</div>
				</div>
			</AccordionTab>
			<AccordionTab header="Cancelamento" v-if="contribuicao.DATCANCNT">
				<p><strong>Data: </strong> {{ moment(contribuicao.DATCANCNT).format("DD/MM/YYYY") }}</p>
				<p>
					<span v-if="contribuicao.usuario_cancelamento">
						<strong>Usuário:</strong> {{ contribuicao.usuario_cancelamento.NOMUSU }}
					</span>
				</p>
				<p>
					<strong>Motivo:</strong> {{ contribuicao.MOTCANCNT }}
				</p>
			</AccordionTab>
		</Accordion>

    <template #footer>
      <Button label="Fechar" icon="pi pi-times" class="p-button-warning" @click="show = false" text />
      <Button label="Impressão" icon="pi pi-file-pdf" class="p-button-info" @click="print()" text v-if="contribuicao.defcontrib && contribuicao.defcontrib.CODWSR" />
      <slot name="footer"></slot>
    </template>
  </Dialog>
</template>