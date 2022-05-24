import { SIMFuncs } from '@design-automation/mobius-sim-funcs';
import { VERSION } from '@env/version';
import { IMobius } from '@models/mobius';
import { INode } from '@models/node';
import { InputType } from '@models/port';
import { ProcedureTypes } from '@models/procedure';
import * as Flatted from 'flatted';

import { ModuleList, primary_func } from './functions';

// import * as deprecated from '@assets/core/deprecated.json';

const deprecated = {default: []}

export function checkMobFile(file: IMobius) {
    if (file.version === VERSION.version) {
        return;
    }
    checkFileVersion(file.version);
    // check the end node
    // checkEndReturn(file);
    // check if there's any missing procedure in each node
    let hasError = false;
    for (const node of file.flowchart.nodes) {
        if (!checkMissingProd(node.procedure, file.version, node)) {
            node.hasError = true;
            hasError = true;
        }
        if (node.localFunc && !checkMissingProd(node.localFunc, file.version, node)) {
            node.hasError = true;
            hasError = true;
        }
    }
    updateNode(file.flowchart);
    for (const flFn of file.flowchart.functions ) { updateNode(flFn.flowchart); }
    if (file.flowchart.subFunctions) {
        for (const flSFn of file.flowchart.subFunctions) { updateNode(flSFn.flowchart); }
    }
    if (hasError) {
        alert('The flowchart contains functions that do not exist in the current version of Mobius');
    }

    // check all user defined functions
    for (const userDefFunc of file.flowchart.functions) {
        if (!userDefFunc.flowchart) { continue; }
        for (const node of userDefFunc.flowchart.nodes) {
            if (!checkMissingProd(node.procedure, file.version, node)) {
                alert('User Defined Function ' + userDefFunc.name +
                      ' contains functions that do not exist in the current version of Mobius');
            }
        }
    }
    if (file.flowchart.subFunctions) {
        for (const userDefFunc of file.flowchart.subFunctions) {
            if (!userDefFunc.flowchart) { continue; }
            for (const node of userDefFunc.flowchart.nodes) {
                if (!checkMissingProd(node.procedure, file.version, node)) {
                    alert('User Defined Function ' + userDefFunc.name +
                          ' contains functions that do not exist in the current version of Mobius');
                }
            }
        }
    }
    file.version = VERSION.version;
}

function updateNode(flowchart) {
    for (const node of flowchart.nodes) {
        if (node.type === 'start') {
            let addCheck = true;
            for (let i = 0; i < node.procedure.length; i++) {
                const prod = node.procedure[i];
                if (prod.type === ProcedureTypes.Constant) {
                    addCheck = false;
                    if (prod.meta.module === 'ParamBlank') {
                        break;
                    } else {
                        const newProd = {
                            type: ProcedureTypes.Constant,
                            ID: 'parameters_blank',
                            parent: undefined,
                            meta: {
                                description: '',
                                inputMode: InputType.Constant,
                                module: 'ParamBlank',
                                name: 'Constant',
                            },
                            children: undefined,
                            variable: undefined,
                            argCount: 0,
                            args: [],
                            print: false,
                            enabled: false,
                            selected: false,
                            terminate: false,
                            hasError: false
                        };
                        node.procedure.splice(i, 0, newProd);
                        break;
                    }
                }
            }
            if (addCheck) {
                node.procedure.push({
                    type: ProcedureTypes.Constant,
                    ID: 'parameters_blank',
                    parent: undefined,
                    meta: {
                        description: '',
                        inputMode: InputType.Constant,
                        module: 'ParamBlank',
                        name: 'Constant',
                    },
                    children: undefined,
                    variable: undefined,
                    argCount: 0,
                    args: [],
                    print: false,
                    enabled: false,
                    selected: false,
                    terminate: false,
                    hasError: false
                });
            }
        }
        if (node.type === 'end') {
            node.procedure[node.procedure.length - 1].ID = 'Return';
        }

        if (!node.localFunc) {
            node.localFunc = [{type: 13, ID: 'local_func_blank',
            parent: undefined,
            meta: {name: '', module: ''},
            variable: undefined,
            children: undefined,
            argCount: 0,
            args: [],
            print: false,
            enabled: true,
            selected: false,
            selectGeom: false,
            hasError: false}];
        }

        if (node.state.show_code === undefined) { node.state.show_code = node.type !== 'start'; }
        if (node.state.show_func === undefined) { node.state.show_func = node.type !== 'start'; }
    }
}

function checkMissingProd(prodList: any[], fileVersion: string, node: INode) {
    let check = true;
    const funcs = new SIMFuncs();
    for (const prod of prodList) {
        // check the children procedures if the procedure has any
        if (prod.children) {
            if (!checkMissingProd(prod.children, fileVersion, node)) {
                check = false;
            }
        }

        let i = 0;
        while (i < prod.args.length) {
            if (prod.args[i].name === '__model__') {
                prod.args.splice(i, 1);
                prod.argCount -= 1;
                continue;
            }
            i++;
        }

        prod.hasError = false;

        if (prod.type === ProcedureTypes.Break) {
            let topProd = prod;
            let switchCheck = true;
            while (topProd.parent) {
                if (topProd.parent.type === ProcedureTypes.Foreach || topProd.parent.type === ProcedureTypes.While) {
                    switchCheck = false;
                    break;
                }
                topProd = topProd.parent;
            }
            if (switchCheck) {
                prod.type = ProcedureTypes.Return;
                if (node.type === 'end') {
                    prod.argCount = 1;
                    prod.args = [{name: 'Value', value: undefined}];
                    const endreturn = node.procedure[node.procedure.length - 1];
                    prod.args[0].value = endreturn.args[0].value;
                    prod.args[0].jsValue = endreturn.args[0].jsValue;
                } else {
                    prod.argCount = 0;
                    prod.args = [];
                }
            }
        }

        // the part below is only for function procedures, skip everything else
        if (prod.type !== ProcedureTypes.MainFunction) { continue; }


        // @ts-ignore
        for (const dpFn of deprecated.default) {
            if (dpFn.old_func.name.toLowerCase() === prod.meta.name.toLowerCase() &&
                dpFn.old_func.module.toLowerCase() === prod.meta.module.toLowerCase()) {
                let data: any;
                for (const mod of primary_func) {
                    if (mod[0].toLowerCase() === dpFn.new_func.module.toLowerCase()) {
                        for (const modfn of mod[1]) {
                            if (modfn.toLowerCase() === dpFn.new_func.name.toLowerCase()) {
                                const fn = ModuleList[mod[0]][modfn];
                                data = Flatted.parse(Flatted.stringify(fn));
                                break;
                            }
                        }
                        break;
                    }
                }
                if (dpFn.old_func.module === dpFn.new_func.module
                && dpFn.old_func.name === dpFn.new_func.name && prod.argCount === (data.argCount + 1)
                && !dpFn.new_func.values && !dpFn.new_func.replace) { break; }
                // console.log(prod)
                prod.meta = { module: data.module, name: data.name};
                prod.argCount = data.argCount + 1;
                let returnArg = {name: 'var_name', value: 'var', jsValue: 'var'};
                if (!data.hasReturn) {
                    returnArg = {name: '__none__', value: undefined, jsValue: undefined};
                } else if (prod.args[0].name !== '__none__') {
                    returnArg.value = prod.args[0].value;
                }
                for (const arg of data.args) {
                    let UpdateCheck = false;
                    for (const oldArg of prod.args) {
                        if (arg.name.toLowerCase() === oldArg.name.toLowerCase()) {
                            arg.value = oldArg.value;
                            break;
                        }
                    }
                    for (const updatedArg in dpFn.new_func.replace) {
                        if (updatedArg.toLowerCase() === arg.name.toLowerCase()) {
                            if (typeof dpFn.new_func.replace[updatedArg] === 'string') {
                                for (const oldArg of prod.args) {
                                    if ( dpFn.new_func.replace[updatedArg].toLowerCase() === oldArg.name.toLowerCase()) {
                                        arg.value = oldArg.value;
                                        break;
                                    }
                                }
                            } else {
                                for (const rep_set of dpFn.new_func.replace[updatedArg]) {
                                    if (rep_set[0] === '*' || arg.value === rep_set[0]) {
                                        arg.value = rep_set[1];
                                        UpdateCheck = true;
                                        break;
                                    }
                                }
                                if (UpdateCheck) { break; }
                            }
                        }
                    }
                    if (arg.value) { continue; }
                    for (const updatedArg in dpFn.new_func.values) {
                        if (updatedArg.toLowerCase() === arg.name.toLowerCase()) {
                            arg.value = dpFn.new_func.values[updatedArg];
                            UpdateCheck = true;
                            break;
                        }
                    }
                }
                prod.args = [ returnArg, ...data.args];
                // console.log(prod)
                break;
            }
        }
        if (!funcs[prod.meta.module] || !funcs[prod.meta.module][prod.meta.name]) {
            prod.hasError = true;
            check = false;
        }
    }
    return check;
}

function checkFileVersion(fileVersion) {
    console.log('File version:', fileVersion);
    const fileVer = fileVersion.split('.');
    if (fileVer[0] === '0' && Number(fileVer[1]) < 7) {
        alert(`Outdated file: File Version of ${fileVersion}. May be incompatible with current version of Mobius.`);
        // throw new Error(`Unable to open outdated file: File Version of ${fileVersion}. Requires file version of 0.7.x`);
    }
}

