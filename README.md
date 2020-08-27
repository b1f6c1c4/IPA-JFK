# IPA-JFK

> IPA narrow transcription of English words in New York City accent

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
    > Phonemes are translated into allophones using [these rules](doc/jfk.pdf).

- I don't understand the complex syntax!

    > Go back and learn IPA. The *real* IPA, not simplified ones. Including modificaiton symbols.

- I live in NYC and this is not my accent.

    > You may open an issue here, but we are unlikely to change the rules.

## License

This project is licensed under GNU AGPL v3.0 only. (AGPL-3.0-only).

