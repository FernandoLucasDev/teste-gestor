import APIService from "./APIService";

export default class AssociacaoService extends APIService {  
  async all(options) {
    try {
      const response = await this.send(
        "get", 
        "associacao" + this.serverSideOptionsFormat(options)
      );
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.send("post", "associacao", data);
      return response;
    }
    catch (e) {
      return e;
    }
  }
  
  async update(data) {
    try {
      const response = await this.send("put", "associacao/" + data.MATASS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(MatAss, CodCnv) {
    try {
      const response = await this.send("delete", "convenio/" + CodCnv + "/associacao/" + MatAss);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}