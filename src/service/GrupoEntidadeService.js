import APIService from "./APIService";

export default class GrupoEntidadeService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grupoEntidade");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodGre) {
    try {
      const response = await this.api.send("get", "grupoEntidade/" + CodGre);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grupoEntidade", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grupoEntidade/" + data.CODGRE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodGre) {
    try {
      const response = await this.api.send("delete", "grupoEntidade/" + CodGre);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}