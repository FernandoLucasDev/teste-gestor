import APIService from "./APIService";

export default class PedidoEcommerceService extends APIService {
  async all(options) {
    try {
      const response = await this.send("get", "pedido-ecommerce" + this.serverSideOptionsFormat(options),
        
      );
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(id) {
    try {
      const response = await this.send("get", "pedido-ecommerce/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.send("post", "pedido-ecommerce", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async update(data) {
    try {
      const response = await this.send("put", "pedido-ecommerce/" + data.id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async approve(data) {
    try {
      const response = await this.send("post", "pedido-ecommerce/" + data.id + "/approve");
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async reject(data) {
    try {
      const response = await this.send("post", "pedido-ecommerce/" + data.id + "/reject", data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async reopen(data) {
    try {
      const response = await this.send("post", "pedido-ecommerce/" + data.id + "/reopen");
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async addItem(id, data) {
    try {
      const response = await this.send("post", "pedido-ecommerce/" + id + "/item", data);
      return response;
    }
    catch (e) {
      console.log(e);
      return e;
    }
  }

  async removeItem(id) {
    console.log("🚀 ~ file: PedidoEcommerceService.js:69 ~ PedidoEcommerceService ~ removeItem ~ id:", id)
    try {
      const response = await this.send("delete", "pedido-ecommerce/" + id + "/removeItem");
      return response;
    }
    catch (e) {
      return false;
    }
  }
   
  async delete(id) {
    try {
      const response = await this.send("delete", "pedido-ecommerce/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async pdf(id) {
    try {
      const response = await this.send("get", "pedido-ecommerce/" + id + "/pdf");
      return response;
    }
    catch (e) {
      return false;
    }
  }
}