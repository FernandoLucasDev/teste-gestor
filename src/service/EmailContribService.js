import axios from "axios";

export default class EmailContribService {

  static getTypeEmail() {
    const apiUrl = 'http://localhost/contrib/getEmailTypes';

    const config = {
      method: 'get',
      url: apiUrl,
    };
  
    return axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error('Erro na requisição:', error);
      });
  }

  static getDataToEmailList(codemp, codent, coddfc) {

    const apiUrl = 'http://localhost/contrib/sendEmail';
    const data = {
      CODEMP: codemp,
      CODENT: codent,
      CODDFC: coddfc,
    };
    const config = {
      method: 'post',
      url: apiUrl,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    return axios(config)
      .then(function (response) {
        console.log('Resposta da API:', response.data);
        console.log('Resposta da API 2:', response);
        return response.data;
      })
      .catch(function (error) {
        console.error('Erro na requisição:', error);
      });
  }
  

  static sendToEmailRow(selectedValues) {

    const apiUrl = 'http://localhost/contrib/saveEmail';
    const data = {
      data: selectedValues
    };
    const config = {
      method: 'post',
      url: apiUrl,
      data: data,
      headers: {
        'Content-Type': 'application/json',
      },
    };


    axios.post(config)
    .then(response => {
      console.log('RESPONSE POST:');
      console.log(response);
    })
    .catch(error => {
      console.log('RESPONSE ERRO:');
      console.log(error);
    });
  }
  
}
