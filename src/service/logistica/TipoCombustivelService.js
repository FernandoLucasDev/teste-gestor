import APIService from "../APIService";

export default class TipoCombustivelService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoCombustivel");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTCO) {
    try {
      const response = await this.api.send("get", "tipoCombustivel/" + CODTCO);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoCombustivel", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoCombustivel/" + data.CODTCO, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTCO) {
    try {
      const response = await this.api.send("delete", "tipoCombustivel/" + CODTCO);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}