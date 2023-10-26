<template>
	<div :class="containerClass" @click="onWrapperClick">
        <AppTopBar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">            
            <div v-if="loading || isAuth0Loading">
                <div class="formgrid grid">
                    <div class="col-12">
                    <ProgressSpinner style="margin-left : auto; margin-right : auto; height : 70px" />
                    </div>          
                </div>          
            </div>
            <AppMenu :model="menu" @menuitem-click="onMenuItemClick" v-else />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-view />
            </div>            
            
            <AppFooter />
        </div>

		<AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" />
        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
	</div>
</template>

<script>
import EventBus from './AppEventBus';
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';
import EmpresaService from './service/EmpresaService';
import ParametroService from './service/geral/ParametroService';
import LoginService from './service/LoginService';

import MenuMixin from './mixins/Menu';
import LoginMixin from './mixins/Login';

export default {
    emits: ['change-theme'],   
    mixins : [ MenuMixin, LoginMixin ],
    data() {
        return {
            layoutMode: 'static',
            staticMenuInactive: false,
            overlayMenuActive: false,
            mobileMenuActive: false,
            loading : false,
            menu : [],
            permissoes : [],
            user : null,
            userAuth0: this.$auth0?.user,
            isAuth0Authenticated: this.$auth0?.isAuthenticated,
            isAuth0Loading: this.$auth0?.isLoading,

            parametroService : null,
            parametros : null,
            textoCor: "color: ",
            menuCor: "background-color: ",
        }
    },

    watch: {
        $route() {
            this.menuActive = false;
        },
    },

    userChanged : null,
    userChangedChecked : null,

    beforeCreate() {
        console.log("App.beforeCreate");
        const loginService = new LoginService();
        
        this.userChanged = () => {
            // console.log("userChanged");
        }
        this.userChangedChecked = () => {
            // console.log("userChangedChecked");
            this.loadMenu();
        }

        EventBus.on('user-loaded', this.userChanged);
        EventBus.on('user-checked', this.userChangedChecked);

        loginService.check()
        .then(
            response =>
            EventBus.emit("user-checked", response[1])
        )
    },

    created() {
        this.parametroService = new ParametroService();
    },

    mounted() {   
        /*
        this.parametroService.all().then((data) => {
            this.parametros = data[0];
            this.menuCor += this.parametros.CORMENU
            this.textoCor += this.parametros.CORTEXMENU
        });
        */
        // console.log("this.$root.userAuth0", this.$root.userAuth0);
    },

    methods: {
        onWrapperClick() {
            if (!this.menuClick) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }

            this.menuClick = false;
        },
        onMenuToggle() {
            this.menuClick = true;

            if (this.isDesktop()) {
                if (this.layoutMode === 'overlay') {
					if(this.mobileMenuActive === true) {
						this.overlayMenuActive = true;
					}

                    this.overlayMenuActive = !this.overlayMenuActive;
					this.mobileMenuActive = false;
                }
                else if (this.layoutMode === 'static') {
                    this.staticMenuInactive = !this.staticMenuInactive;
                }
            }
            else {
                this.mobileMenuActive = !this.mobileMenuActive;
            }

            event.preventDefault();
        },
        onSidebarClick() {
            this.menuClick = true;
        },
        onMenuItemClick(event) {
            if (event.item && !event.item.items) {
                this.overlayMenuActive = false;
                this.mobileMenuActive = false;
            }
        },
		onLayoutChange(layoutMode) {
			this.layoutMode = layoutMode;
		},
        addClass(element, className) {
            if (element.classList)
                element.classList.add(className);
            else
                element.className += ' ' + className;
        },
        removeClass(element, className) {
            if (element.classList)
                element.classList.remove(className);
            else
                element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        },
        isDesktop() {
            return window.innerWidth >= 992;
        },
        isSidebarVisible() {
            if (this.isDesktop()) {
                if (this.layoutMode === 'static')
                    return !this.staticMenuInactive;
                else if (this.layoutMode === 'overlay')
                    return this.overlayMenuActive;
            }

            return true;
        },
        async auth0Token() {
            if (process.env.VUE_APP_AUTH0_ENABLED) {
                const token = await this.$auth0?.getAccessTokenSilently();
                const response = await fetch('https://api.example.com/posts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
                });
                const data = await response.json();
            }
        },
        loadMenu() {
            if (this.menu.length) return;

            (new EmpresaService()).getDefault();

            this.loading = true;

            this.menuLoad()
            .finally(() => {
                this.loading = false;
            });
        }
    },
    computed: {
        containerClass() {
            return ['layout-wrapper', {
                'layout-overlay': this.layoutMode === 'overlay',
                'layout-static': this.layoutMode === 'static',
                'layout-static-sidebar-inactive': this.staticMenuInactive && this.layoutMode === 'static',
                'layout-overlay-sidebar-active': this.overlayMenuActive && this.layoutMode === 'overlay',
                'layout-mobile-sidebar-active': this.mobileMenuActive,
				'p-input-filled': this.$primevue.config.inputStyle === 'filled',
				'p-ripple-disabled': this.$primevue.config.ripple === false
            }];
        },
        logo() {
            return (this.$appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
        }
    },
    beforeUpdate() {
        if (this.mobileMenuActive)
            this.addClass(document.body, 'body-overflow-hidden');
        else
            this.removeClass(document.body, 'body-overflow-hidden');
    },
    
    components: {
        'AppTopBar': AppTopBar,
        'AppMenu': AppMenu,
        'AppConfig': AppConfig,
        'AppFooter': AppFooter,
    }
}
</script>

<style lang="scss">
@import './App.scss';
</style>
