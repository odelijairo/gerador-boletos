const path = require('path');
const StringUtils = require('../../utils/string-utils')
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

const Unicred = (function () {
  const NUMERO_UNICRED = '136';
  const DIGITO_UNICRED = '8';

  function Unicred() { }

  Unicred.prototype.getTitulos = function () {
    return {
      localDoPagamento: 'Local de Pagamento',
      especieDoDocumento: 'Espécie',
      instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
      agenciaECodigoDoBeneficiario: 'Agência/Cód. Beneficiário',
      valorDoDocumento: 'Valor Documento',
      igualDoValorDoDocumento: '',
      nomeDoPagador: 'Nome do Pagador'
    };
  };

  Unicred.prototype.exibirReciboDoPagadorCompleto = function () {
    return false;
  };

  Unicred.prototype.exibirCampoCip = function () {
    return false;
  };

  Unicred.prototype.geraCodigoDeBarrasPara = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    const campoLivre = [];
    
    campoLivre.push(pad(beneficiario.getAgenciaFormatada(), 4, '0'));
    campoLivre.push(this.getCodigoFormatado(beneficiario));
    campoLivre.push(pad(beneficiario.getDigitoCodigoBeneficiario(), 1, '0'));
    campoLivre.push(pad(this.getNossoNumeroFormatado(beneficiario), 10, '0'));
    campoLivre.push(pad(beneficiario.getDigitoNossoNumero(), 1, '0'));

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre.join(''));
  }

  Unicred.prototype.getNumeroFormatadoComDigito = function () {
    return [NUMERO_UNICRED, DIGITO_UNICRED].join('-');
  }

  Unicred.prototype.getCarteiraFormatado = function (beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  Unicred.prototype.getCarteiraTexto = function (beneficiario) {
    return this.getCarteiraFormatado(beneficiario);
  }

  Unicred.prototype.getCodigoFormatado = function (beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 9, '0');
  }

  Unicred.prototype.getImagem = function () {
    return path.join(__dirname, 'logotipos/unicred.png');
  }

  Unicred.prototype.getNossoNumeroFormatado = function (beneficiario) {
    return pad(beneficiario.getNossoNumero(), 10, '0');
  }

  Unicred.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
    const beneficiario = boleto.getBeneficiario();

    return [
      this.getNossoNumeroFormatado(beneficiario),
      beneficiario.getDigitoNossoNumero()
    ].join('-');
  }

  Unicred.prototype.getNumeroFormatado = function () {
    return NUMERO_UNICRED;
  }

  Unicred.prototype.getNome = function () {
    return 'Unicred';
  }

  Unicred.prototype.getImprimirNome = function () {
    return false;
  }

  Unicred.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
    let codigo = this.getCodigoFormatado(beneficiario);


    if (digitoCodigo) {
      codigo += '-' + digitoCodigo;
    }

    return beneficiario.getAgenciaFormatada() + '/' + codigo;
  }

  Unicred.novoUnicred = function () {
    return new Unicred();
  }

  return Unicred;
})();

module.exports = Unicred;
