import LoginService from '../service/LoginService';
import EventBus from '../AppEventBus';
import { inject } from 'vue';

export default {
  inject : ['user'],
  data: function () {
    return {
      isLogged : false,
      user_data : null,
      loginService : null,
    };
  },
  created: function () {
    this.loginService = new LoginService();

    // console.log("cookies");
    // console.log("this.$csrfCookie", this.$csrfCookie)
    // console.log("this.$appState", this.$appState)
  },
  methods : {
    async loginStart() {
      const result = await this.loginService.start();

      this.$csrfCookie.checked = true;
    },
    async loginSend(email, password) {
      return await this.loginService.send(email, password);
    },
    async loginCheck () {
      const result = await this.loginService.check();

      // console.log("loginCheck");
      // console.log("result", result);

      if (result[0]) {
        this.isLogged = true;
        this.user_data = result[1];
        //this.$user = this.user_data;
        this.$root.user = this.user_data;

        console.log(this.user_data);
        EventBus.emit(
          "user-logged", 
          {
            user : this.user_data
          }
        );
      }

      return result;
    },
    async loginCheckAuth0 (sub) {
      const result = await this.loginService.checkAuth0(sub);

      // console.log("loginCheck");
      // console.log("result", result);

      if (result[0]) {
        this.isLogged = true;
        this.user_data = result[1];
        this.$root.user = this.user_data;
        EventBus.emit(
          "user-logged", 
          {
            user : this.user_data
          }
        );
      }

      return result;
    },

    async connectAuth0(sub) {
      return await this.loginService.connectAuth0(sub);
    },
    onLogged() {},
    async passwordRecovery(email) {
      return await this.loginService.recovery(email);
    }
  }
}
