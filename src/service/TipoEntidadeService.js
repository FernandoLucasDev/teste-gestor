import APIService from "./APIService";

export default class TipoEntidadeService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoEntidade");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEnt) {
    try {
      const response = await this.api.send("get", "tipoEntidade/" + CodEnt);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoEntidade", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoEntidade/" + data.CODTIE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodTie) {
    try {
      const response = await this.api.send("delete", "tipoEntidade/" + CodTie);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}