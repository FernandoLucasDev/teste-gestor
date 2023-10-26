import APIService from "./APIService";

export default class BeneficioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "beneficio");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODBEN) {
    try {
      const response = await this.api.send("get", "beneficio/" + CODBEN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "beneficio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "beneficio/" + data.CODBEN,data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      console.log("data", data);
      const response = await this.api.send("delete", "beneficio/" + data.CODBEN );
      return response;
    }
    catch (e) {
      return false;
    }
  }
}