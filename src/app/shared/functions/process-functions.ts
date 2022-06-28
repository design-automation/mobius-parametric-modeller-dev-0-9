import inlinedoc from '@assets/typedoc-json/doc-inline.json';
import doc from '@assets/typedoc-json/doc.json';
import { FUNCS_ASYNC, SIMFuncs } from '@design-automation/mobius-sim-funcs';
import { IArgument } from '@models/code';
import { IFunction } from '@models/procedure';
import * as showdown from 'showdown';


// const doc = require('@assets/typedoc-json/doc.json');
const mdConverter = new showdown.Converter({ literalMidWordUnderscores: true, simpleLineBreaks: true });
const module_list = {};
const extraMods = ['variable', 'comment', 'expression',
    'control_flow', 'global_func', 'local_func',
    'dashboard', 'editor', 'flowchart', 'gallery', 'menu',
    'console', 'geoviewer', 'cadviewer', 'vrviewer'];

/**
 * DOCUMENTATION
 */

function analyzeParamType(fn, paramType) {
    if (paramType.type === 'array') {
        return `${analyzeParamType(fn, paramType.elementType)}[]`;
    } else if (paramType.type === 'intrinsic' || paramType.type === 'reference') {
        return paramType.name;
    } else if (paramType.type === 'union') {
        return paramType.types.map((tp: any) => analyzeParamType(fn, tp)).join(' | ');
    } else if (paramType.type === 'tuple') {
        return '[' + paramType.elements.map((tp: any) => analyzeParamType(fn, tp)).join(', ') + ']';
    } else {
        /**
         * TODO: Update unrecognized param type here
         */
        console.log('param type requires updating:', paramType);
        console.log('in function:', fn.module + '.' + fn.name);
        return paramType.type;
    }
}
function addDoc(mod, modName, docs) {
    const moduleDoc = {};
    if (mod.comment && mod.comment.shortText) {
        moduleDoc['description'] = mod.comment.shortText;
    }
    if (!mod.children) { return; }
    for (const func of mod.children) {
        const fn = {};
        fn['name'] = func.name;
        fn['module'] = modName;
        if (modName === 'constants' || func['kind'] === 32) {
            fn['description'] = func['comment'].shortText;
            moduleDoc[func.name] = fn;
        }
        if (!func['signatures']) { continue; }
        if (func['signatures'][0].comment) {
            const cmmt = func['signatures'][0].comment;
            fn['description'] = cmmt.shortText;
            if (cmmt.text) {
                fn['description'] = fn['description'] + cmmt.text;
            }
            if (cmmt.tags) {
                for (const fnTag of cmmt.tags) {
                    if (fnTag.tag === 'summary') {
                        fn['summary'] = fnTag.text;
                    } else {
                        if (fn[fnTag.tag]) {
                            fn[fnTag.tag].push(fnTag.text);
                        } else {
                            fn[fnTag.tag] = [fnTag.text];
                        }

                    }
                }
            }
            fn['returns'] = cmmt.returns;
            if (fn['returns']) { fn['returns'] = fn['returns'].trim(); }
        }
        fn['parameters'] = [];
        if (func['signatures'][0].parameters) {
            for (const param of func['signatures'][0].parameters) {
                if (param.name === '__model__') { continue; }
                // let namecheck = true;
                // for (const systemVarName in _parameterTypes) {
                //     if (param.name === _parameterTypes[systemVarName]) {
                //         namecheck = false;
                //         break;
                //     }
                // }
                // if (!namecheck) {
                //     continue;
                // }
                const pr = {};

                pr['name'] = param.name;
                if (param.comment) {
                    pr['description'] = param.comment.shortText || param.comment.text;
                    // if (pr['description']) {
                    //     pr['description'] = mdConverter.makeHtml(pr['description']).replace(/\n/g, '<br/>')
                    // }
                }
                pr['type'] = analyzeParamType(fn, param.type);
                fn['parameters'].push(pr);
            }
        }
        if (fn['description']) {
            fn['description'] = mdConverter.makeHtml(fn['description']).replace(/\\n/g, '<br/>');
        }
        moduleDoc[func.name] = fn;
    }
    docs[modName] = moduleDoc;
}

const moduleDocs = {};
const inlineDocs = {};
// const functionDocs = {};
for (const mod of doc.children) {
    let modName: any = mod.sources[0].fileName.replace(/"/g, '').replace(/'/g, '').split('/');
    modName = modName[modName.length - 1];
    if (modName === 'index' || modName === 'categorization') {
        continue;
    }
    addDoc(mod, mod.name, moduleDocs);
}

addDoc(inlinedoc, 'inline', inlineDocs)
// for (const mod of inlinedoc.children) {
//     if (mod.name.toLowerCase().startsWith('inline')) { continue; }
//     addDoc(mod, mod.name, inlineDocs);
// }

/**
 * MAIN FUNCTIONS
 */

function extract_params(func: Function, asyncCheck: boolean): [IArgument[], boolean] {
    const fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).split(','); // .match( /([^\s,]+)/g);
    if (result === null || result[0] === '') {
        result = [];
    }
    const final_result = result.map(function (r) {
        r = r.trim();
        const r_value = r.split('=');

        if (r_value.length === 1) {
            return { name: r_value[0].trim(), value: undefined };
        } else {
            return { name: r_value[0].trim(), value: undefined };
        }

    });
    let hasReturn = true;
    if (asyncCheck) {
        if (fnStr.split('return').length === 2) {
            hasReturn = false;
        }
    } else if (fnStr.indexOf('return') === -1 || fnStr.indexOf('return;') !== -1) {
        hasReturn = false;
    }
    return [final_result, hasReturn];
}
const mobiusFuncs = new SIMFuncs();
const moduleNames = Object.getOwnPropertyNames(mobiusFuncs);

for (const m_name of moduleNames) {
    if (m_name === '__model__' || m_name.endsWith('Model')) { continue; }
    const modObj = {};
    const funcNames = Object.getOwnPropertyNames(Object.getPrototypeOf(mobiusFuncs[m_name]));
    for (const fn_name of funcNames) {
        if (fn_name === 'constructor') { continue; }

        const func = mobiusFuncs[m_name][fn_name];

        const fnObj = <IFunction>{};
        fnObj.module = m_name;
        fnObj.name = fn_name;
        fnObj.argCount = func.length;
        let asyncCheck = false;
        if (FUNCS_ASYNC.indexOf(`${m_name}.${fn_name}`) !== -1) {
            asyncCheck = true;
        }
        const args = extract_params(func, asyncCheck);
        fnObj.args = args[0];
        fnObj.hasReturn = args[1];
        modObj[fn_name] = fnObj;
    }
    module_list[m_name] = modObj;
}

export const ModuleList = module_list;
export const ModuleDocList = moduleDocs;
export const InlineDocList = inlineDocs['inline'];

console.log(inlineDocs)
console.log(inlinedoc)