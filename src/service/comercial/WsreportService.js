import APIService from "../APIService";

export default class WsreportService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "wsreport");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODWSR) {
    try {
      const response = await this.api.send("get", "wsreport/" + CODWSR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "wsreport", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "wsreport/" + data.CODWSR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODWSR) {
    try {
      const response = await this.api.send("delete", "wsreport/" + CODWSR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}