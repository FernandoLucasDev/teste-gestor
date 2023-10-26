import APIService from "../APIService";

export default class MarcaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "marca");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodMar) {
    try {
      const response = await this.api.send("get", "marca/" + CodMar);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "marca", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "marca/" + data.CODMAR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODMAR) {
    try {
      const response = await this.api.send("delete", "marca/" + CODMAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}