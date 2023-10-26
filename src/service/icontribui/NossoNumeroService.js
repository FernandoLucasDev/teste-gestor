import APIService from "../APIService";

export default class NossoNumeroService {
  api = new APIService();
  path = "icontribui"
  async all(CodDfc) {
    try {
      const response = await this.api.send("get", "nosso-numero?CodDfc=" + CodDfc);
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
      const response = await this.api.send("get", "nosso-numero/" + CODDFC);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.api.send("post", "nosso-numero", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }


  async update(data) {
    try {
      const response = await this.api.send("put", "nosso-numero/" + data.CODDFC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async delete(data) {
    try {
      console.log(data);
      const response = await this.api.send("delete", "nosso-numero/" + data.CODDFC, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}