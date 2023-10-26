import APIService from "./APIService";

export default class EmpresaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "empresa");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodEmp) {
    try {
      const response = await this.api.send("get", "empresa/" + CodEmp);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async getDefault() {
    try {
      const response = await this.api.send("get", "empresa-default");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async change(CodEmp) {
    try {
      const response = await this.api.send("get", "empresa-change/" + CodEmp);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}