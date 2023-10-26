import APIService from "../APIService";

export default class MandatoService {
   api = new APIService();

   async all() {
      try {
         const response = await this.api.send("get", "mandato");
         return response;
      }
      catch (e) {
         return false
      }
   }

   async get(CODMAN) {
      try {
         const response = await this.api.send("get", "mandato/" + CODMAN);
         return response;
      }
      catch (e) {
         return false;
      }
   }

   async store(data) {
      try {
         const response = await this.api.send("post", "mandato", data);
         return response;
      }
      catch (e) {
         return false;
      }
   }

   async update(data) {
      try {
         const response = await this.api.send("put", "mandato/" + data.CODMAN, data);
         return response;
      }
      catch (e) {
         return false;
      }
   }

   async delete(CODMAN) {
      try {
         const response = await this.api.send("delete", "mandato/" + CODMAN);
         return response;
      }
      catch (e) {
         return false;
      }
   }
}