import APIService from "./APIService";

export default class ApoliceService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "apolice");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(term, src) {
    try {
      const response = await this.api.send("get", "apolice/search?" + term + "=" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(NumApo) {
    try {
      const response = await this.api.send("get", "apolice/" + NumApo);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "apolice", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "apolice/" + data.NUMAPO, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      const response = await this.api.send("delete", "apolice/" + data.NUMAPO, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}