import APIService from "../APIService";

export default class TipoPedidoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoPedido");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPPED) {
    try {
      const response = await this.api.send("get", "tipoPedido/" + CODTIPPED);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoPedido", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoPedido/" + data.CODTIPPED, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTIPPED) {
    try {
      const response = await this.api.send("delete", "tipoPedido/" + CODTIPPED);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}