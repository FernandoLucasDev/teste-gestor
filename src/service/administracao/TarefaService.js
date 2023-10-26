import APIService from "../APIService";

export default class TarefaService {  
  api = new APIService();

  async all(options, DESTAR = "") {
    console.log("optionsoptionsoptionsoptions", options);
    if(options)
      console.log("optionsoptionsoptionsoptions", options.filters.global);
    try {
      const response = await this.api.send("get", "tarefa" + (DESTAR != "" ? "?DESTAR=" + DESTAR : "") + this.api.serverSideOptionsFormat(options));
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async search(options) {
    try {
      const response = await this.api.send("get", "tarefa/search" + "?CODSIS=" + options.CODSIS + (options.CODGRPUSU ? "&CODGRPUSU=" + options.CODGRPUSU : ""));
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async get(CODTAR) {
    try {
      const response = await this.api.send("get", "tarefa/" + CODTAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async store(data) {
    data.CODTIPTAR = "MT";
    try {
      const response = await this.api.send("post", "tarefa", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.api.send("put", "tarefa/" + data.CODTAR, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CODTAR) {
    try {
      const response = await this.api.send("delete", "tarefa/" + CODTAR);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}