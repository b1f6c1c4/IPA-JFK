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

const { htmlEncode } = require('htmlencode');
const path = require('path');
const fs = require('fs');
const db = require('./db');

const fn = path.join(__dirname, 'data', 'cmudict.txt');

db.load(fs.readFileSync(fn, 'utf-8'));

module.exports = {
  cacheDatabase: db.cache,
  queryDatabase: db.query,
  process: db.process,
  unicode: db.display.utf8Encode,
  html: (phs) => htmlEncode(db.display.utf8Encode(phs)),
  latex: db.display.latexEncode,
};
module.exports.default = module.exports;
