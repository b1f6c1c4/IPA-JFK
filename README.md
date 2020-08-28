# IPA-JFK

> IPA narrow transcription of English words in New York City accent

## Demo Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/6cc76b39-d72c-4d05-9959-0d57d6b8b6e4/deploy-status)](https://app.netlify.com/sites/ipa-jfk/deploys)

You can lookup words on our hassle-free **[Demo Website](https://jfk.b1f6c1c4.info/)**!

## Install

```bash
# For cli or global usage:
npm i -g ipa-jfk
# For local usage:
npm i ipa-jfk
```

## CLI Usage

```bash
jfk [--unicode|--html|--latex] <word>
```

- Output format:
    - `--unicode`: *(default)* UTF-8 encoded [IPA in unicode](https://en.wikipedia.org/wiki/Phonetic_symbols_in_Unicode).
    - `--html`: HTML entities of IPA in unicode.
    - `--latex`: LaTeX script for the [TIPA package](https://ctan.org/pkg/tipa).
- `<word>`: which word to translate.

## Library Usage

```js
const jfk = require('ipa-jfk');

console.log(jfk.unicode('<word>'));
console.log(jfk.html('<word>'));
console.log(jfk.latex('<word>'));
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

- Some phonemes are totally incorrect.

    > Also blame [CMU](http://www.speech.cs.cmu.edu/cgi-bin/cmudict).

## License

This project is licensed under GNU AGPL v3.0 only. (AGPL-3.0-only).

