import APIService from "../APIService";

export default class MotivoRecisaoService {
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "recisao");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODMOT) {
    try {
      const response = await this.api.send("get", "recisao/" + CODMOT);
      return response;
    }
    catch (e) {
      return false;
    }
  }

 async store(data) {
    try {
      const response = await this.api.send("post", "recisao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  update(data) {
    try {
      const response = this.api.send("put", "recisao/" + data.CODMOT, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(CODMOT) {
    try {
      const response = await this.api.send("delete", "recisao/" + CODMOT);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}