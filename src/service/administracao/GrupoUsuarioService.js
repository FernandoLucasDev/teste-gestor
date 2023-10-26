import APIService from "../APIService";

export default class GrupoUsuarioService {  
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "grupoUsuario");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(grupoUsuarioSrc) {
    console.log('grupoUsuarioSrc :>> ', grupoUsuarioSrc);
    try {
      const response = await this.api.send("get", "grupoUsuario/search" + "?DESGRPUSU=" + grupoUsuarioSrc.DESGRPUSU + "&ADMGRPUSU=" + grupoUsuarioSrc.ADMGRPUSU);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodGrpUsu) {
    try {
      const response = await this.api.send("get", "grupoUsuario/" + CodGrpUsu);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "grupoUsuario", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "grupoUsuario/" + data.CODGRPUSU, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODGRPUSU) {
    try {
      const response = await this.api.send("delete", "grupoUsuario/" + CODGRPUSU);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}