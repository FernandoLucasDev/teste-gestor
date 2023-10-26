import APIService from "../APIService";

export default class CorService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "cor");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(src) {
    try {
      const response = await this.api.send("get", "cor/search/" + src );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodCor) {
    try {
      const response = await this.api.send("get", "cor/" + CodCor);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "cor", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "cor/" + data.CODCOR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODCOR) {
    try {
      const response = await this.api.send("delete", "cor/" + CODCOR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}