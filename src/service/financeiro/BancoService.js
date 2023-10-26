import APIService from "../APIService";

export default class BancoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "banco");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODBAN) {
    try {
      const response = await this.api.send("get", "banco/" + CODBAN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "banco", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "banco/" + data.CODBAN, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODBAN) {
    try {
      const response = await this.api.send("delete", "banco/" + CODBAN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}