import APIService from "../APIService";

export default class EstadoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "estado");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODEST) {
    try {
      const response = await this.api.send("get", "estado/" + CODEST);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "estado", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "estado/" + data.CODEST, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODEST) {
    try {
      const response = await this.api.send("delete", "estado/" + CODEST);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}