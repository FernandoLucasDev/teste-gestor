import APIService from "../APIService";

export default class EleicaoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "eleicao");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODELE) {
    try {
      const response = await this.api.send("get", "eleicao/" + CODELE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "eleicao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "eleicao/" + data.CODELE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODELE) {
    try {
      const response = await this.api.send("delete", "eleicao/" + CODELE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}