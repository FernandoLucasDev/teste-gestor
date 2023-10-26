import APIService from "../APIService";

export default class HierarquiaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "hierarquia");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODHIE) {
    try {
      const response = await this.api.send("get", "hierarquia/" + CODHIE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "hierarquia", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "hierarquia/" + data.CODHIE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODHIE) {
    try {
      const response = await this.api.send("delete", "hierarquia/" + CODHIE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}