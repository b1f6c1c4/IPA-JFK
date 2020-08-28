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
    }
  }
};
xhr.open('GET', cmu);
xhr.send();
