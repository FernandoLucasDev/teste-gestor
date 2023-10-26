import APIService from "./APIService";

export default class ProdutoService extends APIService {
  path = "produto";
  
  async upload(CodPro, files) {
    try {
      let formData = new FormData();
      formData.append("files[]", files)
      // files.map(file => formData.append("files[]", file));

      const response = await this.send("post", this.path + "/" + CodPro + "/upload", formData);
      return response;
    }
    catch (e) {
      return e;
    }
  }
  
  async image(CodPro) {
    try {

      const response = await this.api.send("get", this.path + "/" + CodPro + "/image");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async buscaTodos() {
    try {

      const response = await this.send("get", this.path + "/lista");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async removeImage(id) {
    try {
      const response = await this.send("post", this.path+ "/" + id + "/remove-image");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async all(options, CodEnt) {
    try {
      const response = await this.send("get", this.path + this.serverSideOptionsFormat(options) + (options == {} ? "&" : "?") + (CodEnt ? "CODENT=" + CodEnt : ""));
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async getTamanhos(CodPro) {
    try {
      const response = await this.send("get", "produto/" + CodPro + "/tamanhos");
      return response;
    }
    catch (e) {
      return false;
    }
  }
}