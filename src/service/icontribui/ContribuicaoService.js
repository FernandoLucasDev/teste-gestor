import APIService from "../APIService";

export default class ContribuicaoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "contribuicao");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async procuraByAno(options, filtro) {
    try {
      const response = await this.api.send("get", "contribuicao/search" + (this.api.serverSideOptionsFormat(options) ? this.api.serverSideOptionsFormat(options) + "&" + filtro : (filtro != "" ? "?" + filtro : "")));

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODENT) {
    try {
      const response = await this.api.send("get", "contribuicao/" + CODENT);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "contribuicao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "contribuicao/" + data.CODENT, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async cancel(AnoCnt, NumCnt, MotCanCnt) {
    try {
      const response = await this.api.send("put", "contribuicao/cancel/" + AnoCnt + "/" + NumCnt, {
        MotCanCnt : MotCanCnt
      });
      return response;
    }
    catch (e) {
      return false;
    }
  }
}