const { htmlEncode } = require('htmlencode');
const path = require('path');
const fs = require('fs');
const jfk = require('./src');

const fn = path.join(__dirname, 'data', 'cmudict.txt');
const ir = jfk.makeDictionary(fs.readFileSync(fn, 'utf-8'));

module.exports = {
  unicode: (w) => ir(w).map(jfk.disp.utf8Encode),
  html: (w) => ir(w).map(jfk.disp.utf8Encode).map(htmlEncode),
  latex: (w) => ir(w).map(jfk.disp.latexEncode),
};
module.exports.default = module.exports;
