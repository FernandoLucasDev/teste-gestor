import APIService from "./APIService";

export default class IdiomaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "idioma");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodIdi) {
    try {
      const response = await this.api.send("get", "idioma/" + CodIdi);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "idioma", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "idioma/" + data.CODIDI, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodIdi) {
    try {
      const response = await this.api.send("delete", "idioma/" + CodIdi);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}