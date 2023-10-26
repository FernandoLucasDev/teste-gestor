import APIService from "./APIService";

export default class AssociacaoDepedenteService {  
  api = new APIService();

  async update(data) {
    console.log('data :>> ', data);
    try {
      const response = await this.api.send("post", "processamento-empregado/dependente", data);
      console.log('response :>> ', response);
      return response;
    }
    catch (e) {
      this.errors = e;
      return false;
    }
  }
  
  async delete(CodCnv, MatAss, SeqAssDep) {
    try {
      const response = await this.api.send("delete", "convenio/" + CodCnv + "/associacao/" + MatAss + "/dependente/" + SeqAssDep);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}