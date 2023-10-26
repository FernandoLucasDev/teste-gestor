import APIService from "../APIService";

export default class condicaoPagamentoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "condicaoPagamento");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODCND) {
    try {
      const response = await this.api.send("get", "condicaoPagamento/" + CODCND);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "condicaoPagamento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "condicaoPagamento/" + data.CODCND, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODCND) {
    try {
      const response = await this.api.send("delete", "condicaoPagamento/" + CODCND);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}