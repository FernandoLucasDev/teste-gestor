import APIService from "./APIService";

export default class TipoEnderecoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipo-endereco");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPEND) {
    try {
      const response = await this.api.send("get", "tipo-endereco/" + CODTIPEND);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipo-endereco", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipo-endereco/" + data.CODTIPEND, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTIPEND) {
    try {
      const response = await this.api.send("delete", "tipo-endereco/" + CODTIPEND);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}