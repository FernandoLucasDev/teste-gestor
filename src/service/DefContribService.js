import APIService from "./APIService";

export default class DefContribService extends APIService {
  api = new APIService();
  path = "defcontrib"

  async all() {
    try {
      const response = await this.api.send("get", "defcontrib");
      return response;
    }
    catch (e) {
      console.log(e);
      return false;
    }
  }

  async search(term, src) {
    try {
      const response = await this.api.send("get", "contato/search?" + term + "=" + src);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(CODDFC) {
    try {
      const response = await this.api.send("get", "defcontrib/" + CODDFC);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.api.send("post", "defcontrib", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }


  async update(data) {
    try {
      const response = await this.send("put", "defcontrib/" + data.CODDFC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(data) {
    try {
      console.log(data);
      const response = await this.api.send("delete", "defcontrib/" + data.CODDFC);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}