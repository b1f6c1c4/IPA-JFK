/* Copyright (C) 2020-2021 b1f6c1c4
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

const roundedPhonemes = ['CH', 'JH', 'SH', 'ZH', 'R'];
const roundPhonemes = ['CH', 'JH', 'SH', 'ZH', 'R', 'W'];

function labializeRetractVelarize(phs, word) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    let labialized = false;
    labialized |= roundedPhonemes.includes(p.phoneme);
    labialized |= pi < phs.length - 1 && roundPhonemes.includes(phs[pi + 1].phoneme);
    let retracted = false;
    retracted |= p.phoneme === 'R' || p.pho === 'r';
    retracted |= ['T', 'D'].includes(p.phoneme) && pi < phs.length - 1 && phs[pi + 1].phoneme === 'R';
    let velarized = 0;
    if (p.phoneme === 'L') {
      if (/ly$/i.test(word) && pi === phs.length - 2 && phs[pi + 1].phoneme === 'IY') {
        velarized = 0;
      } else if (p.phono === 'nucleus') {
        velarized = 1;
      } else if (p.phono === 'coda') {
        velarized = (pi < phs.length - 1 && phs[pi + 1].phono === 'coda') ? 0.8 : 0.6;
      } else { // if (p.phono === 'onset') {
        velarized = (pi && phs[pi - 1].phono === 'onset') ? 0.4 : 0.2 ;
      }
    }
    res.push({ ...p, labialized, retracted, velarized });
  }
  return res;
}

const singlePhonemeNames = {
  M: 'm',
  N: 'n',
  NG: 'N',
  P: 'p',
  B: 'b',
  T: 't',
  D: 'd',
  K: 'k',
  G: 'g',
  F: 'f',
  V: 'v',
  TH: 'T',
  DH: 'D',
  S: 's',
  Z: 'z',
  SH: 'S',
  ZH: 'Z',
  HH: 'h',
  L: 'l',
  R: 'r',
  Y: 'j',
  W: 'w',
};

function splitAffricates(phs) {
  if (!phs) return phs;
  const res = [];
  for (let p of phs) {
    switch (p.phoneme) {
      case 'CH':
        res.push({ ...p, pho: 't' });
        res.push({ ...p, pho: 'S' });
        break;
      case 'JH':
        res.push({ ...p, pho: 'd' });
        res.push({ ...p, pho: 'Z' });
        break;
      default:
        if (p.isVowel)
          res.push(p);
        else
          res.push({ pho: singlePhonemeNames[p.phoneme], ...p });
        break;
    }
  }
  return res;
}

function mergingElide(phs, word) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    switch (p.pho) {
      case 't':
        if (pi && pi < phs.length - 1 && phs[pi - 1].pho === 'n'
          && phs[pi + 1].isVowel && !phs[pi + 1].stress)
          continue;
        break;
      case 'd': // TODO: Confirm nd+V0 -> n+V0
        if (pi && pi < phs.length - 1 && phs[pi - 1].pho === 'n'
          && phs[pi + 1].isVowel && !phs[pi + 1].stress)
          continue;
        break;
      case 'h':
        if (pi < phs.length - 1 && phs[pi + 1].pho === 'w') {
          if (!/^(JU|HU|HW)/.test(word)) // TODO: Confirm hw -> w
            continue;
        }
        if (pi < phs.length - 1 && phs[pi + 1].pho === 'j') {
          res.push({ ...phs[pi + 1], pho: 'c' });
          pi++;
          continue;
        }
        break;
    }
    res.push(p);
  }
  return res;
}

const fricativePhos = ['f', 'v', 'T', 'D', 's', 'z', 'S', 'Z'];
const plosivePhos = ['p', 'b', 't', 'd', 'k', 'g'];
const voicelessPhos = ['p', 't', 'k', 'f', 'T', 's', 'S'];

function release(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    let devoiced;
    let aspirate;
    let release;
    let raised;
    let glottalized;
    switch (p.pho) {
      case 'p':
      case 't':
      case 'k':
        if (pi && phs[pi - 1].pho === 's' && phs[pi - 1].phono === 'onset' && p.phono === 'onset') {
          aspirate = 0;
        } else if (pi < phs.length - 1 && fricativePhos.includes(phs[pi + 1].pho)) {
          aspirate = 0;
        } else if (pi < phs.length - 1 && plosivePhos.includes(phs[pi + 1].pho)) {
          aspirate = 0;
          release = 'silent';
        } else if (p.stress && p.phono === 'onset') {
          aspirate = 1;
        } else {
          aspirate = 0.5;
        }
        break;
      case 'b':
      case 'd':
      case 'g':
        if (pi < phs.length - 1 && plosivePhos.includes(phs[pi + 1].pho))
          release = 'silent';
        break;
      case 'm':
      case 'n':
      case 'N':
      case 'l':
      case 'r':
      case 'w':
        devoiced = pi && voicelessPhos.includes(phs[pi - 1].pho) && p.phono !== 'nucleus'
          && !['nasal', 'labial'].includes(res[pi - 1].release);
        if (['n', 'N'].includes(p.pho) && pi === phs.length - 1)
          release = 'silent';
        raised = p.pho === 'r' && pi && ['t', 'd'].includes(phs[pi - 1].pho);
        break;
    }
    switch (p.pho) {
      case 't':
      case 'd':
        if (p.phono === 'coda' && pi < phs.length - 1 && ['m', 'n'].includes(phs[pi + 1].pho)) {
          release = 'nasal';
          glottalized = true;
        }
        if (p.phono === 'coda' && pi < phs.length - 1 && phs[pi + 1].pho === 'l') {
          release = 'labial';
          glottalized = true;
        }
        break;
    }
    if (p.pho === 't' && p.phono === 'coda'
      && pi < phs.length - 1 && !phs[pi + 1].isVowel)
      glottalized = true;
    if (p.pho === 't' && pi === phs.length - 1)
      glottalized = true;
    res.push({ ...p, release, aspirate, devoiced, raised, glottalized });
  }
  return res;
}

function flap(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (['t', 'd'].includes(p.pho)) {
      if (pi && phs[pi - 1].isVowel && pi < phs.length - 1 && (phs[pi + 1].isVowel && !phs[pi + 1].stress
        || phs[pi + 1].pho === 'r' && phs[pi + 1].phono === 'nucleus')) {
        res.push({ ...p, pho: 'R' });
        continue;
      }
    }
    res.push(p);
  }
  return res;
}

function mergeAffricates(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    if (['t', 'd'].includes(p.pho) && pi < phs.length - 1
      && ['r', 's', 'z', 'S', 'Z'].includes(phs[pi + 1].pho)) {
      res.push([p, phs[pi + 1]]);
      pi++;
      continue;
    }
    res.push(p);
  }
  return res;
}

module.exports = (phs, word) => {
  const phs1 = labializeRetractVelarize(phs, word);
  const phs2 = splitAffricates(phs1);
  const phs3 = mergingElide(phs2, word);
  const phs4 = release(phs3);
  const phs5 = flap(phs4);
  const phs6 = mergeAffricates(phs5);
  return phs6;
};
module.exports.default = module.exports;
