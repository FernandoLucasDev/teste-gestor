  import APIService from "./APIService";

export default class SecaoCnaeService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "secao-cnae");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODSCN) {
    try {
      const response = await this.api.send("get", "secao-cnae/" + CODSCN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "secao-cnae", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
 update(data) {
    try {
      const response = this.api.send("put", "secao-cnae/" + data.CODSCN, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODSCN) {
    try {
      const response = await this.api.send("delete", "secao-cnae/" + CODSCN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}