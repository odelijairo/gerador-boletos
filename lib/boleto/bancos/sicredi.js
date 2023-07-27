const path = require('path');
const StringUtils = require('../../utils/string-utils')
const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

const Sicredi = (function () {
  const NUMERO_SICREDI = '748';
  const DIGITO_SICREDI = 'X';
  const MULTIPLIERS = [2, 3, 4, 5, 6, 7, 8, 9]

  function Sicredi() { }

  Sicredi.prototype.getTitulos = function () {
    return {
      instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
      nomeDoPagador: 'Pagador',
      especie: 'Moeda',
      quantidade: 'Quantidade',
      valor: 'x Valor',
      moraMulta: '(+) Moras / Multa'
    };
  };

  Sicredi.prototype.exibirReciboDoPagadorCompleto = function () {
    return false;
  };

  Sicredi.prototype.exibirCampoCip = function () {
    return false;
  };

  Sicredi.prototype.geraCodigoDeBarrasPara = boleto => {
    const beneficiario = boleto.getBeneficiario();
    const errorMsg = 'Erro ao gerar código de barras,';

    if (!beneficiario.getNossoNumero() || beneficiario.getNossoNumero().length != 8)
      throw new Error(`${errorMsg} nosso número não possui 8 dígitos: ${beneficiario.getNossoNumero()}`);
    if (beneficiario.getDigitoNossoNumero().length !== 1)
      throw new Error(`${errorMsg} digito nosso número é obrigatório: ${beneficiario.getDigitoNossoNumero()}`);
    if (beneficiario.getCodigoBeneficiario().length !== 5)
      throw new Error(`${errorMsg} código beneficiario não possui 5 dígitos: ${beneficiario.getCodigoBeneficiario()}`);

    const campoLivre = [];
    campoLivre.push("1"); // Código numérico correspondente ao tipo de cobrança: “1” – Com Registro
    campoLivre.push("1"); // Código numérico correspondente ao tipo de carteira: “1” - carteira simples
    campoLivre.push(beneficiario.getNossoNumero());
    campoLivre.push(beneficiario.getDigitoNossoNumero());
    campoLivre.push(beneficiario.getAgenciaFormatada());
    campoLivre.push(beneficiario.getPostoBeneficiario());
    campoLivre.push(beneficiario.getCodigoBeneficiario());
    campoLivre.push("1");
    campoLivre.push("0"); // filler
    campoLivre.push(digitoVerificatorCampoLivre(campoLivre.join('')));

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  const digitoVerificatorCampoLivre = (campoLivre) => {
    let currentIndex = 0;
    let somatorio = 0;

    for (let i = campoLivre.length - 1; i >= 0; i--) {
      const currentNum = Number(campoLivre.charAt(i))

      currentIndex = currentIndex === MULTIPLIERS.length ? 0 : currentIndex
      const currentMultiplier = MULTIPLIERS[currentIndex]

      somatorio += currentNum * currentMultiplier

      currentIndex++
    }
    const resto = somatorio % 11

    return resto === 0 || resto === 1 ? '0' : 11 - resto;
  }

  Sicredi.prototype.getNumeroFormatadoComDigito = function () {
    return [NUMERO_SICREDI, DIGITO_SICREDI].join('-');
  }

  Sicredi.prototype.getNumeroFormatado = function () {
    return NUMERO_SICREDI;
  }

  Sicredi.prototype.getCarteiraFormatado = function (beneficiario) {
    return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
  }

  Sicredi.prototype.getCarteiraTexto = function (beneficiario) {
    return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
  }

  Sicredi.prototype.getCodigoFormatado = function (beneficiario) {
    return StringUtils.pad(beneficiario.getCodigoBeneficiario(), 5, '0');
  }

  Sicredi.prototype.getImagem = function () {
    return path.join(__dirname, 'logotipos/sicredi.png');
  }

  Sicredi.prototype.getNossoNumeroFormatado = function (beneficiario) {
    const nossoNumero = beneficiario.getNossoNumero();
    const digitoNossoNumero = beneficiario.getDigitoNossoNumero();
    return `${nossoNumero.substring(0, 2)}/${nossoNumero.substring(2, nossoNumero.length)}-${digitoNossoNumero}`
  }

  Sicredi.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    return this.getNossoNumeroFormatado(beneficiario)
  }

  Sicredi.prototype.getNome = function () {
    return 'Sicredi';
  }

  Sicredi.prototype.getImprimirNome = function () {
    return false;
  }

  Sicredi.prototype.getLocaisDePagamentoPadrao = function () {
    return ['PAGAVEL PREFERENCIALMENTE EM CANAIS ELETRONICOS DA SUA INSTITUICAO FINANCEIRA.']
  }

  Sicredi.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    const postoBeneficiario = beneficiario.getPostoBeneficiario() || "00"

    return `${beneficiario.getAgenciaFormatada()}.${postoBeneficiario}.${this.getCodigoFormatado(beneficiario)}`;
  }

  Sicredi.novoSicredi = function () {
    return new Sicredi();
  }

  return Sicredi;
})();

module.exports = Sicredi;
