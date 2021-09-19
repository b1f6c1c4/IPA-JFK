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

const db = require('../db');
const cmu = require('url:../data/cmudict.txt');

function update() {
  document.getElementById('results').innerHTML = '';
  try {
    const word = document.getElementById('word').value || '';
    const ref = document.getElementById('ph').value;
    const aeHint = document.getElementById('ae').value;
    const syllableHint = document.getElementById('syllable').value;
    const phss = ref ? [ref] : db.query(word);
    for (let phs of phss) {
      const phonemic = !document.getElementById('phonetic').checked;
      const ir = db.process(phs, word, phonemic, { aeHint, syllableHint });
      const li = document.createElement('li');
      if (document.getElementById('unicode').checked) {
        li.innerText = db.display.utf8Encode(ir)
      } else if (document.getElementById('latex').checked) {
        const pre = document.createElement('pre');
        pre.innerText = db.display.latexEncode(ir);
        li.appendChild(pre);
      } else {
        const pre = document.createElement('pre');
        pre.innerText = JSON.stringify(ir, null, 2);
        li.appendChild(pre);
      }
      document.getElementById('results').appendChild(li);
    }
  } catch (e) {
    console.error(e);
  }
}

const xhr = new XMLHttpRequest();
xhr.responseType = 'text';
xhr.onload = () => {
  if (xhr.readyState === xhr.DONE) {
    if (xhr.status === 200) {
      db.load(xhr.responseText);
      db.cache();
      document.getElementById('loading').style.display = 'none';
      document.getElementById('frm').style.display = 'initial';
      document.getElementById('word').onkeyup = update;
      document.getElementById('unicode').onchange = update;
      document.getElementById('latex').onchange = update;
      document.getElementById('raw').onchange = update;
      document.getElementById('ph').onkeyup = update;
      document.getElementById('ae').onkeyup = update;
      document.getElementById('syllable').onkeyup = update;
      document.getElementById('phonetic').onchange = update;
      if (window.location.hash.substr(1)) {
        document.getElementById('word').value = window.location.hash.substr(1).trim();
        update();
      }
      window.onhashchange = () => {
        document.getElementById('word').value = window.location.hash.substr(1).trim();
        update();
      }
    }
  }
};
xhr.open('GET', cmu);
xhr.send();
