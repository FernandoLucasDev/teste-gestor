import APIService from "./APIService";

export default class IcontribuiReportService extends APIService {
  async ResumoMensalBeneficios(data) {
    try {
      const response = await this.send("post", "report/resumo-mensal-beneficios", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
}