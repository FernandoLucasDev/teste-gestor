import axios from "axios";

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default class APIService {
  path = "";
  result;
  controller = new AbortController();
  
  getHost() {
    return process.env.VUE_APP_API_URL;
  }

  abort() {
    this.controller.abort();

    this.controller = new AbortController();
  }

  async send(method, path, params) {
    try {
      const response = await axios({
        method: method,
        url: process.env.VUE_APP_API_URL + path,
        data : params ?? null,
        signal: this.controller.signal
      });
      return response.data;
    }
    catch (e) {
      this.result = e;
      return false;
    }
  }

  serverSideOptionsFormat(options) {
    let src = [];
    if (options) {
      if (options.page) {
        src.push("page=" + options.page);
      }
      if (options.sortField) {
        src.push("sortField=" + options.sortField);
      }
      if (options.sortOrder) {
        src.push("sortOrder=" + options.sortOrder);
      }
      // if (options.filters) {
      //   if (options.filters.global.value != null && options.filters.global.value != "" && options.filters.global.value != undefined) {
      //     src.push(options.filters.global.campo + "=" + options.filters.global.value);
      //   }
      // }
      if (options.query) {
        src.push("query=" + JSON.stringify(options.query));
      }
    }

    if (src.length) {
      return "?" + src.join("&");
    }

    return "";
  }


  /// Defaults methods
  async all(options) {
    try {
      const response = await this.send("get", this.path + (options ? this.serverSideOptionsFormat(options) : ""),
        
      );
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async get(id) {
    try {
      const response = await this.send("get", this.path + "/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  async store(data) {
    try {
      const response = await this.send("post", this.path, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async update(data) {
    try {
      const response = await this.send("put", this.path + "/" + data.id, data);
      return response;
    }
    catch (e) {
      return false;
    }
  }
  
  async delete(id) {
    try {
      const response = await this.send("delete", this.path + "/" + id);
      return response;
    }
    catch (e) {
      return false;
    }
  }

  getResult() {
    return this.result;
  }
}