const path = require('path');
const fs = require('fs');
const boletoModule = require('../../../lib/boletoUtils.js');
const Sicredi = require('../../../lib/boleto/bancos/sicredi');
const geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js');
const GeradorDeBoleto = require('../../../lib/boleto/gerador-de-boleto.js');

const Datas = boletoModule.Datas;
const Endereco = boletoModule.Endereco;
const Beneficiario = boletoModule.Beneficiario;
const Pagador = boletoModule.Pagador;
const Boleto = boletoModule.Boleto;

module.exports = {
  setUp: function (done) {
    const datas = Datas.novasDatas();
    datas.comDocumento(1, 2, 2016);
    datas.comProcessamento(1, 2, 2016);
    datas.comVencimento(10, 2, 2016);

    pagador = Pagador.novoPagador();
    pagador.comNome('BASILIO ANTONIO CAMPANHOLO');
    pagador.comRegistroNacional('26018683172');

    beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
    beneficiario.comRegistroNacional('21202793000100');
    beneficiario.comAgencia('4155');
    beneficiario.comCarteira('1');
    beneficiario.comCodigoBeneficiario('01060');
    beneficiario.comNossoNumero('23200123');
    beneficiario.comDigitoNossoNumero('4');
    beneficiario.comPostoBeneficiario('08');

    banco = new Sicredi();

    boleto = Boleto.novoBoleto();
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(1200);
    boleto.comNumeroDoDocumento(103);

    done();
  },

  'Nosso número formatado deve ter 11 digitos': function (test) {
    const beneficiario = Beneficiario.novoBeneficiario()
      .comNossoNumero('23200123')
      .comDigitoNossoNumero('4');
    const numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);

    test.equals(11, numeroFormatado.length);
    test.equals('23/200123-4', numeroFormatado);
    test.done();
  },

  'Carteira formatado deve ter 2 dígitos': function (test) {
    const beneficiario = Beneficiario.novoBeneficiario().comCarteira('1');
    const carteiraFormatada = banco.getCarteiraFormatado(beneficiario);

    test.equals(2, carteiraFormatada.length);
    test.equals('01', carteiraFormatada);
    test.done();
  },

  'Conta corrente formatada deve ter 5 dígitos': function (test) {
    const codigoFormatado = banco.getCodigoFormatado(beneficiario);

    test.equals(5, codigoFormatado.length);
    test.equals('01060', codigoFormatado);
    test.done();
  },

  'Verifica geração da linha digitável - 1': function (test) {
    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = "74891.12321 00123.441552 08010.601014 1 67000000120000";

    test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
    test.done();
  },

  'Verifica geração da linha digitável - 2': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(20, 03, 2014);
    datas.comProcessamento(20, 03, 2014);
    datas.comVencimento(10, 04, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comNome('Mario Amaral');
    beneficiario.comAgencia('8462');
    beneficiario.comCarteira('021');
    beneficiario.comCodigoBeneficiario('05825');
    beneficiario.comNossoNumero('00015135')
    beneficiario.comDigitoNossoNumero('6');
    beneficiario.comPostoBeneficiario('07');

    const pagador = Pagador.novoPagador();
    pagador.comNome('Rodrigo de Sousa');

    const boleto = Boleto.novoBoleto();
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(2680.16);
    boleto.comNumeroDoDocumento('575');
    boleto.comBanco(banco);

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = '74891.10002 15135.684627 07058.251054 5 60290000268016';

    test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
    test.done();
  },

  'Verifica geração da linha digitável - 3': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(21, 5, 2014);
    datas.comProcessamento(21, 5, 2014);
    datas.comVencimento(21, 5, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comCarteira('021');
    beneficiario.comAgencia('654');
    beneficiario.comCodigoBeneficiario('08711');
    beneficiario.comNossoNumero('23245678')
    beneficiario.comDigitoNossoNumero('4');
    beneficiario.comPostoBeneficiario('06');

    const pagador = Pagador.novoPagador();

    const boleto = Boleto.novoBoleto();
    boleto.comEspecieDocumento('DSI');
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(575);
    boleto.comNumeroDoDocumento('1');
    boleto.comBanco(banco);

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = '74891.12321 45678.406542 06087.111016 8 60700000057500';
    const linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

    test.equal(linhaEsperada, linhaGerada);
    test.done();
  },

  'Verifica geração da linha digitável - 4': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(29, 5, 2014);
    datas.comProcessamento(29, 5, 2014);
    datas.comVencimento(23, 6, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comCarteira('157');
    beneficiario.comAgencia('654');
    beneficiario.comCodigoBeneficiario('08711');
    beneficiario.comNossoNumero('23245678')
    beneficiario.comDigitoNossoNumero('2');
    beneficiario.comPostoBeneficiario('05');

    const pagador = Pagador.novoPagador();

    const boleto = Boleto.novoBoleto();
    boleto.comEspecieDocumento('DSI');
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(115.38);
    boleto.comNumeroDoDocumento('2');
    boleto.comBanco(banco);

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = '74891.12321 45678.206546 05087.111026 6 61030000011538';
    const linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

    test.equal(linhaEsperada, linhaGerada);
    test.done();
  },

  'Verifica geração da linha digitável - 5': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(20, 8, 2014);
    datas.comProcessamento(20, 8, 2014);
    datas.comVencimento(27, 8, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comCarteira('157');
    beneficiario.comAgencia('654');
    beneficiario.comCodigoBeneficiario('12345');
    beneficiario.comNossoNumero('02891620')
    beneficiario.comDigitoNossoNumero('8');
    beneficiario.comPostoBeneficiario('04');

    const pagador = Pagador.novoPagador();

    const boleto = Boleto.novoBoleto();
    boleto.comEspecieDocumento('DSI');
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(115.38);
    boleto.comNumeroDoDocumento('4');
    boleto.comBanco(banco);

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = '74891.10283 91620.806546 04123.451009 3 61680000011538';
    const linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

    test.equal(linhaEsperada, linhaGerada);
    test.done();
  },

  'Verifica geração da linha digitável - 6': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(19, 9, 2014);
    datas.comProcessamento(19, 9, 2014);
    datas.comVencimento(26, 9, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comCarteira('157');
    beneficiario.comAgencia('654');
    beneficiario.comCodigoBeneficiario('87119');
    beneficiario.comNossoNumero('07967777')
    beneficiario.comDigitoNossoNumero('4');
    beneficiario.comPostoBeneficiario('12');

    const pagador = Pagador.novoPagador();

    const boleto = Boleto.novoBoleto();
    boleto.comEspecieDocumento('FS');
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(230.76);
    boleto.comNumeroDoDocumento('5');
    boleto.comBanco(banco);

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = '74891.10796 67777.406546 12871.191065 5 61980000023076';
    const linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

    test.equal(linhaEsperada, linhaGerada);
    test.done();
  },

  'Verifica nome correto do banco': function (test) {
    test.equals(banco.getNome(), 'Sicredi');
    test.done();
  },

  'Verifica a numeração correta do banco': function (test) {
    test.equal(banco.getNumeroFormatadoComDigito(), '748-X');
    test.done();
  },

  'Não deve imprimir o nome do banco no boleto': function (test) {
    test.equal(banco.getImprimirNome(), false);
    test.done();
  },

  'Verifica geração do código de barras': function (test) {
    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

    test.equal('74891670000001200001123200123441550801060101', codigoDeBarras);
    test.done();
  },

  'Verifica que arquivo de imagem do logotipo existe': function (test) {
    test.ok(fs.existsSync(banco.getImagem()));
    test.done();
  },

  'Exibir campo CIP retorna falso': function (test) {
    test.equal(banco.exibirCampoCip(), false);
    test.done();
  },

  'Verifica criação de pdf': function (test) {
    const datas = Datas.novasDatas();
    datas.comDocumento(19, 9, 2014);
    datas.comProcessamento(19, 9, 2014);
    datas.comVencimento(26, 9, 2014);

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
    beneficiario.comRegistroNacional('21202793000100');
    beneficiario.comAgencia('4155');
    beneficiario.comCarteira('1');
    beneficiario.comCodigoBeneficiario('10106');
    beneficiario.comNossoNumero('23251500');
    beneficiario.comDigitoNossoNumero('8');
    beneficiario.comPostoBeneficiario('04');

    const pagador = Pagador.novoPagador();
    pagador.comNome('Asnésio da Silva');

    const boleto = Boleto.novoBoleto();
    boleto.comEspecieDocumento('FS');
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(1200);
    boleto.comNumeroDoDocumento('5');
    boleto.comBanco(banco);

    const enderecoDoPagador = Endereco.novoEndereco();
    enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
    enderecoDoPagador.comBairro('Barra da Tijuca');
    enderecoDoPagador.comCep('72000000');
    enderecoDoPagador.comCidade('Rio de Janeiro');
    enderecoDoPagador.comUf('RJ');

    pagador.comEndereco(enderecoDoPagador);

    boleto.comLocaisDePagamento([
      'Pagável em qualquer agência bancária/correspondente bancário'
    ]);

    boleto.comInstrucoes([
      'Conceder desconto de R$ 10,00 até o vencimento',
      'Multa de R$ 2,34 após o vencimento',
      'Mora de R$ 0,76 ao dia após o vencimento',
      'Protestar após 10 dias de vencido',
      'Agradecemos a preferência, volte sempre!'
    ]);

    const geradorDeBoleto = new GeradorDeBoleto([boleto, boleto]);

    geradorDeBoleto.gerarPDF(function boletosGerados(err, pdf) {
      test.ifError(err);

      const caminhoDoArquivo = path.join(__dirname, '/boleto-sicredi.pdf');
      writeStream = fs.createWriteStream(caminhoDoArquivo);

      pdf.pipe(writeStream);

      writeStream.on('close', function () {
        test.ok(fs.existsSync(caminhoDoArquivo));
        test.done();
      });
    });
  }
}
