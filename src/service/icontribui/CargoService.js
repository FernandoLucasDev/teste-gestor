import APIService from "../APIService";

export default class CargoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "cargo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODCAR) {
    try {
      const response = await this.api.send("get", "cargo/" + CODCAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "cargo", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "cargo/" + data.CODCAR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODCAR) {
    try {
      const response = await this.api.send("delete", "cargo/" + CODCAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}