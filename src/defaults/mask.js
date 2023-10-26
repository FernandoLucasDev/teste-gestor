export const cpfMask = value => {
    if (!value) return;
    return value.toString()
    // .padStart(11, "0")
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export const cnpjMask = value => {
    return value
    .toString()
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,4})/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}
// CNPJ: ###.###.###/####-##
// CPF: ###.###.###-##
// CEI: ##.#######.##-##
// 24.792.26153/87
export const ceiMask = value => {
    return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{5})(\d{1,2})/, '$1/$2')
    .replace(/(\/\d{2})\d+?$/, '$1')
}

export const cepMask = value => {
    return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2');    
}

export const telefoneMask = value => {
    let retorno = value;
    let ddd = "";
    let numero = "";
    if(retorno.length > 8){
        retorno = retorno.replace("(", "");
        retorno = retorno.replace(")", "");
        retorno = retorno.replace("-", "");
        retorno = retorno.replaceAll(" ", "");
    }
    retorno = retorno.split('');
    if(retorno.length > 9){
      ddd = retorno.slice(0, 2);
      ddd.unshift("(");
      ddd.push(")");
      ddd = ddd.join("")
      numero = retorno.slice(2);
      console.log(ddd);
      console.log(numero);
    }

    // if((numero[0] == 6 || numero[0] == 7 || numero[0] == 8 || numero[0] == 9) && numero.length == 8){
    //   numero.unshift("9");
    // }
    if(retorno.length > 10){
        numero.splice(5, 0, '-');
    }else{
        numero.splice(4, 0, '-');
    }
    numero = numero.join("");
    retorno = ddd + " " + numero;
    
    return retorno
}