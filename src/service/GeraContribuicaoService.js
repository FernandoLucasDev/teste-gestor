import APIService from "./APIService";

export default class GeraContribuicaoService extends APIService {  
  path = "gera-contribuicao"

  async overview(data) {
    try {
      const response = await this.send("post", "gera-contribuicao/overview", data);
      return response;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }
  
  async status(id) {
    try {
      const response = await this.send("get", "gera-contribuicao/status/" + id);
      return response;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }
}