import APIService from "./APIService";

export default class EstadoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "estado");
      return response;
    }
    catch (e) {
      return false;
    }
  }
}