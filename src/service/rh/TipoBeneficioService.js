import APIService from "../APIService";

export default class TipoBeneficioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoBeneficio");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTBE) {
    try {
      const response = await this.api.send("get", "tipoBeneficio/" + CODTBE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoBeneficio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoBeneficio/" + data.CODTBE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTBE) {
    try {
      const response = await this.api.send("delete", "tipoBeneficio/" + CODTBE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}