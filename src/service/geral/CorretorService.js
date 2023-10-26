import APIService from "../APIService";

export default class CorretorService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "corretor");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(data) {
    try {
      const response = await this.api.send("get", "corretor/" + data.id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "corretor", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "corretor/" + data.id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      const response = await this.api.send("delete", "corretor/" + data.id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}