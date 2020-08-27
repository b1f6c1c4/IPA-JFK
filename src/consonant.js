const roundedPhonemes = ['CH', 'JH', 'SH', 'JH', 'R'];
const roundPhonemes = ['CH', 'JH', 'SH', 'JH', 'R', 'W'];

function round(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    let round;
    round |= roundedPhonemes.includes(p.phoneme);
    round |= pi < phs.length - 1 && roundPhonemes.includes(phs[pi + 1].phoneme);
    res.push({ ...p, round });
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
          res.push({ ...p, pho: singlePhonemeNames[p.phoneme] });
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
          && phs[pi + 1].isVowel && phs[pi + 1].stress)
          continue;
        break;
      case 'd': // TODO: Confirm nd+V0 -> n+V0
        if (pi && pi < phs.length - 1 && phs[pi - 1].pho === 'n'
          && phs[pi + 1].isVowel && phs[pi + 1].stress)
          continue;
        break;
      case 'h':
        if (pi < phs.length - 1 && phs[pi + 1].pho === 'w') {
          if (!/^(JU|HU|HW/.test(word)) // TODO: Confirm hw -> w
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
const thirdPhos = {
  p: ['l', 'r', 'j'],
  t: ['r', 'j'],
  k: ['l', 'r', 'w', 'j'],
};
const secondPhos = {
  p: ['l', 'r', 'w', 'j'],
  t: ['r', 'w', 'j'],
  k: ['l', 'r', 'w', 'j'],
};

function voiceOnsetTime(phs) {
  if (!phs) return phs;
  const res = [];
  for (let pi = 0; pi < phs.length; pi++) {
    const p = phs[pi];
    let devoiced;
    let aspirate;
    let silent;
    switch (p.pho) {
      case 'p':
      case 't':
      case 'k':
        if (pi && phs[pi - 1].pho === 's' && pi < phs.length - 1
          && (phs[pi + 1].isVowel || thirdPhos[p.pho].includes(phs[pi + 1].pho))) {
          aspirate = 0;
          silent = false;
        } else if (pi < phs.length - 1 && fricativePhos.includes(phs[pi + 1].pho)) {
          aspirate = 0;
          silent = false;
        } else if (pi < phs.length - 1 && plosivePhos.includes(phs[pi + 1].pho)) {
          aspirate = 0;
          silent = true;
        } else if (pi < phs.length - 1 && ((phs[pi + 1].isVowel && phs[pi + 1].stress)
          || (secondPhos[p.pho].includes(phs[pi + 1].pho) &&
            pi < phs.length - 2 && phs[pi + 2].isVowel && phs[pi + 2].stress))) {
          aspirate = 1;
          silent = false;
        } else {
          aspirate = 0.5;
          silent = false;
        }
        res.push({ ...p, aspirate, silent });
        break;
      case 'b':
      case 'd':
      case 'g':
        silent = pi < phs.length - 1 && plosivePhos.includes(phs[pi + 1].pho);
        res.push({ ...p, silent });
        break;
      case 'm':
      case 'n':
      case 'N':
      case 'l':
      case 'r':
      case 'w':
        devoiced = pi && voicelessPhos.includes(phs[pi - 1].pho);
        silent = ['n', 'N'].includes(p.pho) && pi === phs.length - 1;
        raise = p.pho === 'r' && pi && ['t', 'd'].includes(phs[pi - 1].pho);
        res.push({ ...p, devoiced, silent, raise });
        break;
      default:
        res.push(p);
        break;
    }
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
  const phs1 = round(phs);
  const phs2 = splitAffricates(phs1);
  const phs3 = mergingElide(phs2, word);
  const phs4 = voiceOnsetTime(phs3);
  const phs5 = mergeAffricates(phs4);
  return phs5;
};
module.exports.default = module.exports;
