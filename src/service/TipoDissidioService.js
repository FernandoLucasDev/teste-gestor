import APIService from "./APIService";

export default class TipoDissidioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipo-dissidio");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTDI) {
    try {
      const response = await this.api.send("get", "tipo-dissidio/" + CODTDI);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipo-dissidio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipo-dissidio/" + data.CODTDI, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTDI) {
    try {
      const response = await this.api.send("delete", "tipo-dissidio/" + CODTDI);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}