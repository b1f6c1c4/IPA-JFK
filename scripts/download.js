#!/usr/bin/env node

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
