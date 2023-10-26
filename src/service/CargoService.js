import APIService from "./APIService";

export default class CargoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "cargo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(term, src) {
    try {
      const response = await this.api.send("get", "cargo/search?" + term + "=" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEnt) {
    try {
      const response = await this.api.send("get", "entidade/" + CodEnt);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "entidade", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "entidade/" + data.CODENT, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodEnt) {
    try {
      const response = await this.api.send("delete", "entidade/" + CodEnt);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}