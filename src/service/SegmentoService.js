import APIService from "./APIService";

export default class SegmentoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "segmento");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODSEG) {
    try {
      const response = await this.api.send("get", "segmento/" + CODSEG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "segmento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
 update(data) {
    try {
      const response = this.api.send("put", "segmento/" + data.CODSEG, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODSEG) {
    try {
      const response = await this.api.send("delete", "segmento/" + CODSEG);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}