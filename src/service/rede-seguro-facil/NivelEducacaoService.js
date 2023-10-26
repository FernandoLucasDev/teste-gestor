import APIService from "../APIService";

export default class NivelEducacaoService {
  api = new APIService();

  async all() {
    try {
      const response = await this.api.send("get", "nivelEducacao");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODNIVEDU) {
    try {
      const response = await this.api.send("get", "nivelEducacao/" + CODNIVEDU);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.api.send("post", "nivelEducacao", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async update(data) {
    try {
      const response = await this.api.send("put", "nivelEducacao/" + data.CODNIVEDU, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(CODNIVEDU) {
    try {
      const response = await this.api.send("delete", "nivelEducacao/" + CODNIVEDU);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}