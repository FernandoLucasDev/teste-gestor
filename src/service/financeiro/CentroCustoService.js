import APIService from "../APIService";

export default class CentroCustoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "centroCusto");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODCENCUS) {
    try {
      const response = await this.api.send("get", "centroCusto/" + CODCENCUS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "centroCusto", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "centroCusto/" + data.CODCENCUS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODCENCUS) {
    try {
      const response = await this.api.send("delete", "centroCusto/" + CODCENCUS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}