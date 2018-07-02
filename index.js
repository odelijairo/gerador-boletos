// browserify -i ./lib/boletoUtils.js -i ./lib/consultasUtils.js brasil.js -s brasil | uglifyjs > ./dist/brasil.browser.js

// Para melhorar a exportação para o browser
// https://github.com/substack/browserify-handbook#browser-field

module.exports = {
    validacoes: require('./lib/validacoesUtils'),
    formatacoes: require('./lib/formatacoesUtils'),
    bancos: require('./lib/bancosUtils'),
    boleto: require('./lib/boletoUtils'),
};
