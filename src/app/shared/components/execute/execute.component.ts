import { Component, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { InlineFuncs } from '@design-automation/mobius-inline-funcs';
import { Model, SIMFuncs, EEntType } from '@design-automation/mobius-sim-funcs';
import { FlowchartUtils } from '@models/flowchart';
import { INode } from '@models/node';
import { IProcedure, ProcedureTypes } from '@models/procedure';
import { DataService } from '@services';
import { SaveFileComponent } from '@shared/components/file';
import { WindowMessageComponent } from '@shared/components/window-message/window-message.component';
import { inlineVarString } from '@shared/functions';
import { checkNodeValidity } from '@shared/parser';
import { DataOutputService } from '@shared/services/dataOutput.service';
import JSZip from 'jszip';

import { CodeUtils } from './code.util';

export const pythonListFunc = `
function pythonList(x, l){
    if (typeof x === 'string') { return x; }
    if (x < 0) {
        return x + l;
    }
    return x;
}
`;
export const printFuncString = `
function printFunc(_console, name, value){
    let val;
    let padding_style = 'padding: 2px 0px 2px 10px;';
    if (!value) {
        val = value;
    } else if (value === '__null__') {
        _console.push('<p style="' + padding_style + '"><b><i>_ ' + name + '</i></b></p>');
        return value;
    } else if (typeof value === 'number' || value === undefined) {
        val = value;
    } else if (typeof value === 'string') {
        val = '"' + value.replace(/\\n/g, '<br>') + '"';
    } else if (value.constructor === [].constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ of value) {
            if (!__item__) {
                __value_strings__.push('' + __item__);
                continue;
            }
            if (__item__.constructor === [].constructor || __item__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push(JSON.stringify(__item__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '[<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">]</p>';
        } else {
            val = '[' + __value_strings__.join(', ') + ']';
        }
    } else if (value.constructor === {}.constructor) {
        let __list_check__ = false;
        let __value_strings__ = [];
        for (const __item__ in value) {
            const __value__ = value[__item__];
            if (!__value__) {
                __value_strings__.push('\\<b>"' + __item__ + '\\"</b>' + ': ' + __value__);
                continue;
            }
            if (__value__.constructor === [].constructor || __value__.constructor === {}.constructor) {
                __list_check__ = true;
            }
            __value_strings__.push('\\<b>"' + __item__ + '\\"</b>' + ': ' + JSON.stringify(__value__).replace(/,/g, ', '));
        }
        if (__list_check__) {
            padding_style = 'padding: 2px 0px 0px 10px;';
            val = '{<p style="padding: 0px 0px 2px 40px;">' +
                  __value_strings__.join(',</p><p style="padding: 0px 0px 2px 40px;">') +
                  '</p><p style="padding: 0px 0px 2px 30px;">}</p>';
        } else {
            val = '{' + __value_strings__.join(', ') + '}';
        }
    } else {
        val = value;
    }
    _console.push('<p style="' + padding_style + '"><b><i>_ ' + name+'</i></b>  = ' + val + '</p>');
    return val;
}
`;
const inlineVarNames = inlineVarString.split(';').map(v => v.split('=')[0].trim());

const DEBUG = false;

@Component({
    selector: 'execute',
    templateUrl: 'execute.component.html',
    styleUrls: ['execute.component.scss']
})
export class ExecuteComponent {

    private startTime;
    private isDev = true;
    private triggerCheck: boolean;
    private terminated: string;

    constructor(private dataService: DataService,
                private dataOutputService: DataOutputService,
                private router: Router) {
        this.isDev = isDevMode();
    }

    static async openZipFile(zipFile) {
        let result = '{';
        await JSZip.loadAsync(zipFile).then(async function (zip) {
            for (const filename of Object.keys(zip.files)) {
                // const splittedNames = filename.split('/').slice(1).join('/');
                await zip.files[filename].async('text').then(function (fileData) {
                    result += `"${filename}": \`${fileData.replace(/\\/g, '\\\\')}\`,`;
                });
            }
        });
        result += '}';
        return result;
    }

    async execute(testing?: boolean) {
        this.startTime = performance.now();
        this.triggerCheck = false;
        this.terminated = null;
        this.dataService.timelineDefault = true;
        this.dataService.initiateExecuteModel();


        if (this.dataService.consoleClear) {
            this.dataService.clearLog();
        }
        SaveFileComponent.clearModelData(this.dataService.flowchart, false, false);
        this.saveFileToLocal();

        if (this.dataService.mobiusSettings.debug === undefined) {
            this.dataService.mobiusSettings.debug = true;
        }

        document.getElementById('spinner-on').click();
        this.dataService.log('<br><hr>');

        // reset input of all nodes except start & resolve all async processes (file reading + get url content)
        for (const node of this.dataService.flowchart.nodes) {
            node.hasError = false;
            let EmptyECheck = false;
            let InvalidECheck = false;

            // reset node input value to undefined --> save memory
            if (node.type !== 'start') {
                node.input.value = null;
                // if (node.input.edges) {
                //     node.input.value = null;
                // }
            }

            if (!node.enabled) {
                continue;
            }

            checkNodeValidity(node);

            let validCheck = await this.checkProdValidity(node, node.localFunc);
            InvalidECheck = InvalidECheck || validCheck[0];
            EmptyECheck = EmptyECheck || validCheck[1];
            validCheck = await this.checkProdValidity(node, node.procedure);
            InvalidECheck = InvalidECheck || validCheck[0];
            EmptyECheck = EmptyECheck || validCheck[1];
        }

        // execute the flowchart
        try {
            if (testing) {
                await this.executeFlowchart();
                this.dataService.finalizeLog();
                return;
            } else {
                // setTimeout for 20ms so that the loading screen has enough time to be loaded in
                setTimeout(async () => {
                    await this.executeFlowchart();
                    this.dataService.flowchart.model = this.dataService.executeModel.getModel();
                    this.dataService.finalizeLog();
                    this.dataService.log('<br>');
                    const hudData = this.dataService.executeModel.model.getModelAttribVal('hud') || null;
                    WindowMessageComponent.SendData({
                        messageType: 'execute_end',
                        data: {
                          hud: hudData
                        }
                    });
                }, 20);
            }
        } catch (ex) {
            this.dataService.flowchart.model = this.dataService.executeModel.getModel();
            document.getElementById('spinner-off').click();
        }
    }

    saveFileToLocal() {
        const mainPanelCheck = document.getElementById('headerDialog')
        const mobius_settings = this.dataService.mobiusSettings;
        if (mobius_settings['autosave'] && mainPanelCheck) {
            let fileName = this.dataService.flowchart.name.replace(/\s/g, '_');
            if (fileName.length < 4 || fileName.slice(-4) !== '.mob') {
                fileName += '.mob';
            }
            SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
            // this.dataService.notifyMessage(`Auto-saving Flowchart as ${fileName}`);
        }
    }

    async checkProdValidity(node: INode, prodList: IProcedure[]) {
        let InvalidECheck = false;
        let EmptyECheck = false;
        for (const prod of prodList) {
            // ignore the return, comment and disabled procedures
            if (prod.type === ProcedureTypes.EndReturn || prod.type === ProcedureTypes.Comment || !prod.enabled) { continue; }
            // if there's any invalid argument, flag as having error
            for (const arg of prod.args) {
                if (arg.invalidVar) {
                    node.hasError = true;
                    prod.hasError = true;
                    InvalidECheck = true;
                }
            }

            // for start node constant procedures (start node parameters)
            if (prod.type === ProcedureTypes.Constant) {
                // resolve start node input (URL + File parameters) ... to be revised
                // flag error if catch error (invalid argument value)
                try {
                    prod.resolvedValue = await CodeUtils.getStartInput(prod.args[1], prod.meta.inputMode);
                } catch (ex) {
                    node.hasError = true;
                    prod.hasError = true;
                    if (ex.message.indexOf('HTTP') !== -1 || ex.message.indexOf('File Reading') !== -1) {
                        document.getElementById('spinner-off').click();
                        document.getElementById('Console').click();
                        this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                        const _category = this.isDev ? 'dev' : 'execute';
                        this.dataService.log(`<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: ${ex.message}</h4>`);
                        throw(ex);
                    }
                    InvalidECheck = true;
                }

                // if there's no value for the parameter name or parameter value -> flag error (empty argument)
                if (!prod.args[0].value || (!prod.args[1].value && prod.args[1].value !== 0 && prod.args[1].value !== false)) {
                    node.hasError = true;
                    prod.hasError = true;
                    EmptyECheck = true;
                }
            // any other procedure type that is not start node constant
            } else {
                for (const arg of prod.args) {
                    // ignore arguments that have argument name starting with "_" ("__model__", "__constant__", ...)
                    if (arg.name[0] === '_' || arg.type === 5) {
                        continue;
                    }
                    // if the argument value is empty -> flag error (empty argument)
                    if (arg.value !== 0 && arg.value !== false && !arg.value) {
                        node.hasError = true;
                        prod.hasError = true;
                        EmptyECheck = true;
                    }
                }
            }
            if (prod.children) {
                const childrenCheck = this.checkProdValidity(node, prod.children);
                InvalidECheck = InvalidECheck || childrenCheck[0];
                EmptyECheck = EmptyECheck || childrenCheck[1];
            }
        }
        return [InvalidECheck, EmptyECheck]
    }

    extractAnswerList(flowchart: any): any {
        const answerList = {'params': []};
        const paramList = [];
        const lines = flowchart.description.split('\n');
        for (const line of lines) {
            let splittedLine = line.split(':');
            if (splittedLine.length < 2) {
                splittedLine = line.split('=');
                if (splittedLine.length < 2) {
                    continue;
                }
            }
            const param = splittedLine[0].trim();
            if (this.isParamName(param, flowchart)) {
                let paramVal;
                try {
                    paramVal = JSON.parse(splittedLine[1]);
                } catch (ex) {
                    paramVal = JSON.parse('[' + splittedLine[1] + ']');
                }
                if (!paramVal) { continue; }
                if (paramVal.constructor !== [].constructor) {
                    paramVal = [paramVal];
                }
                paramList.push([param, paramVal]);
            } else if (param !== 'params') {
                try {
                    answerList[param] = JSON.parse(splittedLine[1]);
                } catch (ex) {
                    answerList[param] = JSON.parse('[' + splittedLine[1] + ']');
                }
            }
        }
        if (paramList.length === 0) {
            return answerList;
        }

        for (let i = 0; i < paramList[0][1].length; i++) {
            const paramSet = {};
            let check = true;
            for (const param of paramList) {
                if (i >= param[1].length) {
                    check = false;
                    break;
                }
                paramSet[param[0]] = param[1][i];
            }
            if (!check) { break; }
            answerList.params.push(paramSet);
        }
        return answerList;
    }

    isParamName(str: string, flowchart: any): boolean {
        for (const prod of flowchart.nodes[0].procedure) {
            if (prod.type === ProcedureTypes.Constant && (prod.args[0].value === str || prod.args[0].jsValue === str)) {
                return true;
            }
        }
        return false;
    }



    async executeFlowchart() {
        let globalVars = '';
        const constantList = {};
        const miscData = {
            'exit': false,
            'exit_value': null,
            'breakbranch': {}
        };

        // console.log(this.extractAnswerList(this.dataService.flowchart))

        // reordering the flowchart
        if (!this.dataService.flowchart.ordered) {
            FlowchartUtils.orderNodes(this.dataService.flowchart);
        }

        // get the javascript string of all imported functions
        const funcStrings = {};
        for (const func of this.dataService.flowchart.functions) {
            funcStrings[func.name] =  CodeUtils.getFunctionString(func);
        }
        if (this.dataService.flowchart.subFunctions) {
            for (const func of this.dataService.flowchart.subFunctions) {
                funcStrings[func.name] =  CodeUtils.getFunctionString(func);
            }
        }

        // execute based on the current url:
        // _ for "/flowchart" & "/editor": execute the whole flowchart if the whole flowchart is not executed before,
        //                                 then execute only start node + nodes that are modified after the last execute
        //                                 and their downstream nodes.
        // _ for all other url           : execute the whole flowchart
        let executeSet: any;
        let currentUrl = this.router.url;
        if (currentUrl) {
            currentUrl = currentUrl.split('?')[0];
        } else {
            currentUrl = '/editor';
        }
        if (!this.dataService.flowchart.nodes[0].model || this.dataService.numModifiedNode() === 0
            || (currentUrl !== '/flowchart' && currentUrl !== '/editor')) {
            executeSet = new Set(this.dataService.flowchart.nodes.keys());
        } else {
            executeSet = this.dataService.getExecutableNodes();
            this.dataService.clearModifiedNode();
        }
        for (let i = 0; i < this.dataService.flowchart.nodes.length; i++) {
            if (executeSet.has(i)) {
                this.dataService.flowchart.nodes[i].state.hasExecuted = false;
            } else {
                this.dataService.flowchart.nodes[i].state.hasExecuted = true;
            }
        }

        const nodeIndices = {};
        // execute each node
        for (let i = 0; i < this.dataService.flowchart.nodes.length; i++) {
            const node = this.dataService.flowchart.nodes[i];
            // if disabled node -> continue
            if (!node.enabled) {
                node.output.value = undefined;
                continue;
            }
            if (miscData.exit) {
                if (node.type === 'end') {
                    this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:black;">PROCESS EXITED. ' +
                    `Return Value: ${JSON.stringify(miscData.exit_value)}</h5>`);
                    node.output.value = miscData.exit_value;
                } else {
                    node.output.value = null;
                }
                continue;
            }

            node.model = null;
            globalVars = await this.executeNode(node, funcStrings, globalVars, constantList, nodeIndices, miscData);
        }

        // delete each node.output.value to save memory
        for (const node of this.dataService.flowchart.nodes) {
            if (node.type === 'end') {
                if (node.procedure[node.procedure.length - 1].args[0].jsValue) {
                    continue;
                } else {
                    delete node.output.value;
                }
            } else {
                delete node.output.value;
            }
        }

        this.dataOutputService.resetIModel();
        document.getElementById('spinner-off').click();
        const category = this.isDev ? 'dev' : 'execute';
        const duration: number = Math.round(performance.now() - this.startTime);
        let duration_msg: string;
        if (duration < 1000)  {
            duration_msg = '<p style="padding: 2px 0px 2px 0px;"><i>Total Execute Time: ' + duration + ' milliseconds.</i></p>';
        } else {
            duration_msg = '<p style="padding: 2px 0px 2px 0px;"><i>Total Execute Time: ' + duration / 1000 + ' seconds.</i></p>';
        }
        this.dataService.log(duration_msg);
        console.log('total execute time:', duration / 1000, 'sec');
    }


    async executeNode(node: INode, funcStrings, globalVars, constantList, nodeIndices, miscData): Promise<string> {
        const params = {
            'currentProcedure': [''],
            'console': this.dataService.getLog(),
            'constants': constantList,
            'fileName': this.dataService.flowchart.name,
            'curr_ss': {},
            'message': null,
            'terminated': false,
            'misc': miscData,
        };
        if (node.hasError) {
            document.getElementById('Console').click();
            this.dataService.log(
                '<h4 style="padding: 2px 0px 2px 0px; style="color:red">' +
                'Static Error: Invalid code detected. Check the highlighted lines of code!' +
                '</h4>');
            document.getElementById('spinner-off').click();
            this.dataService.flowchart.model = this.dataService.executeModel.getModel();
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            const _category = this.isDev ? 'dev' : 'execute';
            throw new Error('Reserved Word Argument');
        }
        // const consoleLength = params.console.length;

        let fnString = '';
        const startTime = performance.now();
        let snapshotID;
        try {
            if (this.terminated) {
                this.dataService.notifyMessage(`SCRIPT TERMINATED IN NODE: "${this.terminated}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                node.model = null;
                return;
            }
            const usedFuncs: string[] = [];
            const codeResult = CodeUtils.getNodeCode(node, true, nodeIndices, undefined, node.id, usedFuncs);
            const usedFuncsSet = new Set(usedFuncs);
            // if process is terminated, return
            if (codeResult[1]) {
                this.dataService.notifyMessage(`SCRIPT TERMINATED IN NODE: "${codeResult[1]}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
                if (!codeResult[0]) {
                    node.model = null;
                    return;
                }
            }

            const codeRes = codeResult[0];
            const nodeCode = codeRes[0].join('\n').split('_-_-_+_-_-_');
            // const varsDefined = codeRes[1];

            // Create function string:
            // start with asembling the node's code
            fnString =  '\n\n//  ------------ MAIN CODE ------------\n' +
                        nodeCode[0] +
                        '\nasync function __main_node_code__(){\n' +
                        nodeCode[1] +
                        '\n}\nreturn __main_node_code__;';

            // add the user defined functions that are used in the node
            const addedFunc = new Set([]);
            usedFuncsSet.forEach((funcName) => {
                for (const otherFunc in funcStrings) {
                    if (!addedFunc.has(otherFunc) && otherFunc.substring(0, funcName.length) === funcName) {
                        addedFunc.add(otherFunc);
                        fnString =  `\n// ------ GLOBAL FUNCTION: ${otherFunc} ------\n\n` + funcStrings[otherFunc] + fnString;
                    }
                }
            });

            // add the constants from the start node and the predefined constants/functions (e.g. PI, sqrt, ...)
            fnString = globalVars + '\n\n// <<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>\n\n' + fnString;

            // add the merge input function and the print function
            fnString =  '\n\n// ------ PRINT FUNCTION ------' + printFuncString +
                        `\n\n// ------ FUNCTION FOR PYTHON STYLE LIST ------` + pythonListFunc +
                        '\n\n// ------ CONSTANTS ------\n' + fnString;

            // ==> generated code structure:
            //  1. pythonList + mergeInputFunction + printFunc
            //  2. constants
            //  3. user functions
            //  4. main node code

            // print the code
            this.dataService.log(`<h3  style="padding: 10px 0px 2px 5px; background-color: #B3B3B3; color: #373737 ">Executing node: ${node.name}</h3>`);
            if (DEBUG) {
                console.log(`______________________________________________________________\n/*     ${node.name.toUpperCase()}     */\n`);
                console.log(fnString);
            }

            const prevWindowVar = {};
            for (const v of inlineVarNames) {
                if (window.hasOwnProperty(v)) {
                    prevWindowVar[v] = window[v];
                }
            }


            snapshotID = this.dataService.executeModel.getModel().nextSnapshot(node.input.value);
            node.model = null;

            if (node.type !== 'start') {
                let breakbranch = true;
                for (const edge of node.input.edges) {
                    if (miscData.breakbranch[edge.source.parentNode.id]) {
                        continue;
                    }
                    breakbranch = false;
                    break;
                }
                if (breakbranch) {
                    node.model = snapshotID;
                    miscData.breakbranch[node.id] = true;
                    this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:black;">Bypass Node</h4>');
                    return globalVars;
                }
            } else {
                params['constants'] = {};
            }

            // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)

            // #########################################################
            // *********************************************************
            // console.log(fnString.split('<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>')[1]);
            // console.log(fnString);

            const fn = new Function('mfn', 'ifn', '$p', fnString);
            // execute the function
            const inline = new InlineFuncs(this.dataService.mobiusSettings.debug);
            const result = await fn(this.dataService.executeModel, inline, params)();
            node.model = snapshotID;
            if (params['terminated']) {
                this.terminated = node.name;
                this.dataService.notifyMessage(`SCRIPT TERMINATED IN NODE: "${this.terminated}"`);
                this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            }

            if (params.message && !this.triggerCheck) {
                this.triggerCheck = true;
                this.dataService.notifyMessage(params.message.replace('%node%', node.name));
            }

            for (const v of inlineVarNames) {
                if (window.hasOwnProperty(v)) {
                    delete window[v];
                    if (prevWindowVar[v]) {
                        window[v] = prevWindowVar[v];
                    }
                }
            }
            for (const i in window) {
                if (i === 'webpackJsonp_name_') { continue; }
                if (i[i.length - 1] === '_' && i[i.length - 2] !== '_' && i[0] !== '_') {
                    delete window[i];
                }
            }

            if (node.type === 'end') {
                node.output.value = result;
            } else {
                node.output.value = null;
            }

            // mark the node as has been executed
            node.state.hasExecuted = true;

            // // check all the input nodes of this node, if all of their children nodes are all executed,
            // // change their output.value to null to preserve memory space.
            // node.input.edges.forEach( edge => {
            //     const inputNode = edge.source.parentNode;
            //     if (inputNode.output.edges.length > 1) {
            //         for (const outputEdge of inputNode.output.edges) {
            //             if (!outputEdge.target.parentNode.state.hasExecuted) { return; }
            //         }
            //     }
            //     inputNode.output.value = null;
            // });

            // if start node ->
            if (node.type === 'start') {
                for (const constant in params['constants']) {
                    if (params['constants'].hasOwnProperty(constant)) {
                        const constString = JSON.stringify(params['constants'][constant]);
                        globalVars += `const ${constant} = ${constString};\n`;
                        constantList[constant] = params['constants'][constant];
                    }
                }
                globalVars += '\n';
                // node.model = params['model'].getModelData();
            } else {
                // node.model = diff(node.input.value.getData(), params['model'].getModelData());
            }
            // node.model = JSON.stringify(params['model'].getModelData());
            // node.model = params['model'];
            node.input.value = null;

            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;"><i>Executed in ' + duration + ' milliseconds.</i></p>';
            } else {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;"><i>Executed in ' + duration / 1000 + ' seconds.</i></p>';
            }
            this.dataService.log(duration_msg);
            this.dataService.log('<br>');
            if (codeResult[1]) {
                this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:red;">SCRIPT TERMINATED</h4>');
            }
            return globalVars;
        } catch (ex) {
            console.log('error:',ex)
            if (ex.message === '__EXIT__') {
                node.model = snapshotID;
                return;
            }
            if (ex.message === '__BREAK_BRANCH__') {
                node.model = snapshotID;
                this.dataService.log('<h4 style="padding: 2px 0px 2px 0px; color:black;">Bypass Node</h4>');
                return;
            }
            this.dataService.flowchart.model = this.dataService.executeModel.getModel();
            document.getElementById('spinner-off').click();
            const endTime = performance.now();
            const duration: number = Math.round(endTime - startTime);
            let duration_msg: string;
            if (duration < 1000)  {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;""><i>Executed in ' + duration + ' milliseconds.</i></p>';
            } else {
                duration_msg = '<p style="padding: 2px 0px 2px 10px;""><i>Executed in ' + duration / 1000 + ' seconds.</i></p>';
            }
            this.dataService.log(duration_msg);
            this.dataService.log('<br>');
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            if (DEBUG) {
                this.dataService.log('\n=======================================\n' +
                    ex.name +
                    '\n=======================================\n' +
                    ex.message);
                throw ex;
            }
            node.hasError = true;
            // console.warn(`${node.name} errored`);

            // Unexpected Identifier
            // Unexpected token
            const prodWithError: string = params['currentProcedure'][0];
            let localFunc: string;
            const markError = function(prod: IProcedure, id: string, localFuncProd = null) {
                if (prod['ID'] && id && prod['ID'] === id) {
                    prod.hasError = true;
                    if (localFuncProd) {
                        localFunc = localFuncProd.args[0].value;
                        localFuncProd.hasError = true;
                    }
                }
                if (prod.children) {
                    prod.children.map(function(p) {
                        markError(p, id, localFuncProd);
                    });
                }
            };
            if (prodWithError !== '') {
                node.procedure.map(function(prod: IProcedure) {
                    if (prod['ID'] === prodWithError) {
                        prod.hasError = true;
                    }
                    if (prod.children) {
                        prod.children.map(function(p) {
                            markError(p, prodWithError);
                        });
                    }
                });
                node.localFunc.map(function(prod: IProcedure) {
                    if (prod['ID'] === prodWithError) {
                        prod.hasError = true;
                        localFunc = prod.args[0].value;
                    }
                    if (prod.children) {
                        prod.children.map(function(p) {
                            markError(p, prodWithError, prod);
                        });
                    }
                });
                if (localFunc) {
                    this.dataService.notifyMessage(`Error in local function "${localFunc}" of node "${node.name}"`);
                } else {
                    this.dataService.notifyMessage(`Error in main code of node "${node.name}"`);
                }
            }
            if (ex.toString().slice(0, 11) === 'Error: ____') {
                ex.message = ex.toString().slice(11);
            } else if (ex.toString().indexOf('Unexpected identifier') > -1) {
                ex.message = 'Unexpected Identifier error. Did you declare everything?' +
                             'Check that your strings are enclosed in quotes (")';
            } else if (ex.toString().indexOf('Unexpected token') > -1 || ex.toString().indexOf('unexpected token') > -1) {
                ex.message = 'Unable to compile code. Check code order and arguments.';
            } else if (ex.toString().indexOf('\'readAsText\' on \'FileReader\'') > -1) {
                ex.message = 'Unable to read file input. Check all start node inputs.';
            } else if (ex.toString().indexOf('Cannot read property \'splice\'') > -1) {
                ex.message = 'Unrecognized or missing variable in the procedure.';
            }
            document.getElementById('Console').click();
            this.dataService.log(`<h4 style="padding: 2px 0px 2px 0px; color:red;">Error: ${ex.message}</h4>`);
            // console.log('---------------\nError node code:');
            // console.log(fnString);
            const category = this.isDev ? 'dev' : 'execute';
            throw ex;

        }
    }

    runningFunction(functionDetails) {
        // create the function with the string: new Function ([arg1[, arg2[, ...argN]],] functionBody)
        const fn = new Function('mfn', 'ifn', '$p', functionDetails.fnString);
        // execute the function
        const result = fn(functionDetails.Funcs, functionDetails.Inlines, functionDetails.params);
        return [result, functionDetails.params];
    }
}
