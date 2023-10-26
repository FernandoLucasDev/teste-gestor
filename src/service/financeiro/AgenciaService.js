import APIService from "../APIService";

export default class AgenciaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "agencia");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODAGE) {
    try {
      const response = await this.api.send("get", "agencia/" + CODAGE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "agencia", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "agencia/" + data.CODAGE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODAGE) {
    try {
      const response = await this.api.send("delete", "agencia/" + CODAGE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}