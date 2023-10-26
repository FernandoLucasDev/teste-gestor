import APIService from "./APIService";

export default class GrauParentescoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grau-instrucao");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodGraIns) {
    try {
      const response = await this.api.send("get", "grau-instrucao/" + CodGraIns);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grau-instrucao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grau-instrucao/" + data.CODGRAINS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(GrauInstrucao) {
    try {
      const response = await this.api.send("delete", "grau-instrucao/" + GrauInstrucao.CODGRAINS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}