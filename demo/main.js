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

const jfk = require('../src');
const cmu = require('../data/cmudict.txt');

let ir;
function update() {
  document.getElementById('results').innerHTML = '';
  try {
    const phss = ir(document.getElementById('word').value);
    for (let phs of phss) {
      const li = document.createElement('li');
      if (document.getElementById('unicode').checked) {
        li.innerText = jfk.disp.utf8Encode(phs)
      } else {
        const pre = document.createElement('pre');
        pre.innerText = jfk.disp.latexEncode(phs);
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
      ir = jfk.makeDictionary(xhr.responseText);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('frm').style.display = 'initial';
      document.getElementById('word').onkeyup = update;
      document.getElementById('unicode').onclick = update;
      document.getElementById('latex').onclick = update;
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
