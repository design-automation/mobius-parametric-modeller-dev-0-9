import { Component } from '@angular/core';
import { IArgument } from '@models/code';
import { IFlowchart } from '@models/flowchart';
import { InputType } from '@models/port';
import { IFunction, ProcedureTypes } from '@models/procedure';
import { DataService } from '@services';
import { CodeUtils } from '@shared/components/execute/code.util';
import { checkNodeValidity } from '@shared/parser';
import { IdGenerator } from '@utils';

import { printFuncString, pythonListFunc } from '../execute/execute.component';
import { DownloadUtils } from './download.utils';

// import {js as beautify} from 'js-beautify';
@Component({
  selector: 'javascript-save',
  template:  `<button id='savejavascript' class='btn' (click)='download()'>Save</button>`,
  styles: [
            `
            button.btn{
                margin: 0px 0px 0px 0px;
                font-size: 10px;
                line-height: 12px;
                border: 2px solid gray;
                border-radius: 4px;
                padding: 2px 5px;
                background-color: #3F4651;
                color: #E7BF00;
                font-weight: 600;
                text-transform: uppercase;
             }
            button.btn:hover{
                background-color: gray;
                color: white;
            }
             `
          ]
})
// component for saving the javascript code to hard disk
export class SaveJavascriptComponent {

    constructor(private dataService: DataService) {}

    async download() {
        const fl = this.dataService.flowchart;

        // create function and documentation of the function
        let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
        if (funcName.match(/^[\d_]/)) {
            funcName = 'func' + funcName;
        }
        const func: IFunction = <IFunction>{
            flowchart: <IFlowchart>{
                id: fl.id ? fl.id : IdGenerator.getId(),
                name: fl.name,
                nodes: fl.nodes,
                edges: fl.edges
            },
            name: 'exec_' + funcName,
            module: 'globalFunc',
            doc: null,
            importedFile: ''
        };

        func.args = [];
        let argString = ``;
        for (const prod of fl.nodes[0].procedure) {
            if (!prod.enabled || prod.type !== ProcedureTypes.Constant || prod.argCount === 0) { continue; }
            let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            const arg = <IArgument>{
                name: v,
                value: prod.args[prod.argCount - 1].value,
                type: prod.meta.inputMode,
            };
            if (typeof arg.value === 'string') {
                let val = arg.value;
                if (val.startsWith('"') || val.startsWith('\'') || val.startsWith('`')) {
                    val = val.slice(1);
                }
                if (val.endsWith('"') || val.endsWith('\'') || val.endsWith('`')) {
                    val = val.slice(0, -1);
                }
                arg.value = val;
            }
            func.args.push(arg);
            if (prod.meta.inputMode === InputType.Slider) {
                arg.min = prod.args[1].min;
                arg.max = prod.args[1].max;
                arg.step = prod.args[1].step;
            }
            argString += '// Parameter: ' + JSON.stringify(arg) + '\n';
        }
        func.argCount = func.args.length;

        for (const node of fl.nodes) {
            checkNodeValidity(node);
        }
        const end = fl.nodes[fl.nodes.length - 1];
        const returnProd = end.procedure[end.procedure.length - 1];
        if (returnProd.args[0].value) {
            func.hasReturn = true;
        } else {
            func.hasReturn = false;
        }

        // for (const node of func.flowchart.nodes) {
        //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
        // }
        let fnString = CodeUtils.getFunctionString(func);

        for (const i of fl.functions) {
            // for (const node of i.flowchart.nodes) {
            //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
            // }
            const nFunc = <IFunction> {
                module: i.module,
                name: func.name + '_' + i.name,
                argCount: i.argCount,
                hasReturn: i.hasReturn,
                args: i.args,
                flowchart: i.flowchart
            };
            fnString = CodeUtils.getFunctionString(nFunc) + fnString;
        }
        if (fl.subFunctions) {
            for (const i of fl.subFunctions) {
                // for (const node of i.flowchart.nodes) {
                //     await  ExecuteComponent.resolveImportedUrl(node, false, node.type === 'start');
                // }
                const nFunc = <IFunction> {
                    module: i.module,
                    name: func.name + '_' + i.name,
                    argCount: i.argCount,
                    hasReturn: i.hasReturn,
                    args: i.args,
                    flowchart: i.flowchart
                };
                fnString = CodeUtils.getFunctionString(nFunc) + fnString;
            }
        }

        if (this.dataService.mobiusSettings.debug === undefined) { this.dataService.mobiusSettings.debug = true; }

        fnString =
            `/**\n * to use this code: import ${funcName} from this js file as well as the GI module\n` +
            ` * run ${funcName} with the GI module as input along with other start node input\n` +
            ` * e.g.:\n` +
            ` * const ${funcName} = require('./${funcName}.js').${funcName}\n` +
            ` * const module = require('gi-module')\n` +
            ` * const result = await ${funcName}(module, start_input_1, start_input_2, ...);\n *\n` +
            ` * returns: a json object:\n` +
            ` *   _ result.model -> gi model of the flowchart\n` +
            ` *   _ result.result -> returned output of the flowchart, if the flowchart does not return any value,` +
            ` result.result is the model of the flowchart\n */\n\n` +
            argString +  '\n\n' +
            `const mfn = require('@design-automation/mobius-sim-funcs').Funcs();\n` +
            `const ifn = require('@design-automation/mobius-inline-funcs').InlineClass(${this.dataService.mobiusSettings.debug});\n\n` +
            `async function ${funcName}(` + func.args.map(arg => arg.name).join(',') + `) {\n\n` +
            `var __model__ = null;\n\n` +
            '/** * **/\n\n' +
            fnString +
            pythonListFunc +
            printFuncString +
            `\n\nconst $p = {};\n` +
            `if (__model__) {\n` +
            `mfn.io.ImportData(__model__, 'gi');\n` +
            `}\n` +
            `mfn._getModel().debug = ${this.dataService.mobiusSettings.debug};\n` +
            `$p["console"] = [];\n` +
            `$p["modules"] = mfn;\n` +
            `$p["curr_ss"] = {};\n` +
            `const result = await exec_${funcName}($p` +
            func.args.map(arg => ', ' + arg.name).join('') +
            `);\n` +
            `if (result === mfn._getModel()) { return { "model": mfn._getModel(), "result": null };}\n` +
            `return {"model": mfn._getModel(), "result": result};\n` +
            '/** * **/' +
            `\n\n}\n\n` +
            `module.exports = ${funcName};\n`;
        // fnString = beautify(fnString, { indent_size: 4, space_in_empty_paren: true });
        const blob = new Blob([fnString], {type: 'application/json'});

        DownloadUtils.downloadFile(funcName + '.js', blob);
    }

}
