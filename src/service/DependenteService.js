import APIService from "./APIService";

export default class DependenteService {  
  api = new APIService();

  async all(CodEnt, CodCon) {
    try {
      const response = await this.api.send("get", "entidade/"+CodEnt+"/contato/" + CodCon + "/dependente/");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src, options) {
    try {
      // const response = await this.api.send("get", "contato/search?" + term + "=" + src);
      const response = await this.api.send("get", "dependente/search/" + options);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEnt, CodCon, CodDep) {
    try {
      const response = await this.api.send("get", "entidade/"+CodEnt+"/contato/" + CodCon + "/dependente/" + CodDep);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "entidade/"+data.CODENT+"/contato/"+data.CODCON+"/dependente/", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "entidade/"+data.CODENT+"/contato/" + data.CODCON + "/dependente/" + data.CODDEP, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodEnt) {
    try {
      const response = await this.api.send("delete", "entidade/" + CodEnt);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}