import APIService from "../APIService";

export default class DocumentoService {  
  api = new APIService();

  async all(options) {
    try {
      console.log("Entrou", this.api.serverSideOptionsFormat(options));
      // let url = "documento"  + (this.api.serverSideOptionsFormat(options) == (null || "undefined" )? "" : this.api.serverSideOptionsFormat(options));
      // console.log("ssr", this.api.serverSideOptionsFormat(options));
      let url = "documento/"  + this.api.serverSideOptionsFormat(options);
      console.log("Entrou2");
      const response = await this.api.send("get", url);
      console.log("Entrou3");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src) {
    try {
      const response = await this.api.send("get", "documento/search/" + src );
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODDOC) {
    try {
      const response = await this.api.send("get", "documento/" + CODDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async getPDF(CODDOC) {
    try {
      const response = await this.api.send("get", "documento/pdf/" + CODDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "documento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    console.log(data)
    try {
      var response = null;
      if (data.CODDOC) {
        response = await this.api.send("put", "documento/" + data.CODDOC, data);
      }
      else {
        response = await this.api.send("post", "documento", data);
      }

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODDOC) {
    try {
      const response = await this.api.send("delete", "mudanca/" + CODDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}
