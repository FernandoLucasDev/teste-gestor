import APIService from "./APIService";

export default class ProdutoCorService extends APIService {
  path = "produto-cor";

  async store(CodPro, data, file) {
    console.log("ProdutoCorService.store");
    try {
      let formData = new FormData();
      if (file) {
        formData.append("file", file);
      }  

      formData.append("CODCOR", data.CODCOR);

      const response = await this.send("post", "produto/" + CodPro + "/cor", formData);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async allWithPraca(CodPro, CodEnt) {
    try {
      const response = await this.send("get", "produto/" + CodPro + "/cor/" + CodEnt + "/praca");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(CodPro, id,) {
    console.log("ProdutoCorService.delete");
    try {
      const response = await this.send("delete", "produto/" + CodPro + "/cor/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}