import APIService from "../APIService";

export default class ParametroService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "parametro");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODEMP) {
    try {
      const response = await this.api.send("get", "parametro/" + CODEMP);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "parametro", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "parametro/" + data.CODEMP, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODEMP) {
    try {
      const response = await this.api.send("delete", "parametro/" + CODEMP);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}