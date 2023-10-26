import APIService from "../APIService";

export default class GrupoConvenioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grupoConvenio");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODGCN) {
    try {
      const response = await this.api.send("get", "grupoConvenio/" + CODGCN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grupoConvenio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grupoConvenio/" + data.CODGCN, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODGCN) {
    try {
      const response = await this.api.send("delete", "grupoConvenio/" + CODGCN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}