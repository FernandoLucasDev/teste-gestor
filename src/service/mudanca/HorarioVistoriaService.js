import APIService from "../APIService";

export default class HorarioVistoriaService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "horarioVistoria");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async allFree(NUMMUD, DATVIS) {
    try {
      const response = await this.api.send("get", "horarioVistoria/getAll?nummud=" + NUMMUD + "&datvis=" + DATVIS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODVIS) {
    try {
      const response = await this.api.send("get", "horarioVistoria/" + CODVIS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "horarioVistoria", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "horarioVistoria/" + data.CODVIS, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODVIS) {
    try {
      const response = await this.api.send("delete", "horarioVistoria/" + CODVIS);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}
