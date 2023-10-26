import APIService from "./APIService";

export default class SeguradoService {  
  api = new APIService();
  
  async delete(MatSeg, NumApo) {
    try {
      const response = await this.api.send("delete", "apolice/" + NumApo + "/segurado/" + MatSeg);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}