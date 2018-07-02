const path = require('path');
const StringUtils = require('../../utils/string-utils')
const pad = StringUtils.pad;
const insert = StringUtils.insert;

const geradorDeDigitoPadrao = require('../geradorDeDigitoPadrao');
const CodigoDeBarrasBuilder = require('../codigoDeBarrasBuilder');

const Cecred = (function() {
  const NUMERO_CECRED = '085';
  const DIGITO_CECRED = '0';

  function Cecred() {}

  Cecred.prototype.getTitulos = function() {
    return {
      instrucoes: 'Informações de responsabilidade do beneficiário',
      nomeDoPagador: 'Nome do Pagador',
      especie: 'Moeda',
      quantidade: 'Quantidade',
      valor: 'Valor',
      moraMulta: '(+) Juros / Multa'
    };
  };

  Cecred.prototype.exibirReciboDoPagadorCompleto = function() {
    return true;
  };

  Cecred.prototype.exibirCampoCip = function() {
    return true;
  };

  Cecred.prototype.getGeradorDeDigito = function() {
    return geradorDeDigitoPadrao;
  }

  Cecred.prototype.geraCodigoDeBarrasPara = boleto => {
    const beneficiario = boleto.getBeneficiario();
    const errorMsg = 'Erro ao gerar código de barras,';

    if (beneficiario.getNumeroConvenio().length != 6)
      throw new Error(`${errorMsg} número convênio da cooperativa não possui 6 dígitos: ${beneficiario.getNumeroConvenio()}`);
    if (beneficiario.getNossoNumero().length != 17)
      throw new Error(`${errorMsg} nosso número não possui 17 dígitos: ${beneficiario.getNossoNumero()}`);
    if (beneficiario.getCarteira().length != 2)
      throw new Error(`${errorMsg} código carteira não possui 2 dígitos: ${beneficiario.getCarteira()}`);

    const campoLivre = [];
    campoLivre.push(beneficiario.getNumeroConvenio());
    campoLivre.push(beneficiario.getNossoNumero());
    campoLivre.push(beneficiario.getCarteira());
    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  Cecred.prototype.getNumeroFormatadoComDigito = function() {
    return [NUMERO_CECRED, DIGITO_CECRED].join('-');
  }

  Cecred.prototype.getNumeroFormatado = function() {
    return NUMERO_CECRED;
  }

  Cecred.prototype.getCarteiraFormatado = function(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  Cecred.prototype.getCarteiraTexto = function(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  Cecred.prototype.getCodigoFormatado = function(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  }

  Cecred.prototype.getImagem = function() {
    return path.join(__dirname, 'logotipos/cecred.png');
  }

  Cecred.prototype.getNossoNumeroFormatado = function(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 11, '0');
  }

  Cecred.prototype.getNossoNumeroECodigoDocumento = function(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return this.getCarteiraFormatado(beneficiario) + '/' + [
      this.getNossoNumeroFormatado(beneficiario),
      beneficiario.getDigitoNossoNumero()
    ].join('-');
  }

  Cecred.prototype.getNome = function() {
    return 'Cecred';
  }

  Cecred.prototype.getImprimirNome = function() {
    return false;
  }

  Cecred.prototype.getAgenciaECodigoBeneficiario = function(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
    let codigo = this.getCodigoFormatado(beneficiario);

    if (digitoCodigo) codigo += '-' + digitoCodigo;

    const agenciaComDigito = beneficiario.getAgenciaFormatada() + '-' + beneficiario.getDigitoAgencia();

    return agenciaComDigito + '/' + codigo;
  }

  Cecred.novoCecred = function() {
    return new Cecred();
  }

  return Cecred;
})();

module.exports = Cecred;
