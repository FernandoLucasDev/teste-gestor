import APIService from "./APIService";

export default class ConvenioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "convenio");
      return response;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }
  
  async search(term, src) {
    try {
      const response = await this.api.send("get", "contato/search?" + term + "=" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODEMP) {
    try {
      const response = await this.api.send("get", "convenio/" + CODEMP);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "convenio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "convenio/" + data.CODCNV, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      console.log(data);
//      const response = await this.api.send("delete", "convenio/" + data.CODCNV + "/" + data.CODEMP);
      const response = await this.api.send("delete", "convenio/" + data.CODCNV);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}