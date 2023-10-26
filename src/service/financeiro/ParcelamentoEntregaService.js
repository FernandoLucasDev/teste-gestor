import APIService from "../APIService";

export default class ParcelamentoEntregaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "parcelamentoEntrega");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODPARENT) {
    try {
      const response = await this.api.send("get", "parcelamentoEntrega/" + CODPARENT);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(src) {
    try {
      const response = await this.api.send("get", "parcelamentoEntrega/search/" + src );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "parcelamentoEntrega", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "parcelamentoEntrega/" + data.CODPARENT, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODPARENT) {
    try {
      const response = await this.api.send("delete", "parcelamentoEntrega/" + CODPARENT);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}