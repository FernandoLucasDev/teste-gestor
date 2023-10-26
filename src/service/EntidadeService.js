import APIService from "./APIService";

export default class EntidadeService {  
  api = new APIService();

  async all(options) {
    try {
      const response = await this.api.send("get", "entidade" + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)) : ""));

      return response;
    }
    catch (e) {
      return false;
    }
  }

  async allResumido() {
    try {
      const response = await this.api.send("get", "entidade/allResumido");

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src) {
    try {
      const response = await this.api.send("get", "entidade/search/" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async procura( options, entidadeSrc, telefoneSrc = null, codigoSrc = null) {
    //    console.log(entidadeSrc, telefoneSrc, codigoSrc)
       console.log(options)
    try {
      const response = await this.api.send("get", "entidade/procura" + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?")  + "entidade=" + entidadeSrc + "&telefone=" + telefoneSrc + "&codigo=" + codigoSrc);

      return response;
    }
    catch (e) {
      return false;
    }
  }

  async procuraByMudanca(entidadeSrc, telefoneSrc, anoInicial, anoFinal, options) {
       console.log(entidadeSrc, telefoneSrc, anoInicial, anoFinal)
    try {
      const response = await this.api.send("get", "entidade/procuraByMudanca/" + entidadeSrc + "/" + telefoneSrc + "/" + anoInicial + "/" + anoFinal + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?"));

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
      var response = null;
      if (data.CODENT) {
        response = await this.api.send("put", "entidade/" + data.CODENT, data);
      }
      else {
        response = await this.api.send("post", "entidade", data);
      }

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