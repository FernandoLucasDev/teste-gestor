import APIService from "./APIService";

export default class ProcessamentoEmpregadoService {  
  api = new APIService();

  errors = null;
  
  async send(data) {
    try {
      const response = await this.api.send("post", "processamento-empregado", data);
      return response;
    }
    catch (e) {
      this.errors = e;
      return false;
    }
  }

  async disable(data) {
    try {
      const response = await this.api.send("delete", "processamento-empregado/" + data.MATASS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(data) {
    try {
      const response = await this.api.send("post", "processamento-empregado/delete", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}