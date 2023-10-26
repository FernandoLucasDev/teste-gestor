import APIService from "./APIService";

export default class MotivoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "motivo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
}