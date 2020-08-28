#!/usr/bin/env node

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

const mkdirp = require('mkdirp');
const fs = require('fs');
const https = require('https');

mkdirp.sync('data');

https.get('https://svn.code.sf.net/p/cmusphinx/code/trunk/cmudict/cmudict-0.7b', (resp) => {
  const f = fs.createWriteStream('data/cmudict.txt');
  resp.pipe(f);
}).on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});
