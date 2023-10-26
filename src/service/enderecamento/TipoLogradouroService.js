import APIService from "../APIService";

export default class TipoLogradouroService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoLogradouro");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPLOG) {
    try {
      const response = await this.api.send("get", "tipoLogradouro/" + CODTIPLOG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoLogradouro", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoLogradouro/" + data.CODTIPLOG, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTIPLOG) {
    try {
      const response = await this.api.send("delete", "tipoLogradouro/" + CODTIPLOG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}