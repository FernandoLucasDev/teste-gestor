import APIService from "../APIService";

export default class UsuarioService {  
  api = new APIService();

  async all(options) {
    try {
      const response = await this.api.send("get", "usuario" +  (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?"));
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(usuarioSrc, options) {
    console.log('usuarioSrc :>> ', usuarioSrc);
    try {
      const response = await this.api.send("get", "usuario/procura" + this.api.serverSideOptionsFormat(options));
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async procuraByUsuario(nomusu, options) {
    console.log('NOMUSU =>', nomusu);
    try {
      const response = await this.api.send("get", "usuario/procuraByUsuario/" + nomusu + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?"));

      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CodUsu) {
    try {
      const response = await this.api.send("get", "usuario/" + CodUsu);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async me() {
    try {
      const response = await this.api.send("get", "usuario/me");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    try {
      const response = await this.api.send("post", "usuario", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "usuario/" + data.CODUSU, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async theme(theme) {
    try {
      const response = await this.api.send("post", "usuario/theme", { theme : theme });
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async updatePassword(data) {
    try {
      const response = await this.api.send("post", "usuario/update-password", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODGRPUSU) {
    try {
      const response = await this.api.send("delete", "usuario/" + CODGRPUSU);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}