import APIService from "./APIService";

export default class ContatoService {  
  api = new APIService();

  async all(CodEnt, options) {
    try {
      const response = await this.api.send("get", "entidade/"+CodEnt+"/contato" + this.api.serverSideOptionsFormat(options),
        
      );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src, options) {
    try {
      const response = await this.api.send("get", "contato/search/" + src + this.api.serverSideOptionsFormat(options));
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async searchFromEntidade(CodEnt, src, options) {
    try {
      const response = await this.api.send("get", "contato/search/" + CodEnt + "/" + src + this.api.serverSideOptionsFormat(options));
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEnt) {
    try {
      const response = await this.api.send("get", "entidade/" + CodEnt);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "entidade", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "entidade/" + data.CODENT, data);
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