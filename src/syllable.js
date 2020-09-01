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

const onset = [
  [],
  // All single consonant phonemes except /N/:
  ['M'], ['N'], ['P'], ['B'], ['T'], ['D'], ['K'], ['G'], ['F'], ['V'], ['TH'], ['DH'], ['S'], ['Z'], ['SH'], ['ZH'], ['HH'], ['L'], ['R'], ['Y'], ['W'], ['CH'], ['JH'],
  // Stop plus approximant other than /j/:
  ['P', 'L'], ['B', 'L'], ['K', 'L'], ['G', 'L'],
  ['P', 'R'], ['B', 'R'], ['T', 'R'], ['K', 'R'], ['G', 'R'],
  ['T', 'W'], ['D', 'W'], ['G', 'W'], ['K', 'W'], ['P', 'W'],
  // Voiceless fricative or /v/ plus approximant other than /j/:
  ['F', 'L'], ['S', 'L'], ['TH', 'L'],
  ['F', 'R'], ['TH', 'R'], ['SH', 'R'],
  ['HH', 'W'], ['S', 'W'], ['TH', 'W'], ['V', 'W'],
  // Consonant plus /j/ (before /u:/ or its modified/reduced forms):
  ['P', 'Y'], ['B', 'Y'], ['T', 'Y'], ['D', 'Y'], ['K', 'Y'], ['G', 'Y'], ['M', 'Y'], ['N', 'Y'], ['F', 'Y'], ['V', 'Y'], ['TH', 'Y'], ['S', 'Y'], ['Z', 'Y'], ['HH', 'Y'], ['L', 'Y'],
  // /s/ plus voiceless stop:
  ['S', 'P'], ['S', 'T'], ['S', 'K'],
  // /s/ plus nasal other than /N/:
  ['S', 'M'], ['S', 'N'],
  // /s/ plus voiceless fricative:
  ['S', 'F'], ['S', 'TH'],
  // /s/ plus voiceless stop plus approximant:
  ['S', 'P', 'L'], ['S', 'K', 'L'],
  ['S', 'P', 'R'], ['S', 'T', 'R'], ['S', 'K', 'R'],
  ['S', 'K', 'W'],
  ['S', 'M', 'Y'], ['S', 'P', 'Y'], ['S', 'T', 'Y'], ['S', 'K', 'Y'],
  // /s/ plus voiceless fricative plus approximant:
  ['S', 'F', 'R'],
];

const coda = [
  [],
  // The single consonant phonemes except /h/, /w/, /j/ and, in non-rhotic varieties, /r/:
  ['M'], ['N'], ['NG'], ['P'], ['B'], ['T'], ['D'], ['K'], ['G'], ['F'], ['V'], ['TH'], ['DH'], ['S'], ['Z'], ['SH'], ['ZH'], ['L'], ['R'], ['CH'], ['JH'],
  // Lateral approximant plus stop or affricate:
  ['L', 'P'], ['L', 'B'], ['L', 'T'], ['L', 'D'], ['L', 'CH'], ['L', 'JH'], ['L', 'K'],
  // In rhotic varieties, /r/ plus stop or affricate:
  ['R', 'P'], ['R', 'B'], ['R', 'T'], ['R', 'D'], ['R', 'CH'], ['R', 'JH'], ['R', 'K'], ['R', 'G'],
  // Lateral approximant + fricative:
  ['L', 'F'], ['L', 'V'], ['L', 'TH'], ['L', 'S'], ['L', 'Z'], ['L', 'SH'],
  // In rhotic varieties, /r/ + fricative:
  ['R', 'F'], ['R', 'V'], ['R', 'TH'], ['R', 'S'], ['R', 'Z'], ['R', 'SH'],
  // Lateral approximant + nasal:
  ['L', 'M'], ['L', 'N'],
  // In rhotic varieties, /r/ + nasal or lateral:
  ['R', 'M'], ['R', 'N'], ['R', 'L'],
  // Nasal + homorganic stop or affricate:
  ['M', 'P'],
  ['N', 'T'], ['N', 'D'], ['N', 'CH'], ['N', 'JH'], ['NG', 'K'],
  // Nasal + fricative:
  ['M', 'F'], ['M', 'TH'],
  ['N', 'TH'], ['N', 'S'], ['N', 'Z'],
  ['NG', 'TH'],
  // Voiceless fricative plus voiceless stop:
  ['F', 'T'],
  ['S', 'P'], ['S', 'T'], ['S', 'K'],
  // Two voiceless fricatives:
  ['F', 'TH'],
  // Two voiceless stops:
  ['P', 'T'],
  ['K', 'T'],
  // Stop plus voiceless fricative:
  ['P', 'TH'], ['P', 'S'],
  ['T', 'TH'], ['T', 'S'],
  ['D', 'TH'], ['D', 'S'],
  // Lateral approximant + two consonants:
  ['L', 'P', 'T'], ['L', 'P', 'S'],
  ['L', 'F', 'TH'],
  ['L', 'T', 'S'],
  ['L', 'S', 'T'],
  ['L', 'K', 'T'], ['L', 'K', 'S'],
  // In rhotic varieties, /r/ + two consonants:
  ['R', 'M', 'TH'],
  ['R', 'P', 'T'],
  ['R', 'P', 'S'],
  ['R', 'T', 'S'],
  ['R', 'S', 'T'],
  ['R', 'K', 'T'],
  // Nasal + homorganic stop + stop or fricative:
  ['M', 'P', 'T'], ['M', 'P', 'S'],
  ['N', 'D', 'TH'],
  ['NG', 'K', 'T'], ['NG', 'K', 'S'], ['NG', 'K', 'TH'],
  // Three obstruents:
  ['K', 'S', 'TH'], ['K', 'S', 'T'],
];

const badSplit = [
  ['S', 'P'],
  ['S', 'T'],
  ['S', 'K'],
  ['T', 'S'],
  ['D', 'Z'],
  ['T', 'R'],
  ['D', 'R'],
  ['HH', 'Y'],
];

Array.prototype.includesX = function(valueToFind) {
  for (let o of this) {
    if (o.length === valueToFind.length) {
      let i;
      for (i = 0; i < valueToFind.length; i++)
        if (o[i] !== valueToFind[i])
          break;
      if (i === valueToFind.length)
        return true;
    }
  }
  return false;
};

function syllabify(phs, syllableHint) {
  if (!phs) return phs;
  const ints = [];
  let state = [];
  for (let p of phs) {
    if (p.isVowel) {
      ints.push(state);
      ints.push(p);
      state = [];
    } else {
      state.push(p);
    }
  }
  ints.push(state);
  const syllableHints = syllableHint ? syllableHint.trim().split(/\s+/).map((h) => +h) : [];
  for (let i = 0; i < ints.length; i += 2) {
    const int = ints[i];
    let maybe;
    if (syllableHints[i / 2 - 1] !== undefined) {
      maybe = [syllableHints[i / 2 - 1]];
    } else if (int.length === 0) {
      maybe = [0];
    } else if (i === 0) {
      maybe = [0];
    } else if (i === ints.length - 1) {
      maybe = [int.length];
    } else if (ints[i - 1].phoneme == 'ER'
      && ['NG', 'DH', 'ZH', 'HH', 'R', 'Y', 'W'].includes(int[0].phoneme)) {
      maybe = [0];
    } else {
      maybe = [];
      for (let j = 0; j <= int.length; j++) {
        if (coda.includesX(int.slice(0, j).map((x) => x.phoneme))
          && onset.includesX(int.slice(j).map((x) => x.phoneme))) {
          maybe.push(j);
        }
      }
    }
    if (maybe.length === 1) {
      int.split = maybe[0];
      continue;
    }
    const stressD = (ints[i + 1].stress * 2 % 3) - (ints[i - 1].stress * 2 % 3);
    if (!maybe.length) {
      console.error('Warning: no possible splitting in ', int.map((n) => n.phoneme).join(' '));
      maybe = [];
      for (let j = 0; j <= int.length; j++) {
        maybe.push(j);
      }
    }
    maybe = maybe.map((pos) => {
      let fit = -Math.abs(pos - int.length / 2 + 0.3 * (stressD + 0.1));
      if (!pos && ints[i - 1].phoneme === 'ER') {
        fit += 1.2;
      }
      if (pos === int.length && ints[i + 1].phoneme === 'ER') {
        fit += 1.1;
      }
      if (pos && pos < int.length) {
        if (badSplit.includesX([int[pos - 1].phoneme, int[pos].phoneme])) {
          fit -= 114514;
        }
        if (int[pos].phoneme === 'Y') {
          fit -= 1.5;
        }
        if (['P', 'B', 'T', 'D', 'K', 'G'].includes(int[pos - 1].phoneme)
          && ['P', 'B', 'T', 'D', 'K', 'G', 'CH', 'JH'].includes(int[pos].phoneme)) {
          fit -= 3.0;
        }
        if (['P', 'T', 'K'].includes(int[pos - 1].phoneme)
          && ['F', 'V', 'TH', 'DH', 'S', 'Z', 'SH', 'JH'].includes(int[pos].phoneme)) {
          fit -= 2.5;
        }
      }
      return { pos, fit };
    });
    maybe.sort(({ fit: l }, { fit: r }) => r - l);
    int.split = maybe[0].pos;
  }
  const res = [];
  for (let i = 0; i < ints.length; i += 2) {
    const prv = ints[i];
    const nxt = prv.splice(prv.split);
    const vow = i < ints.length - 1 && ints[i + 1];
    const stress = vow && vow.stress;
    for (let p of prv) {
      res.push({ ...p, phono: 'coda', stress });
    }
    for (let p of nxt) {
      res.push({ ...p, phono: 'onset', stress });
    }
    if (vow) {
      res.push({ ...vow, phono: 'nucleus' });
    }
  }
  return res;
}

function syllablicize(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (p.phoneme === 'AH' && !p.stress && pi < phs.length - 1
        && ['L'].includes(phs[pi + 1].phoneme)) {
      if (pi && phs[pi - 1].phono === 'coda'
        || pi && phs[pi - 1].phono === 'nucleus') {
        res.push({ ...phs[pi + 1], phono: phs[pi + 1].phono === 'coda' ? 'nucleus' : 'onset', stress: 0 });
        pi++;
        continue;
      }
    }
    if (p.phoneme === 'AH' && !p.stress && pi < phs.length - 1
        && ['M', 'N', 'L'].includes(phs[pi + 1].phoneme)) {
      if (pi && phs[pi - 1].phono === 'coda' && !['M', 'N', 'NG'].includes(phs[pi - 1].phoneme)
        || pi && phs[pi - 1].phono === 'nucleus') {
        res.push({ ...phs[pi + 1], phono: phs[pi + 1].phono === 'coda' ? 'nucleus' : 'onset', stress: 0 });
        pi++;
        continue;
      }
    }
    res.push(p);
  }
  return res;
}

function rPhoneme(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (p.phoneme !== 'ER') {
      res.push(p);
      continue;
    }
    // Case 0: @r [+ C]
    if (!(pi < phs.length - 1 && phs[pi + 1].isVowel)) {
      res.push({ ...p, isVowel: false, weak: undefined, pho: 'r', phono: 'nucleus' });
      continue;
    }
    // Case 1: @r + @r
    if (!p.stress && !phs[pi + 1].stress && phs[pi + 1].phoneme === 'ER') {
      let t;
      if (!pi) {
        t = undefined;
      } else if (phs[pi - 1].isVowel) {
        t = undefined;
      } else if (['M', 'NG', 'G'].includes(phs[pi - 1].phoneme)) {
        t = undefined;
      } else if (!['T', 'D'].includes(phs[pi - 1].phoneme)) {
        t = 1;
      } else if (pi === 1) {
        t = undefined;
      } else if (phs[pi - 2].isVowel) {
        t = phs[pi - 1].phoneme === 'T' ? 2 : 3;
      } else {
        t = phs[pi - 1].phoneme === 'T' ? 1 : 2;
      }
      if (!t) {
        console.error('Warning: cannot determine ER in', int.map((n) => n.phoneme).join(' '));
        t = 1;
      }
      res.push(t >= 2 ? p : { ...p, isVowel: false, weak: undefined, pho: 'r', phono: 'nucleus' });
      res.push(t <= 2 ? phs[pi + 1] : { ...phs[pi + 1], isVowel: false, weak: undefined, pho: 'r', phono: 'nucleus' });
      pi++;
    }
    // Case 2: 3r + @r
    else if (p.stress && !phs[pi + 1].stress && phs[pi + 1].phoneme === 'ER') {
      res.push(p);
      res.push({ ...phs[pi + 1], isVowel: false, weak: undefined, pho: 'r', phono: 'nucleus' });
      pi++;
    }
    // Case 3: 3r + V, @r + V
    else {
      res.push(p);
      res.push({ isVowel: false, pho: 'r', phono: 'onset', stress: phs[pi + 1].stress, short: true });
    }
  }
  return res;
}

module.exports = (phs, syllableHint, phonemic) => {
  const phs1 = syllabify(phs, syllableHint);
  if (phonemic) return phs1;
  const phs2 = syllablicize(phs1);
  const phs3 = rPhoneme(phs2);
  return phs3;
};
module.exports.default = module.exports;
