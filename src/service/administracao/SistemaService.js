import APIService from "../APIService";

export default class SistemaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "sistema" );
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(sistemaSrc, options) {
    console.log('sistemaSrc :>> ', sistemaSrc);
    try {
      const response = await this.api.send("get", "sistema/procura" + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?") + (sistemaSrc != "" && sistemaSrc != null  ? "sistema=" + sistemaSrc: ""));
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodSis) {
    try {
      const response = await this.api.send("get", "sistema/" + CodSis);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "sistema", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "sistema/" + data.CODSIS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODSIS) {
    try {
      const response = await this.api.send("delete", "sistema/" + CODSIS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}