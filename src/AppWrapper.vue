<template>
    <router-view></router-view>
</template>

<script>
import EventBus from './AppEventBus';
import LoginMixin from './mixins/Login';

export default {
    themeChangeListener: null,
    mixins : [LoginMixin],
    data() {
        return {
            userAuth0 : null,            
        }
    },
    mounted() {        
        this.themeChangeListener = (event) => {
            const elementId = 'theme-link';
            const linkElement = document.getElementById(elementId);
            const cloneLinkElement = linkElement.cloneNode(true);
            const newThemeUrl = linkElement.getAttribute('href').replace(this.$appState.theme, event.theme);

            cloneLinkElement.setAttribute('id', elementId + '-clone');
            cloneLinkElement.setAttribute('href', newThemeUrl);
            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', elementId);
            });
            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
        
            this.$appState.theme = event.theme;
            this.$appState.darkTheme = event.dark;
        };

        EventBus.on('theme-change', this.themeChangeListener);

        if (process.env.VUE_APP_AUTH0_ENABLED) {
            this.$auth0?.getAccessTokenSilently({detailedResponse : true})
            .then((response) => {
                console.log("getAccessTokenSilently");
                const token = response;
                console.log(response);
                console.log(this.$auth0.isAuthenticated);
                console.log(this.$auth0.isLoading);
                if (this.$auth0.user) {
                    this.userAuth0 = this.$auth0.user;

                    EventBus.emit("user-loaded", {});

                    this.loginCheckAuth0(this.userAuth0.sub)
                    .then((loginResponse) => {
                        console.log(loginResponse);
                        if (loginResponse) {
                            EventBus.emit("user-checked", {});

                            //this.login2Old(token);
                        }
                        else {
                            //this.$router.push({ path : "/login"});
                            return;
                        }
                    });
                }         
            })
            .catch((e) => {
                console.log("Auth0 login required");
                this.loginCheck()
                .then((loginResponse) => {
                    if (loginResponse) {                    
                        EventBus.emit("user-checked", {});
                    }
                    else {
                        //this.$router.push({ path : "/login"});
                        return;
                    }
                });
            });
        }
    },
    beforeUnmount() {
        EventBus.off('theme-change', this.themeChangeListener);
    },
    methods : {
        getPermissoes() {
            console.log("getPermissoes")
        }
    },
}
</script>