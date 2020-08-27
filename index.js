function ir(w) {
  // TODO
}

function irEncode(r, enc) {
  // TODO
}

module.exports = {
  unicode: (w) => irEncode(ir(w), 'unicode'),
  html: (w) => irEncode(ir(w), 'html'),
  latex: (w) => irEncode(ir(w), 'latex'),
};
module.exports.default = module.exports;
