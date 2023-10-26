import APIService from "../APIService";

export default class TipoDocumentoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "tipoDocumento");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPDOC) {
    try {
      const response = await this.api.send("get", "tipoDocumento/" + CODTIPDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "tipoDocumento", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipoDocumento/" + data.CODTIPDOC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTIPDOC) {
    try {
      const response = await this.api.send("delete", "tipoDocumento/" + CODTIPDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}