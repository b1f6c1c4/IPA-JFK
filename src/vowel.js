/* Copyright (C) 2020 b1f6c1c4
 *
 * This file is part of IPA-JFK.
 *
 * IPA-JFK is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3.
 *
 * IPA-JFK is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for
 * more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with IPA-JFK.  If not, see <https://www.gnu.org/licenses/>.
 */

const maybeRhotic = ['AA', 'EH', /* 'ER', */ 'IH', 'AO', 'UH'];
function rhoticize(phs) {
  if (!phs) return phs;
  const res = [];
  let isY = false;
  let state = null;
  for (let p of phs) {
    if (!state) {
      if (p.isVowel && maybeRhotic.includes(p.phoneme))
        state = p;
      else
        res.push(p);
    } else {
      if (p.isVowel) {
        res.push(state);
        state = p;
      } else if (p.phoneme === 'R') {
        // cure-force merger
        if (state.phoneme === 'UH' && !isY) {
          res.push({ ...state, pho: 'O', property: 'rhotic' });
        } else {
          res.push({ ...state, property: 'rhotic' });
        }
        state = null;
      } else {
        res.push(state);
        res.push(p);
        state = null;
      }
    }
    if (!p.isVowel)
      isY = p.phoneme === 'Y';
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
  'CAN', 'HAVE', 'HAD', 'HAS', 'AT', 'THAT', 'AS', 'AND', 'AN', 'ANY', 'AM',
  // Loanwords, names, abbreviations:
  // We rely on aeHint for this
];
const aeLaxPhonemes = ['P', 'T', 'CH', 'K', 'V', 'DH', 'Z', 'ZH', 'L'];

// aeHint:
//   0: All lax
//   1: Last /ae/ tense
//   2: 2nd-last /ae/ tense
//   ...
//   -1: Last /ae/ lax
//   -2: 2nd-last last /ae/ lax
//   ...
//   1, -2: Combine 1 and -2
//   ...
function tensing(phs, word, aeHint) {
  if (!phs) return phs;
  const res = [];
  const aeHints = [];
  if (aeHint) {
    const aes = phs.reduce((v,{ phoneme }) => v + (phoneme === 'AE'), 0);
    aeHint.split(',').forEach((v) => {
      if (!v) return;
      if (+v === 0) {
        for (let i = 0; i < aes; i++) aeHints[i] = false;
      } else if (+v < 0) {
        aeHints[aes + +v] = false;
      } else if (+v > 0) {
        aeHints[aes - +v] = true;
      }
    });
  }
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    switch (p.phoneme) {
      case 'AE': {
        let tense = aeHints.splice(0, 1)[0];
        if (tense !== undefined) {
          // do nothing
        } else if (aeLax.includes(word)) {
          tense = false;
        } else if (aeTense.includes(word)) {
          tense = true;
        } else if (pi === phs.length - 1) { // End of word
          tense = false;
        } else if (phs[pi + 1].isVowel) { // End of syllable
          tense = false;
        } else if (pi < phs.length - 2 && phs[pi + 2].isVowel) { // Before a pre-vocalic consonant
          tense = false;
        } else if (aeTensePhonemes.includes(phs[pi + 1].phoneme)) { // Check the consonant is
          tense = true;
        } else if (aeLaxPhonemes.includes(phs[pi + 1].phoneme)) {
          tense = false;
        } else {
          console.error('Warning: cannot decide /ae/-raising of ', word);
          tense = false;
        }
        res.push({ property: tense ? 'tense' : 'lax', ...p, pho: 'ae' });
        break;
      }
      case 'AY': res.push({ property: 'tense',  ...p, pho: 'aI' }); break;
      case 'AW': res.push({ property: 'tense',  ...p, pho: 'aU' }); break;
      case 'AA': res.push({ property: 'tense',  ...p, pho: 'A' }); break;
      case 'AH': res.push({ property: 'lax',    ...p, pho: p.stress ? '2' : '@', weak: !p.stress }); break;
      case 'EY': res.push({ property: 'tense',  ...p, pho: 'eI' }); break;
      case 'EH': res.push({ property: 'lax',    ...p, pho: 'e' }); break;
      case 'ER': res.push({ property: 'rhotic', pho: p.stress ? '3r' : '@', weak: !p.stress, ...p }); break;
      case 'IY': res.push({ property: 'tense',  ...p, pho: 'i', weak: !p.stress }); break;
      case 'IH': res.push({ property: 'lax',    ...p, pho: p.property ? 'i' : 'I', weak: !p.property && !p.stress }); break;
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
      // Note: Due to cure-force merger, rhotic UH (not after /j/) becomes rhotic /O/
      case 'UH': res.push({ property: 'lax',    pho: 'U', ...p }); break;
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
      const nasalized = p.isVowel && pi < phs.length - 1 && nasalPhonemes.includes(phs[pi + 1].phoneme);
      res.push({ ...p, nasalized });
    } else {
      res.push(p);
    }
  }
  return res;
}

function nasalizeAndLengthen(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (!p.isVowel) {
      res.push(p);
      continue;
    }
    const nasalized = p.isVowel && pi < phs.length - 1 && nasalPhonemes.includes(phs[pi + 1].phoneme);
    let length = 1;
    if (pi && res[pi - 1].length === 1.5) {
      length = 0.5;
    }
    switch (p.pho) {
      case 'A':
        if (p.property === 'tense') length = 2;
        break;
      case '3r':
        length = 2;
        break;
      case 'i':
        if (p.property === 'tense') {
          if (pi < phs.length - 1 && phs[pi + 1].pho !== 'I' && p.weak && phs[pi + 1].weak) {
            length = 1.5;
          } else {
            length = 2;
          }
        }
        break;
      case '@':
        if (pi && phs[pi - 1].phoneme === 'N' && phs[pi - 1].phono === 'nucleus') {
          length = 0.7;
        }
        break;
    }
    res.push({ ...p, nasalized, length });
  }
  return res;
}

module.exports = (phs, word, aeHint) => {
  const phs1 = rhoticize(phs);
  const phs2 = tensing(phs1, word, aeHint);
  const phs3 = nasalizeAndLengthen(phs2);
  return phs3;
};
module.exports.default = module.exports;
