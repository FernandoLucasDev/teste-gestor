import APIService from "./APIService";

export default class TraducaoService {  
  api = new APIService();

  data = null;

  async once() {
    try {
      const response = await this.api.send("get", "traducao/all");
      this.data = response;
      return response;
    }
    catch (e) {
      return false;
    }
  }

  translate() {
    console.log(this.data);
  }

  async all() {
    try {
      const response = await this.api.send("get", "traducao");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(SEQTRA) {
    try {
      const response = await this.api.send("get", "traducao/" + SEQTRA);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "traducao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      // console.log("data=>", data);
      const response = await this.api.send("put", "traducao/" + data.CODIDI + "/" + data.SEQTRA, data);
      // const response = await this.api.send("put", "traducao/" + data.SEQTRA, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(data) {
    try {
      console.log("data =>", data);
      const response = await this.api.send("delete", "traducao/" + data.CODIDI + "/" + data.SEQTRA);
      // const response = await this.api.send("delete", "traducao/" + data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}