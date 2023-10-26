<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<img alt="Logo" :src="topbarImage()" />
			<span :style="textoCor">GestorWEB</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<Menu ref="menu" :model="toolbarItems" :popup="true" @click="empresaSelected" />
				<Button 
					type="button" 
					:label="empresaLabel" 
					class="p-button-secondary p-button-text mr-2 mb-2" icon="pi pi-angle-down" 
					@click="toggleMenu" 
					style="width: auto;"
					 />
			</li>
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-calendar"></i>
					<span>Events</span>
				</button>
			</li>
			<li>
				<Menu ref="settingsProfile" :model="settingsItems" :popup="true" @click="profileMenuSelected" />
				<button class="p-link layout-topbar-button" @click="toggleSettingsMenu">
					<i class="pi pi-cog"></i>
					<span>Settings</span>
				</button>
			</li>
			<li>
				<Menu ref="menuProfile" :model="profileItems" :popup="true" @click="profileMenuSelected" />
				<button class="p-link layout-topbar-button" @click="toggleProfileMenu">
					<i class="pi pi-user"></i>
					<span>Profile</span>
				</button>
			</li>
		</ul>
	</div>
	<Dialog v-model:visible="loggoutDialog" :style="{width: '450px'}" header="Sair" :modal="true">
    <div class="flex align-items-center justify-content-center">
      Deseja realmente sair e fechar sua sessão?
    </div>
    <template #footer>
      <Button label="Não" icon="pi pi-times" class="p-button-text" @click="loggoutDialog = false"/>
      <Button label="Sim" icon="pi pi-check" class="p-button-text" @click="logout" />
    </template>
  </Dialog>
</template>

<script>
import EmpresaService from './service/EmpresaService';
import LoginService from './service/LoginService';
import ParametroService from './service/geral/ParametroService';

export default {
		data() {
			return {
				empresaService : null,
				parametroService : null,
				parametros : null,
				loggoutDialog:false,
				empresaLabel : "Empresa",
				toolbarItems: [
					{
						label: 'Save',
						icon: 'pi pi-check'
					},
					{
						label: 'Update',
						icon: 'pi pi-upload'
					},
					{
						label: 'Delete',
						icon: 'pi pi-trash'
					},
					{
						label: 'Home Page',
						icon: 'pi pi-home'
					},
				],
				settingsItems : [
					{
						label: 'Tema',
						icon: 'pi pi-pallete',
						to : '/theme'
					},
				],
				profileItems: [
					// {
					// 	label: 'Perfil',
					// 	icon: 'pi pi-user',
					// 	to : '/profile'
					// },
					{
						label: 'Sair',
						icon: 'pi pi-power-off'
					},
				],

				textoCor: "color: ",
				tolbarCor: "background-color: ",
			};
		},
		beforeCreate() {
			this.empresaService = new EmpresaService();

			this.empresaService
			.all()
			.then(
				(empresas) => {
					let _items = [];

					empresas.map(
						(empresa) => _items.push({label : empresa.NOMEMP, id : empresa.CODEMP})
					);

					this.toolbarItems = _items;

					(new EmpresaService()).getDefault()
					.then((response) => this.setEmpresa(response[0]));
				}
			)
		},
		created() {
			this.empresaService = new EmpresaService();
			this.parametroService = new ParametroService();
		},

		async mounted() {
			/*
			await this.parametroService.all().then((data) => {
				this.parametros = data[0];
				this.tolbarCor += this.parametros.CORTOLBAR
				this.textoCor += this.parametros.CORTEXTOLBAR
			});
			*/
		},

    methods: {
			onMenuToggle(event) {
					this.$emit('menu-toggle', event);
			},
			onTopbarMenuToggle(event) {
				this.$emit('topbar-menu-toggle', event);
			},
			topbarImage() {
				return this.$appState.darkTheme ? 'images/blockchain.png' : 'images/blockchain.png';
			},
			empresaSelected(ev) {
				const id = this.searchEmpresa(ev.target.textContent);

				this.empresaService.change(id);
				this.setEmpresa(id);				
			},
			profileMenuSelected(ev) {
				switch (ev.target.textContent.toString().toLowerCase()) {
					case "sair" :
						this.loggoutDialog = true;
						break;
				}
			},
			toggleMenu(event) {
				this.$refs.menu.toggle(event);
			},
			toggleProfileMenu(event) {
				this.$refs.menuProfile.toggle(event);
			},
			toggleSettingsMenu(event) {
				this.$refs.settingsProfile.toggle(event);
			},
			searchEmpresa(text) {
				let id;
				this.toolbarItems.map(
					(item) => {
						if (item.label == text) {
							id = item.id;
						}
					}
				);

				return id;
			},
			setEmpresa(id) {
				this.toolbarItems.map(
					(item) => {
						if (item.id == id) {
							this.empresaLabel = item.label;
						}
					}
				);
			},
			logout() {
				this.loggoutDialog = false;
				(new LoginService()).logout()
				.then(() => {
					if (this.$auth0?.isAuthenticated) {
						this.$auth0.logout({ 
							openUrl : false
						})
						.then(resp => {
							this.$router.push({ path : "/login"});	
						});
					}
					else {
						this.$router.push({ path : "/login"});
					}
				});
			},
    },
	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>

<style>
/* .layout-topbar {
	background-color: #987555;
} */
</style>