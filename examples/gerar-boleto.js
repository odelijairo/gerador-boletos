const gerador = require('../index');

console.log('run gerar boletos!!');

const createBoleto = () => {
  console.log('entrou!!');
  const Datas = gerador.boleto.Datas;
  const bancos = gerador.boleto.bancos;
  debugger
  let pagador = createPagador(nfse);
  let beneficiario = createBeneficiario(nfse, company, bank);
  let instrucoes = createInstrucoes(company, nfse);
  let dataVencimento = moment(nfse.due_date);
  let valorBoleto = nfse.bill_value ? nfse.bill_value : nfse.total_income;

  return brasil.boleto.Boleto.novoBoleto()
    .comDatas(Datas.novasDatas()
      .comVencimento(dataVencimento.date(), dataVencimento.month() + 1, dataVencimento.year())
      .comProcessamento(moment().date(), moment().month(), moment().year())
      .comDocumento(moment().date(), moment().month(), moment().year()))
    .comBeneficiario(beneficiario)
    .comPagador(pagador)
    .comBanco(new bancos.Bradesco())
    .comValorBoleto(valorBoleto) //Apenas duas casas decimais
    .comNumeroDoDocumento(nfse.nfse_number)
    .comEspecieDocumento('DM') //Duplicata de Venda Mercantil
    .comLocaisDePagamento([
      getLocalDePagamento(bank.bank_code)
    ])
    .comInstrucoes(instrucoes);
}

createBoleto();




// new brasil.boleto.Gerador(boleto).gerarPDF({
//   creditos: '',
//   stream: writeStream
// }, (err, pdf) => {
//   if (err) return reject(err);
//
//   writeStream.on('finish', () => {
//     if (toBase64) {
//       const pdfBase64 = writeStream.toBuffer().toString('base64')
//       resolve(pdfBase64);
//     } else {
//       resolve(writeStream.toBuffer());
//     }
//   });
// });
