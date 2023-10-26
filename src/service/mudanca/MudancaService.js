import APIService from "../APIService";

export default class MudancaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "mudanca");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async search(src) {
    try {
      const response = await this.api.send("get", "mudanca/search/" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodMud) {
    try {
      const response = await this.api.send("get", "mudanca/" + CodMud);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async geraPDF(CODDOC, data) {
    try {
      console.log("data",data);
      const response = await this.api.send("post", "mudanca/pdf/" + CODDOC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      var response = null;
      if (data.NUMMUD) {
        response = await this.api.send("put", "mudanca/" + data.NUMMUD, data);
      }
      else {
        response = await this.api.send("post", "mudanca", data);
      }

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
      if (data.NUMMUD) {
        response = await this.api.send("put", "mudanca/" + data.NUMMUD, data);
      }
      else {
        response = await this.api.send("post", "mudanca", data);
      }

      return response;
    }
    catch (e) {
      return false;
    }
  
  }
  async cancela(data) {
    console.log(data)
    try {
      var response = null;
      response = await this.api.send("put", "mudanca/cancela/" + data.NUMMUD, data);

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(NumMud) {
    try {
      const response = await this.api.send("delete", "mudanca/" + NumMud);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}
