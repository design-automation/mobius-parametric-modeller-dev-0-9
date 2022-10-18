const fs = require('fs');

const argVar = `"use strict"
var extra = {
  funcReplace: {},
  varUsed: new Set()
}
`
// const argExport = `  parse: peg$parse,
//   extra: extra
// };`
const argCodeFn =  `    const rep = options.funcReplace[expr1]`
const argCodeVarUsed =  `    if (options.funcReplace[text()]){
        return 'JSON.parse(JSON.stringify(' + options.funcReplace[text()] + '))';
    } else if (options.specialVars.has(text())) {
      return text();
    }
    options.varUsed.add(text());`

let argFormat = fs.readFileSync('src/app/shared/parser/PEG_parser_arg_format.js').toString()
// argFormat = argFormat.replace('"use strict";\n\n', argVar)
// argFormat = argFormat.replace('  parse: peg$parse\n};', argExport)

let argCode = fs.readFileSync('src/app/shared/parser/PEG_parser_arg_code.js').toString()
// argCode = argCode.replace('"use strict";\n\n', argVar)
// argCode = argCode.replace('  parse: peg$parse\n};', argExport)
argCode = argCode.replace("    const rep = expr1 // <<<<<<<<<<< FUNCTION CALL >>>>>>>>>>>", argCodeFn)
argCode = argCode.replace("    const VAR_USED = null", argCodeVarUsed)
fs.writeFileSync('src/app/shared/parser/PEG_parser_arg_code.js', argCode)