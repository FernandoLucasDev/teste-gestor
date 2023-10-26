import APIService from "../APIService";

export default class FormaPagamentoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "formaPagamento");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODFPG) {
    try {
      const response = await this.api.send("get", "formaPagamento/" + CODFPG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "formaPagamento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "formaPagamento/" + data.CODFPG, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODFPG) {
    try {
      const response = await this.api.send("delete", "formaPagamento/" + CODFPG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}