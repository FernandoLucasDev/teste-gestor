import APIService from "../APIService";

export default class EspecieService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "especie");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEsp) {
    try {
      const response = await this.api.send("get", "especie/" + CodEsp);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "especie", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "especie/" + data.CODESP, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODESP) {
    try {
      const response = await this.api.send("delete", "especie/" + CODESP);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}