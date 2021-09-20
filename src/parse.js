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

const vowels = ['AE', 'AY', 'AW', 'AA', 'AH', 'EY', 'EH', 'ER', 'AH', 'IY', 'IH', 'OW', 'OY', 'AO', 'UW', 'UH'];

module.exports = (phst) => phst && phst.split(/\s+/).map((ph) => {
  const [, p, s] = ph.match(/^([A-Z][A-Z]?)([0-2]?)$/);
  const o = {
    phoneme: p,
    isVowel: vowels.includes(p),
  };
  if (o.isVowel) o.stress = +s;
  return o;
});
module.exports.default = module.exports;
