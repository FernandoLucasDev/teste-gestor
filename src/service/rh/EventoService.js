import APIService from "../APIService";

export default class EventoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "evento");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODEVE) {
    try {
      const response = await this.api.send("get", "evento/" + CODEVE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "evento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "evento/" + data.CODEVE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODEVE) {
    try {
      const response = await this.api.send("delete", "evento/" + CODEVE);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}