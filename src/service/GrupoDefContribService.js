import APIService from "./APIService";

export default class GrupoDefContribService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grupoDefContrib");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODGDC) {
    try {
      const response = await this.api.send("get", "grupoDefContrib/" + CODGDC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grupoDefContrib", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grupoDefContrib/" + data.CODGDC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODGDC) {
    try {
      const response = await this.api.send("delete", "grupoDefContrib/" + CODGDC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}