<template>
	<div class="layout-footer">
		<!-- <img alt="Logo" :src="footerImage()" height="20" class="mr-2" /> -->
		<!-- Desenvolvido por 
		<span class="font-medium ml-1 mr-5">WorkingSoftware LTDA</span> -->
		<img alt="WorkingSoftware" :src="footerImage()" height="35" />
	</div>
</template>

<script>
	export default {
		name: "AppFooter",
		methods: {
			footerImage() {
				return this.$appState.darkTheme ? 'images/ws-logo-white.png' : 'images/ws-logo-dark.png';
			}
		},
		computed: {
			darkTheme() {
				return this.$appState.darkTheme;
			}
		}
	}
</script>