import PermissaoService from "../service/PermissaoService";

const PermissaoMixin = {
  data : function () {
    return {
      permissoes : [],
      permissoesService : null,
    };
  },
  created() {
    this.permissoesService = new PermissaoService();
  },
  methods : {
    loadPermissoes(CodTar) {
      this.permissoesService.get(CodTar)
      .then(
        resp => this.permissoes = resp
      );
    },
    getPermissoes() {
      return this.permissoes;
    },
    canInsert() {
      return (this.permissoes.INCPER == "S");
    },
    canUpdate() {
      return (this.permissoes.ALTPER == "S");
    },
    canDelete() {
      return (this.permissoes.EXCPER == "S");
    }
  }
};


export default PermissaoMixin;