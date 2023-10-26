import APIService from "./APIService";

export default class PedidoEcommerceCarrinhoService extends APIService {  
  path = "pedido-ecommerce-carrinho";

  async get() {
    try {
      const response = await this.send("get", "pedido-ecommerce-carrinho");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async addItem(data) {
    try {
      const response = await this.send("post", "pedido-ecommerce-carrinho-item", data);
      return response;
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }
  
  async updateItem(id, data) {
    try {
      const response = await this.send("put", "pedido-ecommerce-carrinho-item/" + id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async removeItem(id) {
    try {
      const response = await this.send("delete", "pedido-ecommerce-carrinho-item/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }

   
  async delete() {
    try {
      const response = await this.send("delete", "pedido-ecommerce-carrinho/1");
      return response;
    }
    catch (e) {
      return false;
    }
  }
}