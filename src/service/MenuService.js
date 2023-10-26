import axios from "axios";

export default class MenuService {
  get() {
    return axios({
        method: 'get',
        url: process.env.VUE_APP_API_URL + 'menu'
      });
  }
}