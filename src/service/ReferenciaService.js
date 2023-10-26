import APIService from "./APIService";

export default class ReferenciaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "referencia");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODREF) {
    try {
      const response = await this.api.send("get", "referencia/" + CODREF);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "referencia", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "referencia/" + data.CODREF, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODREF) {
    try {
      const response = await this.api.send("delete", "referencia/" + CODREF);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}