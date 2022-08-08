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

import htmlencode from 'htmlencode';
const { htmlEncode } = htmlencode;
import path from 'node:path';
import fs from 'node:fs';
import * as db from './db.js';

db.load(fs.readFileSync(new URL('./data/cmudict.txt', import.meta.url), 'utf-8'));

export { cache as cacheDatabase, query as queryDatabase, process } from './db.js';
export const unicode = db.display.utf8Encode;
export const html = (phs) => htmlEncode(db.display.utf8Encode(phs));
export const latex = db.display.latexEncode;
