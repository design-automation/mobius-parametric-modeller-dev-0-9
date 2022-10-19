import { IArgument } from '@models/code';
import { IFlowchart } from '@models/flowchart';
import { INode } from '@models/node';
import { InputType } from '@models/port';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { inline_func, inlineVarString } from '@shared/functions';

import argFormatParser from './parser/PEG_parser_arg_format.js'
import argCodeParser from './parser/PEG_parser_arg_code.js'
import varCodeParser from './parser/PEG_parser_var_code.js'

let allConstants = [];
for (const inline of inline_func) {
    if (inline[0] === 'constants') {
        allConstants = JSON.parse(JSON.stringify(inline[1]));
    }
}
const specialVars = new Set(['undefined', 'null', 'Infinity', 'true', 'false', 'True', 'False', 'None'].concat(allConstants));
const reservedWords = [
    'abstract', 'arguments', 'await', 'boolean',
    'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue',
    'debugger', 'default', 'delete', 'do',
    'double', 'else', 'enum', 'eval',
    'export', 'extends', 'False', 'final',
    'finally', 'float', 'for', 'function',
    'goto', 'if', 'implements', 'import',
    'in', 'instanceof', 'int', 'interface',
    'let', 'long', 'native', 'new',
    'null', 'package', 'private', 'protected',
    'public', 'return', 'short', 'static',
    'super', 'switch', 'synchronized', 'this',
    'throw', 'throws', 'transient', 'true',
    'try', 'typeof', 'var', 'void',
    'volatile', 'while', 'with', 'yield',

    'Array', 'Date', 'hasOwnProperty', 'Infinity',
    'isFinite', 'isNaN', 'isPrototypeOf', 'length',
    'Math', 'NaN', 'name', 'Number', 'Object',
    'prototype', 'String', 'toString', 'undefined', 'valueOf',

    'pythonList', 'JSON', 'stringify', 'parse'
];

const mathFuncs = [];
for (const funcMod of inline_func) {
    for (const func of funcMod[1]) {
        if (typeof func === 'string') {
            mathFuncs.push(func.split('(')[0]);
        } else {
            mathFuncs.push(func[0].split('(')[0]);
        }
    }
}
const funcReplace = {};
for (const line of inlineVarString.split('\n')) {
    if (line === '') {continue;}
    const lineSplit = line.split('= __inline__.');
    let repVal = 'ifn.' + lineSplit[1].trim();
    if (repVal.endsWith(';')) {
        repVal = repVal.slice(0, -1);
    }
    funcReplace[lineSplit[0].trim()] = repVal;
}
let globals = [];

export function updateGlobals(startNode: INode) {
    globals = [];
    for (let i = startNode.procedure.length - 1; i > -1; i-- ) {
        const prod = startNode.procedure[i];
        if (prod.type !== ProcedureTypes.Constant || !prod.args[0] || !prod.args[0].value) { return; }
        prod.args[0].value = prod.args[0].value.toUpperCase();
        globals.push(prod.args[0].value);
        prod.args[0].jsValue = prod.args[0].value + '_';
    }
}

export function modifyVar(procedure: IProcedure, nodeProdList: IProcedure[]) {
    procedure.variable = null;
    if (!procedure.args[0].value) { return; }

    procedure.args[0].value = modifyVarArg(procedure.args[0]).trim();
    const modifiedVar = parseVariable(procedure.args[0].value);
    procedure.args[0].jsValue = modifiedVar.jsStr;
    if (modifiedVar.valueStr) {
        procedure.args[0].value = modifiedVar.valueStr.trim();
    }

    if (modifiedVar.error) {
        procedure.args[0].invalidVar = modifiedVar.error;
        return;
    }
    if (modifiedVar.declaredVar) {
        procedure.variable = modifiedVar.declaredVar;
        if (globals.indexOf(procedure.variable) !== -1) {
            procedure.args[0].invalidVar = `Error: Variable shadowing global constant: ${procedure.variable}`;
            return;
        }
    }
    if (modifiedVar.usedVars) {
        const result = checkValidVar(modifiedVar.usedVars, procedure, nodeProdList);
        if (!result.error) {
            procedure.args[0].usedVars = result.vars;
        } else {
            procedure.args[0].invalidVar = result.error;
            return;
        }
    }
    procedure.args[0].invalidVar = false;
}

export function modifyLocalFuncVar(procedure: IProcedure, nodeProdList: IProcedure[]) {
    procedure.variable = null;
    if (!procedure.args[0].value) { return; }
    if (!procedure.meta) {
        procedure.meta = {
            'name': '',
            'module': '',
            'otherInfo': {
                'prev_name': procedure.args[0].value,
                'num_returns': null
            }
        };
    } else if (!procedure.meta.otherInfo) {
        procedure.meta.otherInfo = {
            'prev_name': procedure.args[0].value,
            'num_returns': null
        };
    }
    procedure.meta.otherInfo.num_returns = findLocalFuncNumReturns(procedure.children);

    const declaredVars = [];
    let argToLower = false;
    procedure.args.forEach(arg => {
        if (!arg.value) { return; }
        arg.value = modifyVarArg(arg, argToLower).replace(/[\@\#\?]/g, '_');
        argToLower = true;
        arg.jsValue = arg.value + '_';
        if (arg.name === 'func_name') { return; }
        arg.usedVars = [arg.value];

        const existingCheck = declaredVars.indexOf(arg.value);
        if (existingCheck !== -1) {
            arg.invalidVar = `Error: Argument name "${arg.value}" already exists`;
            procedure.args[existingCheck + 1].invalidVar = `Error: Argument name "${arg.value}" already exists`;
        }
        declaredVars.push(arg.value);
    });
    for (const prod of nodeProdList) {
        if (prod.ID === procedure.ID) {
            continue;
        }
        if (prod.type === ProcedureTypes.LocalFuncDef && procedure.args[0].value === prod.args[0].value) {
            procedure.args[0].invalidVar = `Error: Function name "${procedure.args[0].value}" already exists`;
            return;
        }
    }
    updateLocalFuncProperties(nodeProdList, procedure.meta.otherInfo, procedure.args);
    procedure.args[0].invalidVar = false;
    procedure.meta.otherInfo.prev_name = procedure.args[0].value;
}

function findLocalFuncNumReturns(procedureList: IProcedure[]): number {
    let num_returns = 0;
    for (const prod of procedureList) {
        if (prod.type === ProcedureTypes.Return && prod.enabled) {
            num_returns ++;
        }
        if (prod.children) {
            num_returns += findLocalFuncNumReturns(prod.children);
        }
    }
    return num_returns;
}

function updateLocalFuncProperties(prodList: IProcedure[],
                                   oldFuncInfo: {'prev_name': string, 'num_returns': number},
                                   newFuncArgs: IArgument[]) {
    for (const prod of prodList) {
        if (prod.children) {
            updateLocalFuncProperties(prod.children, oldFuncInfo, newFuncArgs);
            continue;
        }
        if (prod.type === ProcedureTypes.LocalFuncCall && prod.meta.name === oldFuncInfo.prev_name) {

            if (oldFuncInfo.num_returns > 0 && prod.args[0].name === '__none__') {
                prod.args[0].name = 'var_name';
            } else if (oldFuncInfo.num_returns === 0 && prod.args[0].name === 'var_name') {
                prod.args[0].name = '__none__';
            }
            prod.meta.name = newFuncArgs[0].value;
            let i = 1;
            for (; i < newFuncArgs.length; i++) {
                if (i >= prod.args.length) {
                    prod.args.push(<IArgument> {
                        'name': 'arg_' + prod.argCount,
                        'value': '',
                        'jsValue': '',
                        'usedVars': [],
                        'linked': false,
                        'invalidVar': false
                    });
                    prod.argCount++;
                    continue;
                }
                prod.args[i].name = newFuncArgs[i].value;
            }
            while (i < prod.argCount - 1) {
                prod.args.pop();
                prod.argCount--;
            }
        }
    }
}


export function modifyVarArg(arg: IArgument, toLower = true) {
    let str = arg.value.trim();
    const repSplit = str.split(/\[/g);
    let bracketCount = -1;
    for (let i = 0; i < repSplit.length; i++) {
        bracketCount += 1;
        repSplit[i] = repSplit[i].split(/\]/g);
        bracketCount -= repSplit[i].length - 1;
        if (bracketCount === 0) {
            repSplit[i][repSplit[i].length - 1] = repSplit[i][repSplit[i].length - 1].replace(/ /g, '_');
            if (toLower) {
                repSplit[i][repSplit[i].length - 1] = repSplit[i][repSplit[i].length - 1].toLowerCase();
            }
        } else if (bracketCount < 0) {
            throw(new Error('Error: bracket closed before opening'));
        }
    }
    str = repSplit.map(splt => splt.join(']')).join('[').trim();

    if ((str.match(/\[/g) || []).length !== (str.match(/\]/g) || []).length) {
        arg.invalidVar = 'Error: Invalid variable name';
        return str;
    }

    const strSplit = str.split(/[\@\[\]\,]/g);
    let teststr = str;
    for (const i of strSplit) {
        if (i === '') { continue; }
        if (i === '0' || Number(i)) {
            const sStr = `[${i}]`;
            const ind = teststr.indexOf(sStr);
            if (ind === -1) {
                arg.invalidVar = 'Error: Invalid variable name - cannot be a number';
                return str;
            }
            teststr = teststr.slice(0, ind) + teststr.slice(ind + sStr.length);
            continue;
        }
        try {
            if (i[0] === '_') {
                arg.invalidVar = 'Error: Invalid variable name - cannot start variable name with "_"';
                return str;
            }
            for (const reserved of reservedWords) {
                if (i === reserved) {
                    arg.invalidVar = 'Error: Invalid variable name - reserved word';
                    return str;
                }
            }
            for (const funcName of mathFuncs) {
                if (i === funcName) {
                    arg.invalidVar = 'Error: Invalid variable name - existing math function name';
                    return str;
                }
            }
            arg.invalidVar = false;
        } catch (ex) {
            arg.invalidVar = 'Error: Invalid variable name';
            return str;
        }
    }
    return str;
}

export function modifyArgument(procedure: IProcedure, argIndex: number, nodeProdList: IProcedure[]) {
    procedure.args[argIndex].usedVars = [];
    if (!procedure.args[argIndex].value || procedure.args[argIndex].value === '"___LONG_STRING_DATA___"') { return; }
    // PARSER CALL
    let varResult = parseArgument(procedure.args[argIndex].value);
    if (varResult.error) {
        procedure.args[argIndex].invalidVar = varResult.error;
        return;
    }
    procedure.args[argIndex].value = varResult.str;
    procedure.args[argIndex].jsValue = varResult.jsStr;
    varResult = checkValidVar(varResult.vars, procedure, nodeProdList);
    if (!varResult.error) {
        procedure.args[argIndex].usedVars = varResult.vars;
        procedure.args[argIndex].invalidVar = false;
    } else {
        procedure.args[argIndex].invalidVar = varResult.error;
    }

    
}

export function parseVariable(value: string): {'error'?: string, 'declaredVar'?: string[],
                                               'usedVars'?: string[], 'jsStr'?: string, 'valueStr'?: string} {
    const parseOption = {
        funcReplace: funcReplace,
        varDeclared: new Set<string>(),
        varUsed: new Set<string>(),
        specialVars: specialVars,
        valString: [null]
    }
    let codeParse;
    try {
        codeParse = varCodeParser.parse(value, parseOption).trim()
        return {
            usedVars: parseOption.varUsed.size > 0 ? Array.from(parseOption.varUsed) : null,
            declaredVar: parseOption.varDeclared.size > 0 ? Array.from(parseOption.varDeclared) : null,
            valueStr: parseOption.valString[0] !== null ? parseOption.valString[0] : null,
            jsStr: codeParse.trim()
        };
    } catch(ex) {
        console.log('--------------------------------')
        console.log('ERROR STRING: ', value)
        console.log('ERROR MESSAGE:', ex)
        return {
            error: ex.message
        }
    }
}


// NEW ARGUMENT INPUT
export function parseArgument(str: string): {'error'?: string, 'vars'?: string[], 'str'?: string, 'jsStr'?: string} {
    ////////////////////
    const parseOption = {
        funcReplace: funcReplace,
        varUsed: new Set<string>(),
        specialVars: specialVars
    }
    try {
        const formatParse = argFormatParser.parse(str, parseOption).trim()
        const codeParse = argCodeParser.parse(str, parseOption).trim()
        return {
            vars: Array.from(parseOption.varUsed),
            str: formatParse.trim(),
            jsStr: codeParse.trim()
        };
    } catch(ex) {
        return {
            error: ex.message
        }
    }
}


/**
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * _________________ CHECK IF THE VARIABLES USED ARE VALID __________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 *
*/
export function checkValidVar(vars: string[], procedure: IProcedure, nodeProdList: IProcedure[]): {'error'?: string, 'vars'?: string[]} {
    let current = procedure;
    const validVars = [];
    // check global variables
    for (const glb of globals) {
        const i = vars.indexOf(glb);
        if (i !== -1) {
            validVars.push(vars.splice(i, 1)[0]);
        }
    }
    while (current.parent) {
        const prods = current.parent.children;
        for (const prod of prods) {
            if (typeof prod.variable === 'string') {
                prod.variable = [prod.variable];
            }
            if (prod.ID === current.ID) {
                if (current.type !== ProcedureTypes.Foreach) {
                    break;
                } else {
                    prod.variable.forEach( v => {
                        const i = vars.indexOf(v);
                        if (i !== -1) {
                            validVars.push(vars.splice(i, 1)[0]);
                        }
                    });
                    break;
                }
            }
            if (!prod.variable || prod.type === ProcedureTypes.Foreach || !prod.enabled) { continue; }
            if (typeof prod.variable === 'string') { prod.variable = [prod.variable]; }
            for (const v of prod.variable) {
                const index = vars.indexOf(v);
                if (index !== -1) {
                    validVars.push(vars.splice(index, 1)[0]);
                }
            }
        }
        current = current.parent;
        if (current.type === ProcedureTypes.LocalFuncDef) {
            for (let i = 1; i < current.args.length; i++) {
                const index = vars.indexOf(current.args[i].value);
                if (index !== -1) {
                    validVars.push(vars.splice(index, 1)[0]);
                }
            }
        }
    }
    if (vars.length === 0) {
        return {'vars': validVars};
    }
    for (const prod of nodeProdList) {
        if (prod.ID === current.ID) {
            if (current.type !== ProcedureTypes.Foreach) {
                break;
            } else {
                prod.variable.forEach( v => {
                    const i = vars.indexOf(v);
                    if (i !== -1) {
                        validVars.push(vars.splice(i, 1)[0]);
                    }
                });

                break;
            }
        }
        if (!prod.variable || prod.type === ProcedureTypes.Foreach || !prod.enabled) { continue; }
        if (typeof prod.variable === 'string') { prod.variable = [prod.variable]; }
        for (const v of prod.variable) {
            const index = vars.indexOf(v);
            if (index !== -1) {
                validVars.push(vars.splice(index, 1)[0]);
            }
        }
    }
    if (vars.length > 0) {
        return { 'error': `Error: Invalid vars: ${vars.join(', ')}`};
    }
    return {'vars': validVars};
}

/**
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * _____________________________ CHECK VALIDITY _____________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 * __________________________________________________________________________
 *
*/
export function checkFlowchartValidity(flowchart: IFlowchart) {
    for (const func of flowchart.functions) {
        for (const node of func.flowchart.nodes) {
            checkNodeValidity(node);
        }
    }
    if (flowchart.subFunctions) {
        for (const func of flowchart.subFunctions) {
            for (const node of func.flowchart.nodes) {
                checkNodeValidity(node);
            }
        }
    }
    for (const node of flowchart.nodes) {
        checkNodeValidity(node);
    }
}

export function checkNodeValidity(node: INode) {
    if (node.type === 'start') {
        updateGlobals(node);
    }
    const full_prod_list = node.localFunc.concat(node.procedure);
    checkProdListValidity(full_prod_list, full_prod_list);
}

function checkProdListValidity(prodList: IProcedure[], nodeProdList: IProcedure[]) {
    for (const prod of prodList) {
        if (!prod.enabled) { continue; }
        switch (prod.type) {
            case ProcedureTypes.Variable:
            case ProcedureTypes.Foreach:
                modifyVar(prod, nodeProdList);
                modifyArgument(prod, 1, nodeProdList);
                break;
            case ProcedureTypes.MainFunction:
            case ProcedureTypes.globalFuncCall:
            case ProcedureTypes.LocalFuncCall:
                if (prod.args[0].name !== '__none__') {
                    modifyVar(prod, nodeProdList);
                }
                for (let i = 1; i < prod.argCount; i++) {
                    if (prod.args[i].name[0] === '_') { continue; }
                    modifyArgument(prod, i, nodeProdList);
                }
                break;
            case ProcedureTypes.If:
            case ProcedureTypes.Elseif:
            case ProcedureTypes.While:
            case ProcedureTypes.Return:
                if (prod.args.length > 0) {
                    modifyArgument(prod, 0, nodeProdList);
                }
                break;
            case ProcedureTypes.Constant:
                if (prod.meta.inputMode === InputType.Constant || prod.meta.inputMode === InputType.SimpleInput) {
                    modifyArgument(prod, 1, nodeProdList);
                }
                break;
            case ProcedureTypes.EndReturn:
                modifyArgument(prod, 0, nodeProdList);
                break;
            case ProcedureTypes.LocalFuncDef:
                modifyLocalFuncVar(prod, nodeProdList);

        }
        if (prod.children) {
            checkProdListValidity(prod.children, nodeProdList);
        }
        if (prod.argCount === 0) {
            continue;
        }
        for (const arg of prod.args) {
            arg.linked = false;
        }
    }
}

export function checkConstantShadowing(node: INode): string {
    if (checkProdShadowingConstant(node.procedure)) {
        return `, "${node.name}"`;
    }
    return '';
}

function checkProdShadowingConstant(prodList: IProcedure[]): boolean {
    let check = false;
    for (const prod of prodList) {
        switch (prod.type) {
            case ProcedureTypes.Variable:
            case ProcedureTypes.MainFunction:
            case ProcedureTypes.globalFuncCall:
                if (prod.args[0].name !== '__none__' && globals.indexOf(prod.args[0].value) !== -1) {
                    prod.args[0].invalidVar = `Error: Variable shadowing global constant: ${prod.args[0].value}`;
                    check = true;
                } else if (prod.args[0].invalidVar && (<string>prod.args[0].invalidVar).indexOf('Variable shadowing global constant')) {
                    prod.args[0].invalidVar = false;
                }
                break;
        }
        if (prod.children) {
            check = check || checkProdShadowingConstant(prod.children);
        }
    }
    return check;
}
