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

const escapeStringRegexp = require('escape-string-regexp');
const { htmlEncode } = require('htmlencode');
const path = require('path');
const fs = require('fs');
const core = require('./src');

const fn = path.join(__dirname, 'data', 'cmudict.txt');

let dictF = fs.readFileSync(fn, 'utf-8').replace(/_/g, '-');
let dict;

function cacheDatabase() {
  dict = {};
  dictF.split('\n').forEach((l) => {
    try {
      if (!l || l.startsWith(';;;')) return;
      const [w0, phst] = l.split('  ');
      const [, w, id] = w0.match(/^(.+?)(?:\(([0-9]+)\))?$/);
      if (!dict[w]) dict[w] = [];
      dict[w][id && +id || 0] = phst;
    } catch (e) {
      console.error('Error on line', l);
      throw e;
    }
  });
}

const norm = (w) => w.trim().toUpperCase().replace(/ /g, '-');

function queryDatabase(word) {
  const w = norm(word);
  if (dict) return dict[w];
  const regex = new RegExp(
    `\\b${escapeStringRegexp(w.toUpperCase())}(?:\\([0-9]+\\))?  ([A-Z0-9 ]+)\\b`,
    'g',
  );
  const res = [];
  for (let m of dictF.matchAll(regex)) {
    res.push(m[1]);
  }
  return res;
}

module.exports = {
  cacheDatabase,
  queryDatabase,
  process: (ph, word, aeHint) => core(ph, norm(word), aeHint),
  unicode: core.display.utf8Encode,
  html: (phs) => htmlEncode(src.display.utf8Encode(phs)),
  latex: core.display.latexEncode,
};
module.exports.default = module.exports;
