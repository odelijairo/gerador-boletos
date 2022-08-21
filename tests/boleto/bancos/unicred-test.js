const path = require('path');
const fs = require('fs');
const boletoModule = require('../../../lib/boletoUtils.js');
const Unicred = require('../../../lib/boleto/bancos/unicred.js');
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
    beneficiario.comCodigoBeneficiario('101060');
    beneficiario.comNossoNumero('515');
    beneficiario.comDigitoNossoNumero('8');

    banco = new Unicred();

    boleto = Boleto.novoBoleto();
    boleto.comDatas(datas);
    boleto.comBeneficiario(beneficiario);
    boleto.comBanco(banco);
    boleto.comPagador(pagador);
    boleto.comValorBoleto(1200);
    boleto.comNumeroDoDocumento(103);

    done();
  },

  'Nosso número formatado deve ter 10 digitos': function (test) {
    const beneficiario = Beneficiario.novoBeneficiario().comNossoNumero('9000206');
    const numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);

    test.equals(10, numeroFormatado.length);
    test.equals('0009000206', numeroFormatado);
    test.done();
  },

  'Carteira formatado deve ter 2 dígitos': function (test) {
    const beneficiario = Beneficiario.novoBeneficiario().comCarteira('1');
    const carteiraFormatada = banco.getCarteiraFormatado(beneficiario);

    test.equals(2, carteiraFormatada.length);
    test.equals('01', carteiraFormatada);
    test.done();
  },

  'Conta corrente formatada deve ter 9 dígitos': function (test) {
    const codigoFormatado = banco.getCodigoFormatado(beneficiario);

    test.equals(9, codigoFormatado.length);
    test.equals('000101060', codigoFormatado);
    test.done();
  },

  'Verifica geração da linha digitável - 1': function (test) {
    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaEsperada = "13694.15508 00101.060002 00000.051581 9 67000000120000";

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
    const linhaEsperada = '13698.46207 00005.825005 00001.513563 6 60290000268016';

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
    beneficiario.comCodigoBeneficiario('8711');
    beneficiario.comNossoNumero('94588021')
    beneficiario.comDigitoNossoNumero('4');

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
    const linhaEsperada = '13690.65402 00008.711004 09458.802148 3 60700000057500';
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
    beneficiario.comCodigoBeneficiario('8711');
    beneficiario.comNossoNumero('89605074')
    beneficiario.comDigitoNossoNumero('2');

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
    const linhaEsperada = '13690.65402 00008.711004 08960.507427 5 61030000011538';
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
    beneficiario.comCodigoBeneficiario('8711');
    beneficiario.comNossoNumero('02891620')
    beneficiario.comDigitoNossoNumero('8');

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
    const linhaEsperada = '13690.65402 00008.711004 00289.162083 2 61680000011538';
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
    beneficiario.comCodigoBeneficiario('8711');
    beneficiario.comNossoNumero('07967777')
    beneficiario.comDigitoNossoNumero('4');

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
    const linhaEsperada = '13690.65402 00008.711004 00796.777746 6 61980000023076';
    const linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

    test.equal(linhaEsperada, linhaGerada);
    test.done();
  },

  'Verifica nome correto do banco': function (test) {
    test.equals(banco.getNome(), 'Unicred');
    test.done();
  },

  'Verifica a numeração correta do banco': function (test) {
    test.equal(banco.getNumeroFormatadoComDigito(), '136-8');
    test.done();
  },

  'Não deve imprimir o nome do banco no boleto': function (test) {
    test.equal(banco.getImprimirNome(), false);
    test.done();
  },

  'Verifica geração do código de barras': function (test) {
    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

    test.equal('13699670000001200004155000101060000000005158', codigoDeBarras);
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
    beneficiario.comCodigoBeneficiario('101060');
    beneficiario.comNossoNumero('515');
    beneficiario.comDigitoNossoNumero('8');

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

      const caminhoDoArquivo = path.join(__dirname, '/boleto-unicred.pdf');
      writeStream = fs.createWriteStream(caminhoDoArquivo);

      pdf.pipe(writeStream);

      writeStream.on('close', function () {
        test.ok(fs.existsSync(caminhoDoArquivo));
        test.done();
      });
    });
  }
}
