import APIService from "./APIService";

export default class PremioService {  
  api = new APIService();

  async all(NumApo) {
    try {
      const response = await this.api.send("get", "premio?NumApo=" + NumApo);
      return response;
    }
    catch (e) {
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
      const response = await this.api.send("get", "premio/" + CODEMP);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "premio", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "premio/" + data.CODPRE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      console.log(data);
      const response = await this.api.send("delete", "premio/" + data.CODPRE, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}