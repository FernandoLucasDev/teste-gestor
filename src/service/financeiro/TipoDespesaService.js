import APIService from "../APIService";

export default class TipoDespesaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoDespesa");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPDES) {
    try {
      const response = await this.api.send("get", "tipoDespesa/" + CODTIPDES);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoDespesa", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoDespesa/" + data.CODTIPDES, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTIPDES) {
    try {
      const response = await this.api.send("delete", "tipoDespesa/" + CODTIPDES);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}