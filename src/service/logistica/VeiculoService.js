import APIService from "../APIService";

export default class VeiculoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "veiculo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODVEI) {
    try {
      const response = await this.api.send("get", "veiculo/" + CODVEI);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "veiculo", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "veiculo/" + data.CODVEI, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODVEI) {
    try {
      const response = await this.api.send("delete", "veiculo/" + CODVEI);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}