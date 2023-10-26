import APIService from "./APIService";

export default class PermissaoService {  
  api = new APIService();

  async my() {
    try {
      const response = await this.api.send("get", "permissoes");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodTar) {
    try {
      const response = await this.api.send("get", "permissao/" + CodTar);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async procura(CodGrpUsu) {
    try {
      const response = await this.api.send("get", "permissao/procura" + "?CODGRPUSU=" + CodGrpUsu);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.api.send("post", "permissao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(CODTAR, CODGRPUSU) {
    try {
      // const response = await this.api.send("delete", "permissao?CODTAR=" + CODTAR + "&CODGRPUSU=" + CODGRPUSU);
      const response = await this.api.send("delete", "permissao/" + CODTAR + "/" + CODGRPUSU);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}