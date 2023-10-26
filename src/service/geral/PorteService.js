import APIService from "../APIService";

export default class PorteService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "porte");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODPOR) {
    try {
      const response = await this.api.send("get", "porte/" + CODPOR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "porte", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "porte/" + data.CODPOR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODPOR) {
    try {
      const response = await this.api.send("delete", "porte/" + CODPOR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}