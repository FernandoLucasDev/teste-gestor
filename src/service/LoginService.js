import APIService from "./APIService";
import axios from "axios";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default class LoginService {
  api = new APIService();

  async start() {
    const response = await axios(
      {
        method : "get",
        url : process.env.VUE_APP_API_URL + 'sanctum/csrf-cookie'
      }
    );
  }
  
  async check() {
    try {
      const response = await axios({
        method: 'get',
        url: process.env.VUE_APP_API_URL + 'login-check'
      });
      
      return response.data;
    }
    catch (e) {return false;}
  }
  
  async checkAuth0(sub) {
    try {
      const response = await axios({
        method: 'post',
        url: process.env.VUE_APP_API_URL + 'login-check',
        data : {
          sub : sub
        }
      });
      
      return response.data;
    }
    catch (e) {return false;}
  }

  async send(email, password) {
    console.log('Enviando login')
    console.log(process.env.VUE_APP_API_URL + 'login')
    try {
      const response = await axios( 
      {
        method : "post",
        url : process.env.VUE_APP_API_URL + 'login',
        data : {
          email: email,
          password
        },
      }
      );

      if (response.data[0]) {
        return true;
      }
    }
    catch (e) {
      return false;
    }
  }

  async logout() {
    const response = await this.api.send("get", "logout");
  }

  async loginAuth0() {
    try {
      const response = await axios({
        method: 'get',
        url: process.env.VUE_APP_API_URL + 'login-auth0',
      });
      
      return response.data;
    }
    catch (e) {return false;}
  }
  
  async connectAuth0(sub) {
    try {
      const response = await axios({
        method: 'post',
        url: process.env.VUE_APP_API_URL + 'auth0-connect',
        data : {
          sub : sub
        }
      });
      
      return response.data;
    }
    catch (e) {return false;}
  }

  async recovery(email) {
    try {
      const response = await this.api.send('post', "password-recovery", { email : email});
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async updatePassword(data) {
    try {
      const response = await this.api.send('post', "password-reset", data);
      return response;
    }
    catch (e) {
      return e;
    }
  }
  
  async getEmail(data) {
    try {
      const response = await this.api.send('post', "password-reset/email", data);
      return response;
    }
    catch (e) {
      return e;
    }
  }
}