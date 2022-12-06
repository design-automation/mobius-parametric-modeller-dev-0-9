const fs = require('fs');

// const argVar = `"use strict"
// var extra = {
//   funcReplace: {},
//   varUsed: new Set()
// }
// `
// // const argExport = `  parse: peg$parse,
// //   extra: extra
// // };`
// const argCodeFn =  `    const rep = options.funcReplace[expr1]`
// const argCodeVarUsed =  `    if (options.funcReplace[text()]){
//         return 'JSON.parse(JSON.stringify(' + options.funcReplace[text()] + '))';
//     } else if (options.specialVars.has(text())) {
//       return text();
//     }
//     options.varUsed.add(text());`

const argError = `
  let i = 0;
  while (i < expected.length) {
    const eI = expected[i];
    if (eI.description === "whitespace") { expected.splice(i, 1)}
    else { i++ }
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";`
let argFormat = fs.readFileSync('src/app/shared/parser/PEG_parser_arg_format.js').toString()
argFormat = argFormat.replace('  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";', argError)
fs.writeFileSync('src/app/shared/parser/PEG_parser_arg_format.js', argFormat)

// let argCode = fs.readFileSync('src/app/shared/parser/PEG_parser_arg_code.js').toString()
// // argCode = argCode.replace('"use strict";\n\n', argVar)
// // argCode = argCode.replace('  parse: peg$parse\n};', argExport)
// // argCode = argCode.replace("    const rep = expr1 // <<<<<<<<<<< FUNCTION CALL >>>>>>>>>>>", argCodeFn)
// // argCode = argCode.replace("    const VAR_USED = null", argCodeVarUsed)
// fs.writeFileSync('src/app/shared/parser/PEG_parser_arg_code.js', argCode)