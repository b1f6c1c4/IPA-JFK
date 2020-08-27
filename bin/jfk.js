#!/usr/bin/env node

const yargs = require('yargs');
const jfk = require('..');

const { argv } = yargs
  .scriptName('jfk')
  .usage('$0 [<options>] <word>')
  .strict()
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Hint: You may need this: findbug --help.')
  .version()
  .option('unicode', {
    describe: 'Output UTF-8 encoded IPA in unicode.',
    type: 'boolean',
  })
  .option('html', {
    describe: 'Output HTML entities of IPA in unicode.',
    type: 'boolean',
  })
  .option('latex', {
    describe: 'Output LaTeX script for the TIPA package.',
    type: 'boolean',
  })
  .check((argv) => {
    const v = +!!argv.unicode + +!!argv.html + +!!argv.latex;
    if (v > 1)
      throw new Error('Error: Only one of --unicode, --html, --latex may be specified.');
    if (v === 0)
      argv.unicode = true;
    return true;
  });

if (argv._.length !== 1) {
  console.error('Error: Missing the <word> you want to translate. See jfk --help for help.');
  process.exit(1);
}

if (argv.unicode) {
  console.log(jfk.unicode(argv._[0]));
} else if (argv.html) {
  console.log(jfk.html(argv._[0]));
} else { // if (argv.latex) {
  console.log(jfk.latex(argv._[0]));
}
