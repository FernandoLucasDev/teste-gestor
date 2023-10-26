import APIService from "./APIService";

export default class AutomatizacaoService extends APIService {  
  path = "automatizacao";

  async availables() {
    try {
      const response = await this.send("get", this.path + '/availables');
      return response;
    }
    catch (e) {
      return false;
    }
  }
}