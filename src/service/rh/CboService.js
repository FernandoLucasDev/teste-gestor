import APIService from "../APIService";

export default class CboService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "cbo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODCBO) {
    try {
      const response = await this.api.send("get", "cbo/" + CODCBO);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "cbo", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "cbo/" + data.CODCBO, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODCBO) {
    try {
      const response = await this.api.send("delete", "cbo/" + CODCBO);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}