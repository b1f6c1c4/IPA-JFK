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

const phonemeUnicode = {
  AE: '\u00e6',
  AY: 'a\u026a',
  AW: 'a\u028a',
  AA: '\u0251\u02d0',
  AH: ['\u028c', '\u0259'],
  EY: 'e\u026a',
  EH: 'e',
  ER: ['\u025c\u02de\u02d0', '\u0259\u02de'],
  IY: ['i\u02d0', 'i'],
  IH: '\u026a',
  OW: 'o\u028a',
  OY: '\u0254\u026a',
  AO: '\u0254\u02d0',
  UW: 'u\u02d0',
  UH: '\u028a',
  M: 'm',
  N: 'n',
  NG: '\u014b',
  P: 'p',
  B: 'b',
  T: 't',
  D: 'd',
  K: 'k',
  G: 'g',
  F: 'f',
  V: 'v',
  TH: '\u03b8',
  DH: '\u00f0',
  S: 's',
  Z: 'z',
  SH: '\u0283',
  ZH: '\u0292',
  HH: 'h',
  L: 'l',
  R: '\u0279',
  Y: 'j',
  W: 'w',
  CH: '\u02a7',
  JH: '\u02a4',
};

const vowelUnicode = {
  ae: { tense: ['e', '\u0259\u032f'], lax: ['\u00e6'] },
  aI: { tense: ['\u0251\u031f', '\u026a\u032f'] },
  aU: { tense: ['a', '\u028a\u032f'] },
  A: { tense: ['\u0251'], rhotic: ['\u0252', '\u0259\u032f', '\u02de'] },
  2: { lax: ['\u028c\u031f'] },
  eI: { tense: ['e\u031e', '\u026a\u032f'] },
  e: { rhotic: ['e\u031e', '\u0259\u032f', '\u02de'], lax: ['\u025b'] },
  '3r': { rhotic: ['\u025c', '\u02de'] },
  '@': { rhoticWeak: ['\u0259', '\u02de'], laxWeak: ['\u0259'] },
  i: { tense: ['i'], tenseWeak: ['i'], rhotic: ['i', '\u0259\u032f', '\u02de'] },
  I: { lax: ['\u026a\u0308'], laxWeak: ['\u0258'] },
  oU: { tense: ['o\u031e', '\u028a\u032f'] },
  OI: { tense: ['o\u031e', '\u026a\u032f'] },
  O: { tense: ['\u0254', '\u0259\u032f'], rhotic: ['o\u031e\u0259\u032f', '\u02de'], lax: ['\u0254', '\u0259\u032f'] },
  u: { tense: ['\u028a', 'u\u032f'], tenseWeak: ['\u028a', 'u\u032f'] },
  U: { rhotic: ['\u028a', '\u0259\u032f', '\u02de'], lax: ['\u028a\u0308'], laxWeak: ['\u0275'] },
};
const consonantUnicode = {
  N: '\u014b',
  g: '\u0261',
  T: '\u03b8',
  D: '\u00f0',
  S: '\u0283',
  Z: '\u0292',
  R: '\u027e',
  l: 'l\u033a',
  r: '\u0279',
  c: 'c\u0327',
};

function utf8Encode(phs) {
  let state = 'coda';
  function enc(ph, split) {
    let rxp = '';
    let rx = split ? [] : '';
    let rxs = '';
    for (let p of ph) {
      if (Array.isArray(p)) {
        const [pre, s, sup] = enc(p, true);
        rx += `${pre}${s.join('\u0361').trim()}${sup}`;
      } else {
        let ss;
        if (phs.phonemic) {
          ss = phonemeUnicode[p.phoneme];
          if (Array.isArray(ss)) ss = ss[+!p.stress];
          ss = [ss];
        } else if (p.isVowel) {
          ss = vowelUnicode[p.pho][p.property + (p.weak ? 'Weak' : '')];
        } else {
          ss = [consonantUnicode[p.pho] || p.pho];
        }
        const mutate = (f) => { ss = ss.map((s) => (s === '\u02de') ? s : f(s)); };
        if (p.velarized > 0.5)
          mutate((s) => s === 'l\u033a' ? '\u026b\u033a' : `${s}\u0334`);
        if (p.devoiced)
          mutate((s) => `${s}\u030a`); // Should be \u0325
        if (p.nasalized)
          mutate((s) => `${s}\u0303`);
        if (p.short)
          mutate((s) => `${s}\u0306`);
        if (p.retracted)
          mutate((s) => `${s}\u0320`);
        if (p.raised)
          mutate((s) => `${s}\u02d4`); // Should be \u031d
        if (p.phono === 'nucleus' && !p.isVowel)
          mutate((s) => `${s}\u0329`);
        if (p.length < 0.8)
          mutate((s) => `${s}\u032f`);
        else if (p.length >= 1.8)
          ss = [...ss, '\u02d0'];
        let s = ss.join('');
        if (p.release === 'silent')
          s += '\u02fa';
        if (p.glottalized)
          s = '\u0294' + s;
        let sup = '';
        if (p.release === 'nasal')
          sup += '\u207f';
        else if (p.release === 'labial')
          sup += '\u02e1';
        if (p.aspirate > 0.7)
          sup += '\u02b0';
        if (p.labialized)
          sup += '\u02b7';
        let sp = '';
        switch (state) {
          case 'onset':
            state = p.phono;
            break;
          case 'coda':
          case 'nucleus':
            if (p.phono !== 'coda') {
              if (p.length && p.length < 1)
                sp = '\u203f';
              else
                sp = ' ';
              if (p.stress === 1)
                sp += '\u02c8';
              else if (p.stress === 2)
                sp += '\u02cc';
            }
            state = p.phono;
            break;
        }
        if (!split) {
          rx += sp;
          rx += s;
        } else {
          rxp += sp;
          rx.push(s);
        }
        if (sup) {
          if (split)
            rxs += sup;
          else
            rx += sup;
        }
      }
    }
    if (split)
      return [rxp, rx, rxs.replace('\u02b7\u02b7', '\u02b7')];
    return rx.trim();
  }
  return phs.phonemic ? `/${enc(phs)}/` : `[${enc(phs)}]`;
}

const phonemeLaTeX = {
  AE: '\\ae{}',
  AY: 'aI',
  AW: 'aU',
  AA: 'A:',
  AH: ['2', '@'],
  EY: 'eI',
  EH: 'e',
  ER: ['3\\textrhoticity{}:', '@\\textrhoticity{}'],
  IY: ['i:', 'i'],
  IH: 'I',
  OW: 'oU',
  OY: 'OI',
  AO: 'O:',
  UW: 'u:',
  UH: 'U',
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
  R: '\\*r',
  Y: 'j',
  W: 'w',
  CH: '\\textteshlig{}',
  JH: '\\textdyoghlig{}',
};

const vowelLaTeX = {
  ae: { tense: ['e', '\\textsubarch{@}'], lax: ['\\ae{}'] },
  aI: { tense: ['\\|+A', '\\textsubarch{I}'] },
  aU: { tense: ['a', '\\textsubarch{U}'] },
  A: { tense: ['A'], rhotic: ['6', '\\textsubarch{@}', '\\textrhoticity'] },
  2: { lax: ['\\|+2'] },
  eI: { tense: ['\\|`e\\textsubarch{I}'] },
  e: { rhotic: ['\\|`e\\textsubarch{@}', '\\textrhoticity'], lax: ['E'] },
  '3r': { rhotic: ['3', '\\textrhoticity'] },
  '@': { rhoticWeak: ['@', '\\textrhoticity'], laxWeak: ['@'] },
  i: { tense: ['i'], tenseWeak: ['i'], rhotic: ['i', '\\textsubarch{@}', '\\textrhoticity'] },
  I: { lax: ['\\"I'], laxWeak: ['9'] },
  oU: { tense: ['\\|`o', '\\textsubarch{U}'] },
  OI: { tense: ['\\|`o', '\\textsubarch{I}'] },
  O: { tense: ['O', '\\textsubarch{@}'], rhotic: ['\\|`o\\textsubarch{@}', '\\textrhoticity'], lax: ['O', '\\textsubarch{@}'] },
  u: { tense: ['U', '\\textsubarch{u}'], tenseWeak: ['U', '\\textsubarch{u}'] },
  U: { rhotic: ['U', '\\textsubarch{@}', '\\textrhoticity'], lax: ['\\"U'], laxWeak: ['8'] },
};
const consonantLaTeX = {
  l: '\\|]l',
  r: '\\*r',
  c: '\\c{c}',
};

function latexEncode(phs) {
  let state = 'coda';
  function enc(ph, split) {
    let rxp = '';
    let rx = '';
    let rxs = '';
    for (let p of ph) {
      if (Array.isArray(p)) {
        const [pre, s, sup] = enc(p, true);
        rx += `${pre}\\t{${s}}`;
        if (sup) rx += `\\super{${sup}}`;
      } else {
        let ss;
        if (phs.phonemic) {
          ss = phonemeLaTeX[p.phoneme];
          if (Array.isArray(ss)) ss = ss[+!p.stress];
          ss = [ss];
        } else if (p.isVowel) {
          ss = vowelLaTeX[p.pho][p.property + (p.weak ? 'Weak' : '')];
        } else {
          ss = [consonantLaTeX[p.pho] || p.pho];
        }
        const mutate = (f) => { ss = ss.map((s) => (s === '\\textrhoticity') ? s : f(s)); };
        if (p.velarized > 0.5)
          mutate((s) => `\\|~{${s}}`);
        if (p.devoiced)
          mutate((s) => `\\r{${s}}`);
        if (p.nasalized)
          mutate((s) => `\\~{${s}}`);
        if (p.short)
          mutate((s) => `\\u{${s}}`);
        if (p.retracted)
          mutate((s) => `\\textsubbar{${s}}`);
        if (p.raised)
          mutate((s) => `\\textraising{${s}}`);
        if (p.phono === 'nucleus' && !p.isVowel)
          mutate((s) => `\\s{${s}}`);
        if (p.length < 0.8)
          mutate((s) => `\\textsubarch{${s}}`);
        else if (p.length >= 1.8)
          ss = [...ss, ':'];
        let s = ss.join('');
        if (p.release === 'silent')
          s += '\\textcorner{}';
        if (p.glottalized)
          s = 'P' + s;
        let sup = '';
        if (p.release === 'nasal')
          sup += 'n';
        else if (p.release === 'labial')
          sup += 'l';
        if (p.aspirate > 0.7)
          sup += 'h';
        if (p.labialized)
          sup += 'w';
        let sp = '';
        switch (state) {
          case 'onset':
            state = p.phono;
            break;
          case 'coda':
          case 'nucleus':
            if (p.phono !== 'coda') {
              if (p.length && p.length < 1)
                sp = '\\textbottomtiebar{}';
              else
                sp = ' ';
              if (p.stress === 1)
                sp += '"';
              else if (p.stress === 2)
                sp += '""';
            }
            state = p.phono;
            break;
        }
        if (!split)
          rx += sp;
        else
          rxp += sp;
        rx += s;
        if (sup) {
          if (split)
            rxs += sup;
          else
            rx += `\\super{${sup}}`;
        }
      }
    }
    if (split)
      return [rxp, rx.trim(), rxs.replace('ww', 'w')];
    return rx.trim();
  }
  return phs.phonemic ? `\\textipa{/${enc(phs)}/}` : `\\textipa{[${enc(phs)}]}`;
}

module.exports = {
  utf8Encode,
  latexEncode,
};
module.exports.default = module.exports;
