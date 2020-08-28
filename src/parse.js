const path = require('path');
const fs = require('fs');

const vowels = ['AE', 'AY', 'AW', 'AA', 'AH', 'EY', 'EH', 'ER', 'AH', 'IY', 'IH', 'OW', 'OY', 'AO', 'UW', 'UH'];

const fn = path.join(__dirname, '..', 'data', 'cmudict');
const dict = {};
fs.readFileSync(fn, 'utf-8').split('\n').forEach((l) => {
  try {
    if (!l || l.startsWith(';;;')) return;
    const [w0, , ...phs] = l.split(' ');
    const [, w, id] = w0.match(/^(.+?)(?:\(([0-9]+)\))?$/);
    if (!dict[w]) dict[w] = [];
    dict[w][id && +id || 0] = phs.map((ph) => {
      const [, p, s] = ph.match(/^([A-Z][A-Z]?)([0-2]?)$/);
      const o = {
        phoneme: p,
        isVowel: vowels.includes(p),
      };
      if (o.isVowel) o.stress = +s;
      return o;
    });
  } catch (e) {
    console.error('Error on line', l);
    throw e;
  }
});

module.exports = dict;
