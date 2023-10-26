import APIService from "./APIService";

export default class HistAssociacaoService extends APIService {
  async all(CodCnv, Matass) {
    try {
      const response = await this.send(
        "get", 
        "hist-associacao?CODCNV=" + CodCnv + "&MATASS=" + Matass
      );
      return response;
    }
    catch (e) {
      return false;
    }
  }
}