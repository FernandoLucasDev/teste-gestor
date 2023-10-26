import APIService from "../APIService";

export default class PracaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "praca");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(src) {
    try {
      const response = await this.api.send("get", "praca/search/" + src );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodPra) {
    try {
      const response = await this.api.send("get", "praca/" + CodPra);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "praca", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "praca/" + data.CODPRA, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODPRA) {
    try {
      const response = await this.api.send("delete", "praca/" + CODPRA);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}