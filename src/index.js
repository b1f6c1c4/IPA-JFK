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

const parse = require('./parse');
const syllable = require('./syllable');
const vowel = require('./vowel');
const consonant = require('./consonant');
const display = require('./display');

module.exports = {
  makeDictionary: (dict) => {
    const parsed = parse(dict);
    return (w) => {
      const wu = w.toUpperCase();
      const ref = (v) => {
        const wx = parsed[v.toUpperCase()];
        if (!wx) return undefined;
        return wx[0];
      };
      return parsed[wu].map((ps) => {
        let phs = syllable(ps, wu);
        phs = vowel(phs, wu, ref);
        return consonant(phs, wu);
      });
    };
  },
  disp: display,
};
module.exports.default = module.exports;
