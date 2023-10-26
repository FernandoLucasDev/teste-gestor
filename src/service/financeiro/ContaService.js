import APIService from "../APIService";

export default class ContaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "conta");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(data) {
    try {
      const response = await this.api.send("get", "conta/" + data.CODCTA, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "conta", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "conta/" + data.CODCTA, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      const response = await this.api.send("delete", "conta/" + data.CODCTA, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}