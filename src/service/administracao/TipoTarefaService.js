import APIService from "../APIService";

export default class TipoTarefaService {  
  api = new APIService();

  async all(options) {
    try {
      const response = await this.api.send("get", "tipo-tarefa" + this.api.serverSideOptionsFormat(options));
      
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(usuarioSrc, options) {
    console.log('usuarioSrc :>> ', usuarioSrc);
    try {
      const response = await this.api.send("get", "usuario/procura" + (options ? (this.api.serverSideOptionsFormat(options) == "" ? "?" : this.api.serverSideOptionsFormat(options)  + "&") : "?") + (usuarioSrc != "" && usuarioSrc != null  ? "usuario=" + usuarioSrc: ""));
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTIPTAR) {
    try {
      const response = await this.api.send("get", "tipo-tarefa/" + CODTIPTAR);
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
      const response = await this.api.send("post", "tipo-tarefa", data);
      return response;
    }
    catch (e) {
      return false;
    }

  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tipo-tarefa/" + data.CODTIPTAR, data);
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
  
  async delete(CODTIPTAR) {
    try {
      const response = await this.api.send("delete", "tipo-tarefa/" + CODTIPTAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}