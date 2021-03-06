import { FUNCS_ASYNC } from '@design-automation/mobius-sim-funcs';
import { INode } from '@models/node';
import { InputType, IPortInput } from '@models/port';
import { IFunction, IProcedure, ProcedureTypes } from '@models/procedure';

let _terminateCheck: string;

export class CodeUtils {


    static getProcedureCode(prod: IProcedure, existingVars: string[], isMainFlowchart: Boolean,
                            functionName: string, nodeId: string, usedFunctions?: string[]): string[] {
        if (_terminateCheck === '' || prod.enabled === false ||
            prod.type === ProcedureTypes.Blank ||
            prod.type === ProcedureTypes.Comment) { return []; }

        // mark _terminateCheck to terminate all process after this
        if (prod.type === ProcedureTypes.Terminate && prod.enabled) {
            // _terminateCheck = '';
            return ['$p.terminated = true;', 'return null;'];
        }

        prod.hasError = false;
        let specialPrint = false;
        let loopVarIndex = null;
        if (prod.children) {
            loopVarIndex = existingVars.length;
        }
        let codeStr: string[] = [];
        const args = prod.args;
        let prefix = '';
        if (args) {
            prefix =
            args.hasOwnProperty('0') && args[0].jsValue && args[0].jsValue.indexOf('[') === -1
            && existingVars.indexOf(args[0].jsValue) === -1 ? 'let ' : '';
        }
        codeStr.push('');
        if (isMainFlowchart && prod.type !== ProcedureTypes.Else 
            && prod.type !== ProcedureTypes.Elseif
            && prod.type !== ProcedureTypes.LocalFuncDef) {
            codeStr.push(`$p.currentProcedure[0] = "${prod.ID}";`);
        }

        switch ( prod.type ) {
            case ProcedureTypes.Variable:
                if (!args[0].jsValue) {
                    codeStr.push(`${args[1].jsValue};`);
                    break;
                }
                if (args[0].jsValue.startsWith('|*')) {
                    const varList = args[0].jsValue.substring(2).split('|');
                    const varDict = [];
                    const assembledVarList = [];
                    for (let ind = 0; ind < varList.length; ind++) {
                        if (varList[ind].indexOf('@') !== -1) {
                            const tempVar = `tempVar${ind}__`;
                            varDict.push([varList[ind], tempVar]);
                            assembledVarList.push(tempVar);
                        } else {
                            if (varList[ind].indexOf('[') === -1 && existingVars.indexOf(varList[ind]) === -1) {
                                existingVars.push(varList[ind])
                                codeStr.push(`let ${varList[ind]};`)
                            }
                            assembledVarList.push(varList[ind]);
                        }
                    }
                    codeStr.push(`[${assembledVarList.join(',')}] = ${args[1].jsValue};`);
                    for (const varSet of varDict) {
                        const repVar = this.repSetAttrib(varSet[0]);
                        if (!repVar) {
                            codeStr.push(`${prefix}${varSet[0]} = ${varSet[1]};`);
                        } else {
                            codeStr.push(`${repVar[0]} ${varSet[1]} ${repVar[1]}`);
                        }
                    }
                } else {
                    const repVar = this.repSetAttrib(args[0].jsValue);
                    if (!repVar) {
                        codeStr.push(`${prefix}${args[0].jsValue} = ${args[1].jsValue};`);
                        if (prefix === 'let ') {
                            existingVars.push(args[0].jsValue);
                        }
                    } else {
                        codeStr.push(`${repVar[0]} ${args[1].jsValue} ${repVar[1]}`);
                    }
                }
                break;

            case ProcedureTypes.If:
                specialPrint = true;
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,` +
                    `\`Evaluating If: (${args[0].value}) is \` + (${args[0].jsValue}), '__null__');`);
                }
                codeStr.push(`if (${args[0].jsValue}){`);
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,'Executing If', '__null__');`);
                }
                break;

            case ProcedureTypes.Else:
                specialPrint = true;
                codeStr.push(`else {`);
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,'Executing Else', '__null__');`);
                }
                break;

            case ProcedureTypes.Elseif:
                specialPrint = true;
                codeStr.push(`else {`);
                if (isMainFlowchart) {
                    codeStr.push(`$p.currentProcedure[0] = "${prod.ID}";`);
                    // if (prod.print) {
                    //     codeStr.push(`printFunc($p.console,` +
                    //     `'Evaluating Else-if: (${args[0].value}) = ' + (${args[0].jsValue}), '__null__');`);
                    // }
                }
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,` +
                    `\`Evaluating Else-if: (${args[0].value}) is \` + (${args[0].jsValue}), '__null__');`);
                }
                codeStr.push(`if(${args[0].jsValue}){`);
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,'Executing Else-if', '__null__');`);
                }
                break;

            case ProcedureTypes.Foreach:
                specialPrint = true;
                codeStr.push(`for (${prefix} ${args[0].jsValue} of ${args[1].jsValue}){`);
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,` +
                    `'Executing For-each: ${args[0].value} = ' + (${args[0].jsValue}), '__null__');`);
                }
                existingVars.push(args[0].jsValue);
                break;

            case ProcedureTypes.While:
                specialPrint = true;
                codeStr.push(`while (${args[0].jsValue}){`);
                // if (isMainFlowchart && prod.print) {
                if (prod.print) {
                    codeStr.push(`printFunc($p.console,` +
                    `'Executing While: (${args[0].value}) = ' + (${args[0].jsValue}), '__null__');`);
                }
                break;

            case ProcedureTypes.Break:
                codeStr.push(`break;`);
                break;

            case ProcedureTypes.Continue:
                codeStr.push(`continue;`);
                break;

            case ProcedureTypes.Constant:
                if (!isMainFlowchart) {
                    return [];
                }
                let constName = args[0].jsValue;
                if (constName[0] === '"' || constName[0] === '\'') {
                    constName = args[0].jsValue.substring(1, args[0].jsValue.length - 1);
                }
                codeStr.push(`$p['constants']['${constName}'] = ${prod.resolvedValue};`);

                break;


            case ProcedureTypes.EndReturn:
                let check = true;
                const returnArgVals = [];
                for (const arg of args) {
                    if (arg.name === '__constList__') {
                        returnArgVals.push('$p.constants');
                        continue;
                    }
                    if (arg.name === '__model__') {
                        // returnArgVals.push('$p.model');
                        continue;
                    }
                    if (!arg.jsValue) {
                        check = false;
                        break;
                    }
                    if (arg.jsValue[0] === '#') {
                        returnArgVals.push('`' + arg.jsValue + '`');
                        continue;
                    }
                    returnArgVals.push(arg.jsValue);
                }
                if (!check) {
                    codeStr.push(`return null;`);
                } else {
                    codeStr.push(`let __return_value__ = ${returnArgVals.join(', ')};`);
                    if (isMainFlowchart) {
                        codeStr.push(`if (__return_value__ !== undefined && __return_value__ !== null) {` +
                                     `$p.console.push('<p><b>Return: <i>' + ` +
                                     `__return_value__.toString().replace(/,/g,', ') + '</i></b></p>');` +
                                     `} else {` +
                                     `$p.console.push('<p><b>Return: <i> null </i></b></p>');` +
                                     `}`);
                    }
                    codeStr.push(`return __return_value__;`);
                }
                break;

            case ProcedureTypes.MainFunction:
                const argVals = [];
                for (const arg of args.slice(1)) {
                    if (arg.name === '__constList__') {
                        argVals.push('$p.constants');
                        continue;
                    }
                    if (arg.name === '__model__') {
                        // argVals.push('$p.model');
                        continue;
                    }
                    if (arg.name === '__console__') {
                        argVals.push('$p.console');
                        continue;
                    }
                    if (arg.name === '__fileName__') {
                        argVals.push('$p.fileName');
                        continue;
                    }

                    if (arg.jsValue && arg.jsValue[0] === '#') {
                        argVals.push('`' + arg.jsValue + '`');
                        continue;
                    }
                    argVals.push(arg.jsValue);
                }
                if (prod.resolvedValue) {
                    let prodResolvedCheck = false;
                    for (let i = 0; i < argVals.length; i++) {
                        if (argVals[i].indexOf('://') !== -1) {
                            argVals[i] = prod.resolvedValue;
                            prod.resolvedValue = null;
                            prodResolvedCheck = true;
                            break;
                        }
                    }
                    if (!prodResolvedCheck) {
                        argVals[1] = prod.resolvedValue;
                    }
                }
                // const argValues = argVals.join(', ');
                let fnCall = `mfn.${prod.meta.module}.${prod.meta.name}( ${argVals.join(', ')} )`;
                const fullName = prod.meta.module + '.' + prod.meta.name;
                for (const asyncFunc of FUNCS_ASYNC) {
                    if (fullName === asyncFunc) {
                        fnCall = 'await ' + fnCall;
                        break;
                    }
                }
                if ( prod.meta.module.toUpperCase() === 'OUTPUT') {
                    if (prod.args[prod.args.length - 1].jsValue) {
                        codeStr.push(`return ${fnCall};`);
                    }
                } else if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${fnCall};`);
                } else if (args[0].jsValue.startsWith('|*')) {
                    const varList = args[0].jsValue.substring(2).split('|');
                    const varDict = [];
                    const assembledVarList = [];
                    for (let ind = 0; ind < varList.length; ind++) {
                        if (varList[ind].indexOf('@') !== -1) {
                            const tempVar = `tempVar${ind}__`;
                            varDict.push([varList[ind], tempVar]);
                            assembledVarList.push(tempVar);
                        } else {
                            if (varList[ind].indexOf('[') === -1 && existingVars.indexOf(varList[ind]) === -1) {
                                existingVars.push(varList[ind])
                                codeStr.push(`let ${varList[ind]};`)
                            }
                            assembledVarList.push(varList[ind]);
                        }
                    }
                    codeStr.push(`[${assembledVarList.join(',')}] =  ${fnCall};`);
                    for (const varSet of varDict) {
                        const repVar = this.repSetAttrib(varSet[0]);
                        if (!repVar) {
                            codeStr.push(`${prefix}${varSet[0]} = ${varSet[1]};`);
                        } else {
                            codeStr.push(`${repVar[0]} ${varSet[1]} ${repVar[1]}`);
                        }
                    }
                } else {
                    const repfuncVar = this.repSetAttrib(args[0].jsValue);
                    if (!repfuncVar) {
                        codeStr.push(`${prefix}${args[0].jsValue} = ${fnCall};`);
                        if (prefix === 'let ') {
                            existingVars.push(args[0].jsValue);
                        }
                    } else {
                        codeStr.push(`${repfuncVar[0]} ${fnCall} ${repfuncVar[1]}`);
                    }
                }
                break;
            case ProcedureTypes.LocalFuncDef:
                // const funcDef_prefix = `${functionName}_${nodeId}_`;
                let funcDef_prefix = `${nodeId}_`;
                if (! isMainFlowchart) {
                    funcDef_prefix = `${functionName}_` + funcDef_prefix;
                }
                codeStr.push(`\nasync function ${funcDef_prefix}${prod.args[0].jsValue}` +
                             `($p, ${prod.args.slice(1).map(arg => arg.jsValue).join(', ')}) {`);
                break;
            case ProcedureTypes.Return:
                if (prod.args.length > 0) {
                    codeStr.push(`return ${prod.args[0].jsValue};`);
                    break;
                }
                codeStr.push(`return;`);
                break;
            case ProcedureTypes.LocalFuncCall:
                const lArgsVals: any = [];
                // const funcCall_prefix = `${functionName}_${nodeId}_`;
                let funcCall_prefix = `${nodeId}_`;
                if (! isMainFlowchart) {
                    funcCall_prefix = `${functionName}_` + funcCall_prefix;
                }
                // let urlCheck = false;
                for (let i = 1; i < args.length; i++) {
                    lArgsVals.push(args[i].jsValue);
                }

                const lfn = `await ${funcCall_prefix}${prod.meta.name}_($p${lArgsVals.map(val => ', ' + val).join('')})`;
                if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${lfn};`);
                    codeStr.push('if ($p.terminated) { return mfn.getModel();}')
                    break;
                } else if (args[0].jsValue.startsWith('|*')) {
                    const varList = args[0].jsValue.substring(2).split('|');
                    const varDict = [];
                    const assembledVarList = [];
                    for (let ind = 0; ind < varList.length; ind++) {
                        if (varList[ind].indexOf('@') !== -1) {
                            const tempVar = `tempVar${ind}__`;
                            varDict.push([varList[ind], tempVar]);
                            assembledVarList.push(tempVar);
                        } else {
                            if (varList[ind].indexOf('[') === -1 && existingVars.indexOf(varList[ind]) === -1) {
                                existingVars.push(varList[ind])
                                codeStr.push(`let ${varList[ind]};`)
                            }
                            assembledVarList.push(varList[ind]);
                        }
                    }
                    codeStr.push(`[${assembledVarList.join(',')}] =  ${lfn};`);
                    for (const varSet of varDict) {
                        const repVar = this.repSetAttrib(varSet[0]);
                        if (!repVar) {
                            codeStr.push(`${prefix}${varSet[0]} = ${varSet[1]};`);
                        } else {
                            codeStr.push(`${repVar[0]} ${varSet[1]} ${repVar[1]}`);
                        }
                    }
                    break;
                }
                const lRepImpVar = this.repSetAttrib(args[0].jsValue);
                if (!lRepImpVar) {
                    codeStr.push(`${prefix}${args[0].jsValue} = ${lfn};`);
                } else {
                    codeStr.push(`${lRepImpVar[0]} ${lfn} ${lRepImpVar[1]}`);
                }

                if (prefix === 'let ') {
                    existingVars.push(args[0].jsValue);
                }
                codeStr.push('if ($p.terminated) { return mfn.getModel();}')
                break;

            case ProcedureTypes.globalFuncCall:
                const argsVals: any = [];
                const namePrefix = functionName ? `${functionName}_` : '';

                // let urlCheck = false;
                if (isMainFlowchart) {
                    usedFunctions.push(prod.meta.name);
                }
                const prepArgs = [];
                for (let i = 1; i < args.length; i++) {
                    const arg = args[i];
                    if (arg.type.toString() !== InputType.URL.toString()) {
                        argsVals.push(arg.jsValue);
                        // argsVals.push(this.repGetAttrib(arg.jsValue));
                    } else {
                        argsVals.push(prod.resolvedValue);
                    }
                    if (arg.isEntity) {
                        prepArgs.push(argsVals[argsVals.length - 1]);
                    }
                }

                codeStr.push(`$p.console.push('<div style="margin: 5px 0px 5px 10px; border: 1px solid #E6E6E6"><p><b> Global Function: ${prod.meta.name}</b></p>');`);
                codeStr.push(`$p.curr_ss.${nodeId} = mfn.model.snapshotPrepGlobalFunc([${prepArgs.join(', ')}]);`);
                // if (prepArgs.length === 0) {
                //     codeStr.push(`$p.curr_ss.${nodeId} = mfn.model.snapshotPrepGlobalFunc([${argsVals[0]}]);`);
                // } else {
                //     codeStr.push(`$p.curr_ss.${nodeId} = mfn.model.snapshotPrepGlobalFunc([${prepArgs.join(', ')}]);`);
                // }
                const fn = `await ${namePrefix}${prod.meta.name}($p${argsVals.map(val => ', ' + val).join('')})`;
                // codeStr.push(`$p.prevModel = mfn.getModel().clone();`);
                if (args[0].name === '__none__' || !args[0].jsValue) {
                    codeStr.push(`${fn};`);
                } else if (args[0].jsValue.startsWith('|*')) {
                    const varList = args[0].jsValue.substring(2).split('|');
                    const varDict = [];
                    const assembledVarList = [];
                    for (let ind = 0; ind < varList.length; ind++) {
                        if (varList[ind].indexOf('@') !== -1) {
                            const tempVar = `tempVar${ind}__`;
                            varDict.push([varList[ind], tempVar]);
                            assembledVarList.push(tempVar);
                        } else {
                            if (varList[ind].indexOf('[') === -1 && existingVars.indexOf(varList[ind]) === -1) {
                                existingVars.push(varList[ind])
                                codeStr.push(`let ${varList[ind]};`)
                            }
                            assembledVarList.push(varList[ind]);
                        }
                    }
                    codeStr.push(`[${assembledVarList.join(',')}] =  ${fn};`);
                    for (const varSet of varDict) {
                        const repVar = this.repSetAttrib(varSet[0]);
                        if (!repVar) {
                            codeStr.push(`${prefix}${varSet[0]} = ${varSet[1]};`);
                        } else {
                            codeStr.push(`${repVar[0]} ${varSet[1]} ${repVar[1]}`);
                        }
                    }
                } else {
                    const repImpVar = this.repSetAttrib(args[0].jsValue);
                    if (!repImpVar) {
                        codeStr.push(`${prefix}${args[0].jsValue} = ${fn};`);
                    } else {
                        codeStr.push(`${repImpVar[0]} ${fn} ${repImpVar[1]}`);
                    }
                    if (prefix === 'let ') {
                        existingVars.push(args[0].jsValue);
                    }
                }
                codeStr.push(`mfn.model.snapshotPostGlobalFunc($p.curr_ss.${nodeId})`);
                codeStr.push(`$p.console.push('</div>')`);
                break;
            case ProcedureTypes.Error:
                codeStr.push(`$p.misc.exit = true;`);
                codeStr.push(`$p.misc.exit_value = ${prod.args[0].jsValue};`);
                codeStr.push(`throw new Error('__EXIT__');`);
                break;
            case ProcedureTypes.BreakBranch:
                codeStr.push(`$p.misc.breakbranch['${nodeId}'] = true;`);
                codeStr.push(`throw new Error('__BREAK_BRANCH__');`);
                break;
        }

        // if (isMainFlowchart && prod.print && !specialPrint && prod.args[0].name !== '__none__' && prod.args[0].jsValue) {
        if (prod.print && !specialPrint && prod.args[0].name !== '__none__' && prod.args[0].jsValue) {
                // const repGet = prod.args[0].jsValue;
            if (prod.args[0].jsValue.startsWith('|*')) {
                const varList = args[0].jsValue.substring(2).split('|');
                const assembledVarList = [];
                for (let ind = 0; ind < varList.length; ind++) {
                    if (varList[ind].indexOf('@') !== -1) {
                        assembledVarList.push(`tempVar${ind}__`);
                    } else {
                        if (varList[ind].indexOf('[') === -1 && existingVars.indexOf(varList[ind]) === -1) {
                            existingVars.push(varList[ind])
                            codeStr.push(`let ${varList[ind]};`)
                        }
                        assembledVarList.push(varList[ind]);
                    }
                }
                codeStr.push(`printFunc($p.console,\`${prod.args[0].value}\`, [${assembledVarList.join(', ')}]);`);
            } else {
                const repGet = this.repGetAttrib(prod.args[0].jsValue);
                codeStr.push(`printFunc($p.console,\`${prod.args[0].value}\`, ${repGet});`);
            }
        }
        if (prod.children) {
            codeStr = codeStr.concat(CodeUtils.getProdListCode(prod.children, existingVars, isMainFlowchart,
                                                               functionName, nodeId, usedFunctions));
            codeStr.push(`}`);
            if (loopVarIndex) {
                existingVars.splice(loopVarIndex);
            }
        }

        // mark _terminateCheck to terminate all process after this
        if (prod.terminate && prod.enabled) {
            codeStr.push('$p.terminated = true;');
            codeStr.push('return null;');
        }

        return codeStr;
    }

    static getProdListCode(prodList: IProcedure[], existingVars: string[], isMainFlowchart: Boolean,
                           functionName: string, nodeId: string, usedFunctions?: string[]): string[] {
        let codeStr = [];
        let elifcount = 0;
        for (const p of prodList) {
            const procedureCode = CodeUtils.getProcedureCode(p, existingVars, isMainFlowchart,
                functionName, nodeId, usedFunctions);
            if ( p.type === ProcedureTypes.Elseif && p.enabled) {
                codeStr = codeStr.concat(procedureCode);
                elifcount++;
            } else if (p.type === ProcedureTypes.Else && p.enabled) {
                codeStr = codeStr.concat(procedureCode);
                while (elifcount > 0) {
                    codeStr.push('}');
                    elifcount--;
                }
            } else {
                while (elifcount > 0) {
                    codeStr.push('}');
                    elifcount--;
                }
                codeStr = codeStr.concat(procedureCode);
            }
        }
        while (elifcount > 0) {
            codeStr.push('}');
            elifcount--;
        }
        return codeStr;
    }

    static repSetAttrib(val: string) {
        if (!val || val.indexOf('@') === -1) {
            return false;
        }
        // get two parts, before @ and after @
        let val_0: string;
        let val_1: string;
        const atIndex: number = val.indexOf('@');
        if (atIndex === 0) {
            val_0 = null;
            val_1 = val.slice(1);
        } else {
            val_0 = val.slice(0, atIndex);
            val_1 = val.slice(atIndex + 1);
        }
        const bracketIndex = val_1.indexOf('[pythonList(');
        if (bracketIndex !== -1) {
            const name = val_1.slice(0, bracketIndex);
            const index = val_1.lastIndexOf(name);
            // return [`mfn.attrib.Set($p.model, ${val_0}, '${name}', ` +
            //         `${val_1.substring(bracketIndex + 12, index - 2)},`, `);`];
            return [`mfn.attrib.Set(${val_0},` +
                    `[\`${name}\`, ${val_1.substring(bracketIndex + 12, index - 2)}], `, `);`];
        } else {
            // return [`mfn.attrib.Set($p.model, ${val_0}, '${val_1}', null, `, ');'];
            return [`mfn.attrib.Set(${val_0}, \`${val_1}\`, `, ');'];
        }
    }

    static repGetAttrib(val: string) {
        if (!val) { return; }
        const res = val.split('@');
        if (res.length === 1 ) {
            return val;
        }
        let entity = res[0];
        if (res[0] === '') {
            entity = 'null';
        }

        let att_name;
        let att_index;
        let bracketIndex = res[1].indexOf('.slice(');
        if (bracketIndex !== -1) {
            att_name = res[1].slice(0, bracketIndex);
            att_index = res[1].slice(bracketIndex + 7, -4);
        } else {
            att_name = res[1];
            att_index = 'null';
        }
        bracketIndex = res[1].indexOf('[pythonList(');
        if (bracketIndex !== -1) {
            att_name = res[1].slice(0, bracketIndex);
            const index = res[1].lastIndexOf(att_name);
            att_index = res[1].substring(bracketIndex + 12, index - 2)
        }

        if (att_index === 'null') {
            return `mfn.attrib.Get(${entity}, '${att_name}', 'one_value')`;
        }
        return `mfn.attrib.Get(${entity}, ['${att_name}', ${att_index}], 'one_value')`;
        // return `mfn.attrib.Get(${entity}, '${att_name}', ${att_index}, 'one_value')`;
    }

    static async getURLContent(url: string): Promise<any> {
        url = url.replace('http://', 'https://');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        if (url[0] === '"' || url[0] === '\'') {
            url = url.substring(1);
        }
        if (url[url.length - 1] === '"' || url[url.length - 1] === '\'') {
            url = url.substring(0, url.length - 1);
        }
        const p = new Promise((resolve) => {
            const fetchObj = fetch(url);
            fetchObj.catch(err => {
                resolve('HTTP Request Error: Unable to retrieve file from ' + url);
            });
            fetchObj.then(res => {
                if (!res.ok) {
                    resolve('HTTP Request Error: Unable to retrieve file from ' + url);
                    return '';
                }
                if (url.indexOf('.zip') !== -1) {
                    res.blob().then(body => resolve(body));
                } else {
                    res.text().then(body => resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1')));
                }
            // }).then(body => {
            //     resolve(body.replace(/(\\[bfnrtv\'\"\\])/g, '\\$1'));
            });

        });
        return await p;
    }

    static async getStartInput(arg, inputMode): Promise<any> {
        const val = arg.jsValue || arg.value;
        let result = val;
        if (inputMode.toString() === InputType.URL.toString() ) {
            result = await CodeUtils.getURLContent(val);
            if (result.indexOf('HTTP Request Error') !== -1) {
                throw(new Error(result));
            }
            result = '`' + result + '`';
        } else if (inputMode.toString() === InputType.File.toString()) {
            result = window.localStorage.getItem(val.name);
            if (!result) {
                const p = new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        resolve('File Reading Error: unable to read file ' + val.name);
                    };
                    reader.readAsText(val);
                });
                result = await p;
                if (result.indexOf('File Reading Error') !== -1) {
                    throw(new Error(result));
                }
                result = '`' + result + '`';
                // let savedFiles: any = window.localStorage.getItem('savedFileList');
                // if (!savedFiles) {
                //     window.localStorage.setItem('savedFileList', `["${val.name}"]`);
                // } else {
                //     savedFiles = JSON.parse(savedFiles);
                //     window.localStorage.removeItem(savedFiles[0]);
                //     window.localStorage.setItem('savedFileList', `["${val.name}"]`);
                // }
                // window.localStorage.setItem(val.name, result);
                arg.jsValue = {'name': val.name};
            }
        }
        return result;
    }



    static getInputValue(inp: IPortInput, node: INode, nodeIndices: {}): number[] {
        const input = [];
        for (const edge of inp.edges) {
            if (!edge.source.parentNode.enabled) {
                continue;
            }
            input.push(edge.source.parentNode.model);
        }
        return input;
    }

    public static getNodeCode(node: INode, isMainFlowchart = false, nodeIndices: {},
                              functionName: string, nodeId: string, usedFunctions?: string[]): [string[][], string] {
        node.hasError = false;
        let codeStr = [];

        // reset terminate check to false at start node (only in main flowchart's start node).
        // for every node after that, if terminate check is true, do not execute the node.
        if (!isMainFlowchart) {
            // do nothing
        } else if (node.type === 'start') {
            _terminateCheck = null;
        } else if (_terminateCheck) {
            return [undefined, _terminateCheck];
        }
        let varsDefined: string[];

        // procedure
        for (const prod of node.localFunc) {
            varsDefined = [];
            for (const arg of prod.args.slice(1)) {
                varsDefined.push(arg.jsValue);
            }
            codeStr = codeStr.concat(CodeUtils.getProcedureCode(prod, varsDefined, isMainFlowchart, functionName,
                                                                nodeId, usedFunctions));
        }

        // input initializations
        if (isMainFlowchart) {
            node.input.value = CodeUtils.getInputValue(node.input, node, nodeIndices);
        }


        codeStr.push('_-_-_+_-_-_');
        varsDefined = [];

        codeStr = codeStr.concat(CodeUtils.getProdListCode(node.procedure, varsDefined, isMainFlowchart, functionName,
                                                           nodeId, usedFunctions));

        if (_terminateCheck === '') {
            _terminateCheck = node.name;
        }

        return [[codeStr, varsDefined], _terminateCheck];
    }

    static getFunctionString(func: IFunction): string {
        func.args.forEach(arg => arg.name = arg.name.toUpperCase());
        let fullCode = `async function ${func.name}($p${func.args.map(arg => ', ' + arg.name + '_').join('')}){\n`;

        let fnCode = `var merged;\n`;

        const numRemainingOutputs = {};
        const nodeIndices = {};
        let nodeIndex = 0;
        for (const node of func.flowchart.nodes) {
            if (!node.enabled) {
                continue;
            }
            nodeIndices[node.id] = nodeIndex;
            nodeIndex ++;
            numRemainingOutputs[node.id] = node.output.edges.length;
            const nodeFuncName = `${func.name}_${node.id}`;
            if (node.type === 'start') {
                // fnCode += `let result_${nodeFuncName} = $p.model;\n`;
                fnCode += `let ssid_${nodeFuncName} = mfn.model.snapshotGetActive();\n`;
            } else {
                const codeRes = CodeUtils.getNodeCode(node, false, nodeIndices, func.name, node.id)[0];
                const nodecode = codeRes[0].join('\n').split('_-_-_+_-_-_');
                fullCode += `${nodecode[0]}\nasync function ${nodeFuncName}` +
                            `($p${func.args.map(arg => ', ' + arg.name + '_').join('')}){\n` +
                            `if (mfn.getModel().debug) { printFunc($p.console, 'Executing: ${node.name.replace(/\\/g, '').replace(/\n/g, ' ')}', '__null__') }\n` +
                            nodecode[1] + `\n}\n\n`;


                if (node.type !== 'end' && node.input.edges.length === 1 && node.input.edges[0].source.parentNode.output.edges.length === 1) {
                    fnCode += `\nlet ssid_${nodeFuncName} = ssid_${func.name}_${node.input.edges[0].source.parentNode.id};\n`;
                } else {
                    let activeNodes = [];
                    for (const nodeEdge of node.input.edges) {
                        if (!nodeEdge.source.parentNode.enabled) {
                            continue;
                        }
                        numRemainingOutputs[nodeEdge.source.parentNode.id] --;
                        activeNodes.push([nodeIndices[nodeEdge.source.parentNode.id], `ssid_${func.name}_${nodeEdge.source.parentNode.id}`]);
                    }
                    activeNodes = activeNodes.sort((a, b) => a[0] - b[0]);
                    fnCode += `\nlet ssid_${nodeFuncName} = mfn.model.snapshotNext([${activeNodes.map(nodeId => nodeId[1]).join(', ')}]);\n`;
                }
                if (node.type === 'end') {
                    fnCode += `\nreturn await ${nodeFuncName}($p${func.args.map(arg => ', ' + arg.name + '_').join('')});\n`;
                } else {
                    fnCode += `\nawait ${nodeFuncName}($p${func.args.map(arg => ', ' + arg.name + '_').join('')});\n`;
                }
            }
        }
        fnCode += '}\n\n';
        fullCode += fnCode;

        return fullCode;
    }


}
