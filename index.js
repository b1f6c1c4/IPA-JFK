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

const { htmlEncode } = require('htmlencode');
const path = require('path');
const fs = require('fs');
const jfk = require('./src');

const fn = path.join(__dirname, 'data', 'cmudict.txt');
const ir = jfk.makeDictionary(fs.readFileSync(fn, 'utf-8'));

module.exports = {
  unicode: (w) => ir(w).map(jfk.disp.utf8Encode),
  html: (w) => ir(w).map(jfk.disp.utf8Encode).map(htmlEncode),
  latex: (w) => ir(w).map(jfk.disp.latexEncode),
};
module.exports.default = module.exports;
