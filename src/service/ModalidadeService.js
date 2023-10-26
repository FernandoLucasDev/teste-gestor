import APIService from "./APIService";

export default class ModalidadeService {  
  api = new APIService();

  async all(CodCnv) {
    try {
      const response = await this.api.send("get", "modalidade?CodCnv=" + CodCnv);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(term, src) {
    try {
      const response = await this.api.send("get", "contato/search?" + term + "=" + src);
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