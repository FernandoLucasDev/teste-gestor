import APIService from "../APIService";

export default class FuncionarioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "funcionario");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODFUN) {
    try {
      const response = await this.api.send("get", "funcionario/" + CODFUN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "funcionario", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "funcionario/" + data.CODFUN, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODFUN) {
    try {
      const response = await this.api.send("delete", "funcionario/" + CODFUN);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}