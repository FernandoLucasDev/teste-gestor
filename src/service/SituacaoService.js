import APIService from "./APIService";

export default class SituacaoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "situacao");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODSIT) {
    try {
      const response = await this.api.send("get", "situacao/" + CODSIT);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "situacao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
 update(data) {
    try {
      const response = this.api.send("put", "situacao/" + data.CODSIT, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODSIT) {
    try {
      const response = await this.api.send("delete", "situacao/" + CODSIT);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}