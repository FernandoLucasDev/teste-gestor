import MenuService from '../service/MenuService';
import PermissaoService from '../service/PermissaoService';

const MenuMixin = {
  data : function () {
    return {
      menu : [],
      service : null,
      permissoes: []
    };
  },
  created: function () {
    this.service = new MenuService(); 
    this.permissaoService = new PermissaoService(); 
    this.menuLoad();
  },
  methods: {
    async menuLoad () {
      const res = await this.service.get();
      this.permissoes = await this.permissaoService.my();

      let data = res.data;
      let _menu = [
          {
              label: 'Menu', icon: 'pi pi-fw pi-sitemap',
              items : []
          }
      ];
      // console.log("lista permissoes",data);
      // console.log("_menu",_menu);
      
      // Sorting menu
      data.sort((entry, entry1) => {
          if (!entry.sistema) return -1;
          if (!entry1) return 1;
          if (!entry1.sistema) return 1;

          return entry.sistema.NOMSIS.localeCompare(entry1.sistema.NOMSIS);
      });
      data.map(
          (entry) => {
              if (!entry.sistema) return;
              let manutencao = entry.sistema.tarefas.filter((task) => task.CODTIPTAR == "MT");
              // manutencao = this.ordena(manutencao);
              let digitacao = entry.sistema.tarefas.filter((task) => task.CODTIPTAR == "DG");
              let consulta = entry.sistema.tarefas.filter((task) => task.CODTIPTAR == "CT");
              let processamento = entry.sistema.tarefas.filter((task) => task.CODTIPTAR == "PR");
              let relatorio = entry.sistema.tarefas.filter((task) => task.CODTIPTAR == "RL");

              let tarManutencao = manutencao ? this.ordena(this.menuItems(entry.sistema.NOMSIS, manutencao)) : [];
              let tarConsulta = consulta ? this.ordena(this.menuItems(entry.sistema.NOMSIS, consulta)) : [];
              let tarDigitacao = digitacao ? this.ordena(this.menuItems(entry.sistema.NOMSIS, digitacao)): [];
              let tarProcessamento = processamento ? this.ordena(this.menuItems(entry.sistema.NOMSIS, processamento)): [];
              let tarRelatorio = relatorio ? this.ordena(this.menuItems(entry.sistema.NOMSIS, relatorio)) : [];
              let subItensSistema = [];
              // Pegando as tarefas
              let mt = {label: 'Manutenção', icon: 'fa-solid fa-marker', items : tarManutencao.length > 0 ? tarManutencao : []};
              let ct = {label: 'Consulta', icon: 'fa-solid fa-search',items : tarConsulta.length > 0 ? tarConsulta : []};
              let dg = {label: 'Digitação', icon: 'fa-regular fa-keyboard',items : tarDigitacao.length > 0 ? tarDigitacao: []};
              let pr = {label: 'Processamento', icon: 'fa-solid fa-wrench',items : tarProcessamento.length > 0 ? tarProcessamento : []};
              let rl = { label: 'Relatório', icon: 'fa-solid fa-file-lines', items : tarRelatorio.length > 0 ? tarRelatorio : []};
              // icon: 'fa-solid fa-file-lines'
              if(mt.items.length > 0){
                subItensSistema.push(mt);
              }
              if(ct.items.length > 0){
                subItensSistema.push(ct);
              }
              if(dg.items.length > 0){
                subItensSistema.push(dg);
              }
              if(pr.items.length > 0){
                subItensSistema.push(pr);
              }
              if(rl.items.length > 0){
                subItensSistema.push(rl);
              }

              let NomSis = entry.sistema.NOMSIS.toLowerCase();
              let IcoSis = entry.sistema.ICOSIS.toLowerCase();

              NomSis = (NomSis[0].toUpperCase()+NomSis.substr(1)).normalize("NFD");

              let sistema = {
                label : NomSis,
                icon: IcoSis,
                items : subItensSistema
                  // [
                      // {
                      //     label: 'Manutenção', icon: 'fa-solid fa-marker',
                      //     items : manutencao ? 
                      //         this.menuItems(entry.sistema.NOMSIS, manutencao)
                      //     : []
                      // },
                    //   // {
                    //   //     label: 'Consulta', icon: 'fa-solid fa-search',
                    //   //     items : consulta ? 
                    //   //         consulta
                    //   //         .map((task) => ({label : task.DESTAR, to : task.CODTAR}))
                    //   //     : []
                    //   // },
                    //   // {
                    //   //     label: 'Digitação', icon: 'fa-regular fa-keyboard',
                    //   //     items : digitacao ? 
                    //   //         this.menuItems(entry.sistema.NOMSIS, digitacao)
                    //   //     : []
                    //   // },
                    //   // {
                    //   //     label: 'Processamento', icon: 'fa-solid fa-wrench',
                    //   //     items : processamento ? 
                    //   //         this.menuItems(entry.sistema.NOMSIS, processamento)
                    //   //     : []
                    //   // },
                    //   // {
                    //   //     label: 'Relatório', 
                    //   //     //icon: 'fa-regular fa-list',
                    //   //     items : relatorio ? 
                    //   //         relatorio
                    //   //         .map((task) => ({label : task.DESTAR, to : task.CODTAR}))
                    //   //     : []
                    //   // },
                  // ]
              };
              
              // console.log("🚀 ~ file: Menu.js:126 ~ menuLoad ~ sistema:", sistema)
              _menu[0].items.push(sistema);
          }
          
      );
      this.menu = _menu;
    },

    ordena(itens){
      // console.log(itens);
      itens.sort((entry, entry1) => {
        if (!entry.label) return -1;
          if (!entry1) return 1;
          if (!entry1.label) return 1;

          return entry.label.localeCompare(entry1.label);
    
        // return 0; // A e B são iguais em termos de ordenação
      });
    
      return itens; // Retorna os itens ordenados
    },

    menuItems(sistema, menu) {
        let retorno =  [];
        menu
        // .map((task) => {
        .forEach((task) => {
            // console.log("task >>>> ",task);
            // se a task.CODTAR existir no ngc da tarefa ent inclui ela
            if(this.permissoes.find(element => element.CODTAR === task.CODTAR)){
              // return{
              retorno.push({
                  label : this.toTitleCase(task.TITTAR ?? task.DESTAR), 
                  to : "/" + (sistema.toLowerCase().replaceAll(" ", "-") + "/" + task.CODTAR.toLowerCase()).normalize("NFD")
              })
            }
          }
        );
        return retorno;
    },

    toTitleCase(str) {
      if (!str) return "";

      return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    },

    getPermissoes() {
    //   console.log("getPermissoes");
      //console.log(this.menu);
    }
  }
};

export default MenuMixin;