import APIService from "../APIService";

export default class ModeloService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "modelo");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(src) {
    try {
      const response = await this.api.send("get", "modelo/search/" + src );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodMod) {
    try {
      const response = await this.api.send("get", "modelo/" + CodMod);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "modelo", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "modelo/" + data.CODMOD, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODMOD) {
    try {
      const response = await this.api.send("delete", "modelo/" + CODMOD);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}