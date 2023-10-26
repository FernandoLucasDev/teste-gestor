import APIService from "../APIService";

export default class MacroRegiaoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "macroRegiao");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODMAC) {
    try {
      const response = await this.api.send("get", "macroRegiao/" + CODMAC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "macroRegiao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "macroRegiao/" + data.CODMAC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODMAC) {
    try {
      const response = await this.api.send("delete", "macroRegiao/" + CODMAC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}