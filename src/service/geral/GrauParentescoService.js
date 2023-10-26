import APIService from "../APIService";

export default class GrauParentescoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grau-parentesco");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODGRAPAR) {
    try {
      const response = await this.api.send("get", "grau-parentesco/" + CODGRAPAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grau-parentesco", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grau-parentesco/" + data.CODGRAPAR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODGRAPAR) {
    try {
      const response = await this.api.send("delete", "grau-parentesco/" + CODGRAPAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}