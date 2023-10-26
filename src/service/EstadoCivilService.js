import APIService from "./APIService";

export default class EstadoCivilService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "estadoCivil");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEstCiv) {
    try {
      const response = await this.api.send("get", "estadoCivil/" + CodEstCiv);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "estadoCivil", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
   update(data) {
    try {
      const response =  this.api.send("put", "estadoCivil/" + data.CODESTCIV, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
   async delete(CodEstCiv) {
    try {
      const response =  this.api.send("delete", "estadoCivil/" + CodEstCiv);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}