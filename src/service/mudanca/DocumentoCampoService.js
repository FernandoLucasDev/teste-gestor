import APIService from "../APIService";

export default class DocumentoCampoService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "documentoCampo");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src) {
    try {
      const response = await this.api.send("get", "documentoCampo/search/" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODDOC) {
    try {
      const response = await this.api.send("get", "documentoCampo/" + CODDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "documentoCampo", data);
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
        response = await this.api.send("put", "documentoCampo/" + data.CODDOC, data);
      }
      else {
        response = await this.api.send("post", "documentoCampo", data);
      }

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODDOC) {
    try {
      const response = await this.api.send("delete", "documentoCampo/" + CODDOC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}
