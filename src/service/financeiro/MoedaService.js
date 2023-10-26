import APIService from "../APIService";

export default class MoedaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "moeda");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODMOE) {
    try {
      const response = await this.api.send("get", "moeda/" + CODMOE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "moeda", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "moeda/" + data.CODMOE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODMOE) {
    try {
      const response = await this.api.send("delete", "moeda/" + CODMOE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}