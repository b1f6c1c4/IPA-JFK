const htmlencode = require('htmlencode');
const parse = require('./src/parse');
const syllable = require('./src/syllable');
const vowel = require('./src/vowel');
const consonant = require('./src/consonant');

function ir(w) {
  const wu = w.toUpperCase();
  const ref = (v) => {
    const wx = parse[v.toUpperCase()];
    if (!wx) return undefined;
    return wx[0];
  };
  let phs = parse[wu][0];
  syllable(phs);
  phs = vowel(phs, wu, ref);
  phs = consonant(phs, wu, ref);
  return phs;
}

function utf8Encode(r) {
  // TODO
}

// TODO: cure v.s. tour
const vowelLaTeX = {
  ae: { tense: 'e\\textsubarch{@}', lax: '\\ae{}' },
  aI: { tense: '\\|+A\\textsubarch{I}' },
  aU: { tense: 'a\\textsubarch{U}' },
  A: { tense: 'A:', rhotic: '6\textsubarch{@}\textrhoticity' },
  2: { lax: '2' },
  eI: { tense: '\\|`e\\textsubarch{I}' },
  e: { rhotic: '\\|`e\\textsubarch{@}\\textrhoticity', lax: 'E' },
  '3r': { rhotic: '3\\textrhoticity:' },
  '@': { rhoticWeak: '@\\textrhoticity:', laxWeak: '@' },
  i: { tense: 'i:', tenseWeak: 'i:', rhotic: 'i\\textsubarch{@}\\textrhoticity' },
  I: { lax: '\\"I', laxWeak: '9' },
  oU: { tense: '\\|`o\\textsubarch{U}' },
  OI: { tense: '\\|`o\\textsubarch{I}' },
  O: { tense: 'O\\texsubarch{@}', rhotic: '\\|`o\\textsubarch{@}\\textrhoticity', lax: 'O\\textsubarch{@}' },
  u: { tense: 'U\\textsubarch{u}', tenseWeak: 'U\textsubarch{u}', rhotic: '\\|`o\\textsubarch{@}\\textrhoticity' },
  U: { lax: '\\"U', laxWeak: '8' },
};
const consonantLaTeX = {
  r: '\\*r',
  c: '\\c{c}',
};

function latexEncode(phs) {
  function enc(ph) {
    let rx = '';
    for (let p of ph) {
      if (Array.isArray(p)) {
        rx += `\\t{${enc(p)}}`;
      } else {
        let s;
        if (p.isVowel) {
          s = vowelLaTeX[p.pho][p.property + (p.weak ? 'Weak' : '')];
        } else {
          s = consonantLaTeX[p.pho] || p.pho;
        }
        if (p.devoiced)
          s = `\\r{${s}}`;
        if (p.nasal)
          s = `\\~{${s}}`;
        if (p.retracted)
          s = `\\textsubbar{${s}}`;
        if (p.raise)
          s = `\\textraising{${s}}`;
        if (p.release === 'silent')
          s += '\\textcorner{}';
        {
          let sup = '';
          if (p.aspirate > 0.7)
            sup += 'h';
          if (p.labialized)
            sup += 'w';
          if (sup)
            s += `\\super{${sup}}`;
        }
        rx += s;
      }
    }
    return rx;
  }
  return `\\textipa{${enc(phs)}}`;
}

module.exports = {
  unicode: (w) => utf8Encode(ir(w)),
  html: (w) => htmlencode(utf8Encode(ir(w))),
  latex: (w) => latexEncode(ir(w)),
};
module.exports.default = module.exports;
