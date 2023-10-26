import APIService from "./APIService";

export default class SubGrupoEntidadeService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "subGrupoEntidade");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodGre, CodSge) {
    try {
      const response = await this.api.send("get", "subGrupoEntidade/" + CodGre + "/" + CodSge);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "subGrupoEntidade", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "subGrupoEntidade/" + data.CODGRE + "/" + data.CODSGE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodGre, CodSge) {
    try {
      const response = await this.api.send("delete", "subGrupoEntidade/" + CodGre + "/" + CodSge);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}