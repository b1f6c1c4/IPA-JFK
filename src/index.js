const parse = require('./parse');
const syllable = require('./syllable');
const vowel = require('./vowel');
const consonant = require('./consonant');
const display = require('./display');

module.exports = {
  makeDictionary: (dict) => {
    const parsed = parse(dict);
    return (w) => {
      const wu = w.toUpperCase();
      const ref = (v) => {
        const wx = parsed[v.toUpperCase()];
        if (!wx) return undefined;
        return wx[0];
      };
      return parsed[wu].map((ps) => {
        let phs = syllable(ps, wu);
        phs = vowel(phs, wu, ref);
        return consonant(phs, wu);
      });
    };
  },
  disp: display,
};
module.exports.default = module.exports;
