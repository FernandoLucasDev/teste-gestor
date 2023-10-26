import APIService from "./APIService";

export default class CepService {  
  api = new APIService();

  async get(cep) {
    try {
      const response = await this.api.send("get", "cep/"+cep.replace(/\-/g, ""));
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async getCep(rua, cidade, estado) {
    try {
      const response = await this.api.send("get", "cep/"+ estado +"/"+ cidade +"/"+ rua);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}