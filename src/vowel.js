const natural = require('natural');

const maybeRhotic = ['AA', 'EH', /* 'ER', */ 'IH', 'AO', 'UH'];
function rhoticize(phs) {
  if (!phs) return phs;
  const res = [];
  let state = null;
  for (let p of phs) {
    if (!state) {
      if (p.isVowel && maybeRhotic.includes(p))
        state = p;
      else
        res.push(p);
    } else {
      if (p.isVowel) {
        res.push(state);
        state = p;
      } else if (p.phoneme === 'R') {
        res.push({ ...state, property: 'rhotic' });
      } else {
        res.push(state);
        res.push(p);
        state = null;
      }
    }
  }
  if (state)
    res.push(state);
  return res;
}

const aeTense = [
  // The two exceptions:
  'CAN\'T', 'AVENUE',
];
const aeTensePhonemes = ['M', 'N', 'NG', 'B', 'D', 'JH', 'G', 'F', 'TH', 'S', 'SH'];

const aeLax = [
  // Function words with simple coda:
  // TODO: can (n.) should NOT be there
  'CAN', 'HAVE', 'HAD', 'HAS', 'AT', 'THAT', 'AS', 'AND', 'AN', 'ANY', 'AM',
  // TODO: Loanwords, names, abbreviations:
];
const aeLaxPhonemes = ['P', 'T', 'CH', 'K', 'V', 'DH', 'Z', 'ZH', 'L'];

function tensing(phs, word, reflex) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    switch (p.phoneme) {
      case 'AE': // The /ae/-raising rules!
        if (aeLax.includes(word)) {
          res.push({ property: 'lax', ...p, pho: 'ae' }); break;
        }
        if (aeTense.includes(word)) {
          res.push({ property: 'tense', ...p, pho: 'ae' }); break;
        }
        const w = natural.LancasterStemmer.stem(word).toUpperCase();
        let phsR = word === w ? phs : reflex(w);
        if (!(phsR && phsR[pi] && phsR[pi].phoneme === 'AE')) {
          console.error('Warning: stemming of', word, 'to', w, 'may have failed');
          phsR = phs;
        }
        // End of word
        if (pi === phsR.length - 1) {
          res.push({ property: 'lax', ...p, pho: 'ae' }); break;
        }
        // End of syllable
        if (phsR[pi + 1].isVowel) {
          res.push({ property: 'lax', ...p, pho: 'ae' }); break;
        }
        // Before a pre-vocalic consonant
        if (pi < phsR.length - 2 && phsR[pi + 2].isVowel) {
          res.push({ property: 'lax', ...p, pho: 'ae' }); break;
        }
        // Check what the consonant is
        if (aeTensePhonemes.includes(phsR[pi + 1].phoneme)) {
          res.push({ property: 'tense', ...p, pho: 'ae' }); break;
        }
        if (aeLaxPhonemes.includes(phsR[pi + 1].phoneme)) {
          res.push({ property: 'lax', ...p, pho: 'ae' }); break;
        }
        console.error('Warning: cannot decide /ae/-raising of ', word);
        res.push({ property: 'lax', ...p, pho: 'ae' });
        break;
      case 'AY': res.push({ property: 'tense',  ...p, pho: 'aI' }); break;
      case 'AW': res.push({ property: 'tense',  ...p, pho: 'aU' }); break;
      case 'AA': res.push({ property: 'tense',  ...p, pho: 'A' }); break;
      case 'AH': res.push({ property: 'lax',    ...p, pho: p.stress ? '2' : '@', weak: !p.stress }); break;
      case 'EY': res.push({ property: 'tense',  ...p, pho: 'eI' }); break;
      case 'EH': res.push({ property: 'lax',    ...p, pho: 'e' }); break;
      case 'ER': res.push({ property: 'rhotic', ...p, pho: p.stress ? '3r' : '@', weak: !p.stress }); break;
      case 'IY': res.push({ property: 'tense',  ...p, pho: 'i', weak: !p.stress }); break;
      case 'IH': res.push({ property: 'lax',    ...p, pho: 'I', weak: !p.property && !p.stress }); break;
      case 'OW':
        if (pi || p.stress)
          res.push({ property: 'tense', ...p, pho: 'oU' });
        else
          res.push({ property: 'lax', ...p, pho: 'U', weak: true });
        break;
      case 'OY': res.push({ property: 'tense',  ...p, pho: 'OI' }); break;
      // Note: Due to cot-thought merger, tense AO and lax AO are identical.
      case 'AO': res.push({ property: 'tense',  ...p, pho: 'O' }); break;
      case 'UW': res.push({ property: 'tense',  ...p, pho: 'u', weak: !p.stress }); break;
      case 'UH': res.push({ property: 'lax',    ...p, pho: 'u' }); break;
      default: res.push(p); break;
    }
  }
  return res;
}

const nasalPhonemes = ['M', 'N', 'NG'];

function nasalize(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (p.isVowel) {
      const nasal = p.isVowel && pi < phs.length - 1 && nasalPhonemes.includes(phs[pi + 1].phoneme);
      res.push({ ...p, nasal });
    } else {
      res.push(p);
    }
  }
  return res;
}

module.exports = (phs, word, reflex) => {
  const phs1 = rhoticize(phs);
  const phs2 = tensing(phs1, word, (w) => rhoticize(reflex(w)));
  const phs3 = nasalize(phs2);
  return phs3;
};
module.exports.default = module.exports;
