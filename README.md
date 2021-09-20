# IPA-JFK

> IPA narrow transcription of English words in New York City accent

## Online Demo Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/6cc76b39-d72c-4d05-9959-0d57d6b8b6e4/deploy-status)](https://app.netlify.com/sites/ipa-jfk/deploys)

You can lookup words on our hassle-free **[Demo Website](https://jfk.b1f6c1c4.info/)**!

## Prerequisites

- Node.js 12.18.3 or 14.x+
- npm or yarn
- [Parcel](https://v2.parceljs.org/) (for demo and deployment usage; NOT the DEPRECATED `parcel-bundler`!!!)

## Install CLI

```bash
# For cli or global usage:
npm i -g ipa-jfk
# or:
yarn global add ipa-jfk

# For local usage:
npm i ipa-jfk
# or:
yarn add ipa-jfk
```

## Local Demo

Additional instruction for Windows users: Remember to amend `scripts.prepare` and `scripts.start` fields in `package.json` prior to running:

> "prepare": "node ./scripts/download.js"  
> ...  
> "start": "node ./bin/jfk.js"

```bash
npm i
# or:
yarn install
```
```bash
npm run demo
# or:
yarn demo
# A server will be running at http://localhost:1234
```

## CLI Usage

```bash
jfk [--unicode|--html|--latex] [--phonemic] <word> [<phoneme>...]
```

- Output format:
    - `--unicode`: *(default)* UTF-8 encoded [IPA in unicode](https://en.wikipedia.org/wiki/Phonetic_symbols_in_Unicode).
    - `--html`: HTML entities of IPA in unicode.
    - `--latex`: LaTeX script for the [TIPA package](https://ctan.org/pkg/tipa).
- `--phonemic`: Disable narrow transcription, only use broad one.
- `<word>`: Which word to translate.
- `<phoneme>`: The reference phonemes to use.

## Library Usage

```js
const jfk = require('ipa-jfk');

// Cache the whole database to speed up future lookups
jfk.cacheDatabase();

// Get phonemes (it returns an array)
const [ph] = jfk.queryDatabase('<word>');
// Alternatively, you can supply your own phonemes.

// Get phonetics
// The third parameter is phonemic/phonetic switch.
const ir = jfk.process('<word>', ph, false);

// Output
console.log(jfk.unicode(ir));
console.log(jfk.html(ir));
console.log(jfk.latex(ir));
```

## FAQ

- How do you get these?

    > Phonemes are retrived from [The CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict).
    > Phonemes are translated into allophones using a fixed set of rules.

- I don't understand the complex syntax!

    > Go back and learn IPA. The *real* [IPA](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet), not simplified ones. Including [diacritics](https://en.wikipedia.org/wiki/International_Phonetic_Alphabet#Diacritics).

- I live in NYC and this is not my accent.

    > You may open an issue here, but we are unlikely to change the rules.

- Too few words available.

    > You should blame [CMU](http://www.speech.cs.cmu.edu/cgi-bin/cmudict).
    > Alternatively, use the reference phonemes in [ARPAbet format](http://www.speech.cs.cmu.edu/cgi-bin/cmudict#phones).

- Some phonemes are totally incorrect.

    > Also blame [CMU](http://www.speech.cs.cmu.edu/cgi-bin/cmudict).
    > You may want to override it by using reference phonemes.

- Syllabification or /&aelig;/-raising incorrect.

    > You may want to override it by using hints (undocumented feature). See the source code.

## License

This project is licensed under GNU AGPL v3.0 only. (AGPL-3.0-only).

