import { Component, HostListener, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SIMFuncs } from '@design-automation/mobius-sim-funcs';
import { IArgument } from '@models/code';
import { IFlowchart } from '@models/flowchart';
import { InputType } from '@models/port';
import { IFunction, IProcedure, ProcedureTypes } from '@models/procedure';
import { inline_func, InlineDocList, inlineVarString, primary_func } from '@shared/functions';
import { checkFlowchartValidity } from '@shared/parser';
import { DataService, KeyboardService } from '@shared/services';
import { IdGenerator, parseMobFile } from '@utils';
import axios from 'axios';
import * as Flatted from 'flatted';
import * as showdown from 'showdown';

import { SaveFileComponent } from '../file';
import { DownloadUtils } from '../file/download.utils';

const API_ENDPOINT = 'https://rwytlj8v41.execute-api.us-east-1.amazonaws.com/test0/upload';

const inputEvent = new Event('input', {
    'bubbles': true,
    'cancelable': true
});

const PATHSTRINGS = ['gallery', 'dashboard', 'flowchart', 'editor'];
@Component({
    selector: 'panel-header',
    templateUrl: 'panel-header.component.html',
    styleUrls: ['panel-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PanelHeaderComponent implements OnDestroy {

    @Input() flowchart: IFlowchart;
    executeCheck: boolean;
    nodeListCheck: boolean;
    selectedBackups: string[] = [];
    textareaMousedown = false;

    publishUrlSettings = {
        mainURL: '',
        navMode: 'publish',
        navPage: 'dashboard',
        showNode: '',
        showNodeIdx: '',
        showViewers: [true, true, true, true, true],
        defaultViewer: '',
        docSection: ''
    };
    urlValid: boolean;
    urlNodes;

    settings;
    func_categories = Object.keys(SIMFuncs).filter(cat => cat[0] !== '_');
    private ctx = document.createElement('canvas').getContext('2d');
    backupDates;

    inlineFunc = JSON.parse(JSON.stringify(inline_func));
    inlineDocs = {};
    searchedInlineFunc;

    docModList;

    inlineHelpText = 'Inline Function Help'

    constructor(private dataService: DataService, private keyboardService: KeyboardService, private router: Router) {
        SaveFileComponent.updateBackupList();
        const mdConverter = new showdown.Converter({literalMidWordUnderscores: true, simpleLineBreaks: true});

        if (this.router.url.startsWith('/about')) {
            this.executeCheck = false;
            this.nodeListCheck = false;
        } else if (this.router.url.startsWith('/gallery')) {
            this.executeCheck = true;
            this.nodeListCheck = false;
        } else {
            this.executeCheck = true;
            this.nodeListCheck = true;
        }
        this.ctx.font = '400 12px arial';

        this.settings = this.dataService.mobiusSettings;

        if (this.settings['execute'] === undefined) { this.settings['execute'] = true; }
        if (this.settings['autosave'] === undefined) { this.settings['autosave'] = true; }
        if (this.settings['debug'] === undefined) { this.settings['debug'] = true; }

        const funcs = new SIMFuncs();
        this.func_categories = Object.getOwnPropertyNames(funcs).filter(cat => cat[0] !== '_');

        for (const cat in this.func_categories) {
            if (!this.func_categories[cat] || this.settings.hasOwnProperty('_func_' + this.func_categories[cat])) { continue; }
            this.settings['_func_' + this.func_categories[cat]] = true;
        }
        localStorage.setItem('mobius_settings', JSON.stringify(this.settings));

        const inlineFuncs = inlineVarString.replace(/\n/g, '').split(';');
        let i = 0;
        while (i < inlineFuncs.length) {
            if (inlineFuncs[i] === '') {
                inlineFuncs.splice(i, 1);
                continue;
            }
            const funcName = inlineFuncs[i].split(' = ')[0];
            const funcDir = inlineFuncs[i].split('.')[1];
            if (InlineDocList && InlineDocList[funcDir]) {
                this.inlineDocs[funcName] = InlineDocList[funcDir];
                if (this.inlineDocs[funcName].parameters) {
                    let j = 0;
                    while (j < this.inlineDocs[funcName].parameters.length) {
                        if (this.inlineDocs[funcName].parameters[j].name === 'debug') {
                            this.inlineDocs[funcName].parameters.splice(j, 1);
                            continue;
                        }
                        if (!this.inlineDocs[funcName].parameters[j].description) {
                            this.inlineDocs[funcName].parameters[j].description = '';
                        }
                        this.inlineDocs[funcName].parameters[j].description = this.inlineDocs[funcName].parameters[j].description.trim();
                        j += 1;
                    }
                }
            } else {
                this.inlineDocs[funcName] = null;
            }
            i++;
        }
        for (const mod of this.inlineFunc) {
            if (mod[0] === 'queries') {
                for (let j = 0; j < mod[1].length; j++) {
                    const func = mod[1][j];
                    this.inlineDocs[func[0]] = {
                        description: mdConverter.makeHtml(func[1]).replace(/\\n/g, '<br/>'),
                        module: '_queries',
                        name: func[0],
                        parameters: [],
                        returns: undefined};
                    mod[1][j] = func[0];
                }
            }
        }

        this.docModList = [{
            name: 'UI',
            modnames: ['UI.gallery', 'UI.dashboard', 'UI.flowchart', 'UI.editor', 'UI.menu'],
        }, {
            name: 'Viewers',
            modnames: ['Viewers.gi-viewer', 'Viewers.geo-viewer', 'Viewers.vr-viewer', 'Viewers.vr-viewer-hotspots', 'Viewers.console'],
        }, {
            name: 'Operations',
            modnames: ['Operations.variable', 'Operations.comment', 'Operations.expression',
                       'Operations.control_flow', 'Operations.local_func', 'Operations.global_func'],
        }, {
            name: 'Funcs',
            modnames: [],
        }];

        for (const mod of primary_func) {
            this.docModList[3].modnames.push('Funcs.' + mod[0]);
        }

    }

    ngOnDestroy() {
        this.dataService.dialog = null;
        this.ctx = null;
    }


    getUrl() {
        return this.router.url;
    }
    getNode() {
        return this.flowchart.nodes[this.flowchart.meta.selected_nodes[0]];
    }

    changeNode(index: number) {
        this.dataService.flowchart.meta.selected_nodes = [index];
        if (this.router.url.startsWith('/editor')) {
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[index].id);
            if ((index === 0 || index === this.dataService.flowchart.nodes.length - 1)) {
                setTimeout(() => {
                    this.adjustTextArea();
                }, 100);
            }
        }
    }

    adjustTextArea() {
        if (!this.ctx) { return; }
        let textarea = document.getElementById('flowchart-desc');
        if (textarea) {
            const desc = this.dataService.flowchart.description.split('\n');
            const textareaWidth = textarea.getBoundingClientRect().width - 30;
            let lineCount = 0;
            for (const line of desc) {
                lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
            }
            textarea.style.height = lineCount * 14 + 4 + 'px';

            for (const prod of this.dataService.node.procedure) {
                if (prod.type !== ProcedureTypes.Constant) { continue; }
                textarea = document.getElementById(prod.ID + '_desc');
                if (textarea && prod.meta.description) {
                    const prodDesc = prod.meta.description.split('\n');
                    const prodTextareaWidth = textarea.getBoundingClientRect().width - 30;
                    let prodLineCount = 0;
                    for (const line of prodDesc) {
                        prodLineCount += Math.floor(this.ctx.measureText(line).width / prodTextareaWidth) + 1;
                    }
                    textarea.style.height = prodLineCount * 14 + 4 + 'px';
                }
            }
        }
        textarea = document.getElementById('flowchart-return');
        if (textarea) {
            const desc = (this.dataService.flowchart.returnDescription || '').split('\n');
            const textareaWidth = textarea.getBoundingClientRect().width - 30;
            let lineCount = 0;
            for (const line of desc) {
                lineCount += Math.floor(this.ctx.measureText(line).width / textareaWidth) + 1;
            }
            textarea.style.height = lineCount * 14 + 4 + 'px';
        }
        textarea = null;
    }



    loadFile() {
        document.getElementById('file-input').click();
        // this.router.navigate(['/dashboard']);
    }

    saveJavascript() {
        document.getElementById('savejavascript').click();
        // this.router.navigate(['/dashboard']);
    }

    openMobiusDropdownMenu(e: MouseEvent) {
        e.stopPropagation();
        const stl = document.getElementById('mobiusDropdownMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.left = (document.getElementById('mobiusDropdownMenuButton').getBoundingClientRect().left + 34 - 100) + 'px';
            stl.display = 'block';
            // const bRect = (<Element>e.target).getBoundingClientRect();
            // stl.transform = `translate(` + bRect.left + `px, ` + bRect.height + `px)`;
        } else {
            stl.display = 'none';
        }
    }

    openNodeMenu(e: MouseEvent) {
        let stl = document.getElementById('nodeMenu').style;
        if (!stl.display || stl.display === 'none') {
            stl.display = 'block';
        } else {
            stl.display = 'none';
        }
        e.stopPropagation();
        stl = null;
    }

    openMenuHelp(e: MouseEvent, path: string) {
        e.stopPropagation();
        this.dataService.helpView = '...menu/' + path;
        this.dataService.toggleHelp(true);
        const stl = document.getElementById('mobiusDropdownMenu').style;
        stl.display = 'none';

    }

    openPageHelp(e: MouseEvent) {
        e.stopPropagation();
        for (const pathStr of PATHSTRINGS) {
            if (window.location.pathname.indexOf('/' + pathStr) !== -1) {
                this.dataService.helpView = `...${pathStr}/${pathStr}`;
                this.dataService.toggleHelp(true);
                return;
            }
        }
    }

    openHeaderDialog(event, dialogType: string) {
        event.stopPropagation();
        this.dataService.openHeaderDialog(dialogType);
    }


    closeDialog(closeLS = false) {
        if (closeLS) {
            (<HTMLInputElement>document.getElementById('savels-name')).value = this.flowchart.name;
        }
        this.dataService.dialog.close();
        this.dataService.dialog.style.right = '0px';
    }

    checkDialog(type) {
        return this.dataService.dialogType === type;
    }

    updateSettings() {
        this.settings.execute = (<HTMLInputElement>document.getElementById('settings-execute')).checked;
        this.settings.debug = (<HTMLInputElement>document.getElementById('settings-debug')).checked;
        this.settings.autosave = (<HTMLInputElement>document.getElementById('settings-autosave')).checked;

        for (const cat in this.func_categories) {
            if (!this.func_categories[cat]) { continue; }
            this.settings['_func_' + this.func_categories[cat]] = (<HTMLInputElement>document.getElementById(`_func_${this.func_categories[cat]}`)).checked;
        }
        this.dataService.dialog.close();
        this.dataService.dialog.style.right = '0px';
        this.dataService.triggerToolsetUpdate();
        localStorage.setItem('mobius_settings', JSON.stringify(this.settings));

    }

    checkSetting(settingName: string, value: any) {
        return this.settings[settingName] === value;
    }


    async loadBackup(event: MouseEvent, filecode: string) {
        event.stopPropagation();
        if (this.dataService.checkbackup_header()) {
            if (!confirm('Loading a new file will delete the current flowchart! Would you like to continue?')) {return; }
            const result = await SaveFileComponent.loadFromFileSystem(filecode);
            if (result === 'error') {
                return;
            }
            SaveFileComponent.clearModelData(this.dataService.flowchart);
            try {
                this.dataService.file = Flatted.parse(result);
            } catch (ex) {
                this.dataService.notifyMessage('ERROR: Corrupted local file');
                return;
            }
            this.dataService.file.flowchart.meta.selected_nodes = [this.dataService.file.flowchart.nodes.length - 1];
            this.dataService.flagModifiedNode(this.dataService.flowchart.nodes[0].id);
            checkFlowchartValidity(this.dataService.flowchart);
            if (this.settings.execute) {
                document.getElementById('executeButton').click();
            }

        } else {
            // const fileString: any = localStorage.getItem(filecode);
            const fileString = await SaveFileComponent.loadFromFileSystem(filecode);
            if (!fileString) {
                return;
            }
            const fl = Flatted.parse(fileString).flowchart;

            // create function and documentation of the function
            const funcs = {'main': null, 'sub': []};
            let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
            if (funcName.match(/^[\d_]/)) {
                funcName = 'func' + funcName;
            }
            const documentation = {
                name: funcName,
                module: 'globalFunc',
                description: fl.description,
                summary: fl.description,
                parameters: [],
                returns: fl.returnDescription
            };
            const func: IFunction = <IFunction>{
                flowchart: <IFlowchart>{
                    id: fl.id ? fl.id : IdGenerator.getId(),
                    name: fl.name,
                    nodes: fl.nodes,
                    edges: fl.edges
                },
                name: funcName,
                module: 'globalFunc',
                doc: documentation,
                importedFile: fileString
            };

            func.args = [];
            for (const prod of fl.nodes[0].procedure) {
                if (!prod.enabled || prod.type !== ProcedureTypes.Constant || prod.argCount === 0) { continue; }
                let v: string = prod.args[prod.argCount - 2].value || 'undefined';
                if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
                if (prod.meta.inputMode !== InputType.Constant) {
                    documentation.parameters.push({
                        name: v,
                        description: prod.meta.description
                    });
                }
                func.args.push(<IArgument>{
                    name: v,
                    value: prod.args[prod.argCount - 1].value,
                    type: prod.meta.inputMode,
                    isEntity: prod.selectGeom
                });
            }
            func.argCount = func.args.length;

            checkFlowchartValidity(fl);
            const end = fl.nodes[fl.nodes.length - 1];
            const returnProd = end.procedure[end.procedure.length - 1];
            if (returnProd.args[0].value) {
                func.hasReturn = true;
            } else {
                func.hasReturn = false;
            }

            // add func and all the imported functions of the imported flowchart to funcs
            funcs.main = func;
            for (const i of fl.functions) {
                i.name = func.name + '_' + i.name;
                funcs.sub.push(i);
            }
            if (fl.subFunctions) {
                for (const i of fl.subFunctions) {
                    i.name = func.name + '_' + i.name;
                    funcs.sub.push(i);
                }
            }

            this.dataService.flowchart.functions.push(funcs.main);
            if (!this.dataService.flowchart.subFunctions) {
                this.dataService.flowchart.subFunctions = [];
            }
            for (const subfunc of funcs.sub) {
                this.dataService.flowchart.subFunctions.push(subfunc);
            }

            for (const node of this.dataService.flowchart.nodes) {
                this.updateGlobalFuncProds(node.procedure, func);
            }
            this.dataService.notifyMessage(`Successfully import global function ${funcName} from local storage`);
            this.closeDialog();

        }
    }

    getBackupFiles(onlyMobFiles = true) {
        const items = localStorage.getItem('mobius_backup_list');
        // console.log(items)
        this.backupDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
        if (!items) {
            return [];
        }
        const all_items = JSON.parse(items);
        const return_items = [];
        for (const i of all_items) {
            if (i === '___TEMP___.mob') { continue; }
            if (i.endsWith('.mob') === onlyMobFiles) {
                return_items.push(i);
            }
        }
        return return_items;
    }

    openTab(evt, tabID: string) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName('tabContent');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].className = tabcontent[i].className.replace(' active', '');
        }
        tablinks = document.getElementsByClassName('tabLinks');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(' active', '');
        }
        document.getElementById(tabID).className += ' active';
        evt.currentTarget.className += ' active';
        this.selectedBackups = [];
    }

    deleteBackup(event: MouseEvent) {
        event.stopPropagation();
        for (const filecode of this.selectedBackups) {
            SaveFileComponent.deleteFile(filecode);
            const itemsString = localStorage.getItem('mobius_backup_list');
            if (!itemsString) { continue; }
            const items: string[] = JSON.parse(itemsString);
            const i = items.indexOf(filecode);
            if (i !== -1) {
                items.splice(i, 1);
                localStorage.setItem('mobius_backup_list', JSON.stringify(items));
                const itemDates = JSON.parse(localStorage.getItem('mobius_backup_date_dict'));
                itemDates[filecode] = (new Date()).toLocaleString();
                localStorage.setItem('mobius_backup_date_dict', JSON.stringify(itemDates));
            }
        }
        this.selectedBackups = [];
    }

    downloadBackup(event: MouseEvent) {
        event.stopPropagation();
        SaveFileComponent.downloadLocalStorageFile(this.selectedBackups);
        // event.stopPropagation();
        // SaveFileComponent.downloadLocalStorageFile(filecode);
    }

    async addBackup() {
        const selectedFile = (<HTMLInputElement>document.getElementById('addBackup')).files[0];
        const p = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(<string>reader.result);
                };
            reader.readAsText(selectedFile);
        });
        SaveFileComponent.saveToLocalStorage(selectedFile.name, <string> await p);
        (<HTMLInputElement>document.getElementById('addBackup')).value = '';
    }

    selectBackup(backup: string, event: MouseEvent) {
        event.stopPropagation();
        if (event.shiftKey && this.selectedBackups.length > 0) {
            const backup_items = JSON.parse(localStorage.getItem('mobius_backup_list'));
            let indexFrom: number, indexTo: number;

            for (let i = 0; i < backup_items.length; i++) {
                if (backup_items[i] === this.selectedBackups[this.selectedBackups.length - 1]) {
                    indexFrom = i;
                }
                if (backup_items[i] === backup) {
                    indexTo = i;
                }
            }
            let step = 1;
            if (indexFrom > indexTo) {
                step = -1;
            }
            indexTo += step;

            if (this.selectedBackups.indexOf(backup) === -1) {
                for (let i = indexFrom; i !== indexTo; i += step) {
                    if (this.selectedBackups.indexOf(backup_items[i]) === -1) {
                        this.selectedBackups.push(backup_items[i]);
                    }
                }
            } else {
                for (let i = indexFrom; i !== indexTo; i += step) {
                    const backup_index = this.selectedBackups.indexOf(backup_items[i]);
                    if (backup_index !== -1) {
                        this.selectedBackups.splice(backup_index, 1);
                    }
                }
            }
        } else {
            for (let i = 0; i < this.selectedBackups.length; i++) {
                if (this.selectedBackups[i] === backup) {
                    this.selectedBackups.splice(i, 1);
                    return;
                }
            }
            this.selectedBackups.push(backup);
        }
    }

    selectedBackup(backup) {
        for (const b of this.selectedBackups) {
            if (b === backup) {
                return true;
            }
        }
        return false;
    }

    checkMobBackup(backup): boolean {
        const splitted = backup.split('.');
        if (splitted[splitted.length - 1] === 'mob') {
            return false;
        }
        return true;
    }

    prevDef(event) {
        event.preventDefault();
    }

    @HostListener('window:click', ['$event'])
    onWindowClick(event: MouseEvent) {
        if ((<HTMLElement>event.target).id === 'addBackup' || (<HTMLElement>event.target).id === 'addBackupButton') {
            return;
        }
        let mobiusDropdownMenu = document.getElementById('mobiusDropdownMenu');
        if (mobiusDropdownMenu) {
            mobiusDropdownMenu.style.display = 'none';
        }
        let nodeMenu = document.getElementById('nodeMenu');
        if (nodeMenu) {
            nodeMenu.style.display = 'none';
        }
        let galleryMenu = document.getElementById('galleryMenu');
        if (galleryMenu) {
            galleryMenu.style.display = 'none';
        }
        let helpMenu = document.getElementById('helpMenu');
        if (helpMenu) {
            helpMenu.style.display = 'none';
        }
        let objDropdown = document.getElementById('object_dropdown');
        if (objDropdown) {
            objDropdown.style.display = 'none';
        }
        if (this.dataService.dialog) {
            if (this.textareaMousedown) {
                this.textareaMousedown = false;
                return;
            }
            if ((<HTMLElement>event.target).tagName === 'SELECT') { return; }

            const rect = this.dataService.dialog.getBoundingClientRect();

            const isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
                && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInDialog) {
                this.dataService.dialog.close();
                this.dataService.dialog.style.right = '0px';
                this.dataService.dialog = null;
            }
        }
        mobiusDropdownMenu = null;
        nodeMenu = null;
        galleryMenu = null;
        helpMenu = null;
        objDropdown = null;
    }

    @HostListener('window:copy', ['$event'])
    onWindowCopy(event: KeyboardEvent) {
        if (this.router.url.startsWith('/editor')) {
            const targetName = (<HTMLElement> document.activeElement).nodeName;
            if ( targetName === 'TEXTAREA' || targetName === 'INPUT') { return; }
            if (this.dataService.dialog && this.dataService.dialog.open) { return; }
            document.getElementById('copyProdButton').click();
        }
    }

    @HostListener('window:cut', ['$event'])
    onWindowCut(event: KeyboardEvent) {
        if (this.router.url.startsWith('/editor')) {
            const targetName = (<HTMLElement> document.activeElement).nodeName;
            if ( targetName === 'TEXTAREA' || targetName === 'INPUT') { return; }
            document.getElementById('cutProdButton').click();
        }
    }
    @HostListener('window:paste', ['$event'])
    onWindowPaste(event: KeyboardEvent) {
        if (this.router.url.startsWith('/editor')) {
            const targetName = (<HTMLElement> document.activeElement).nodeName;
            if ( targetName === 'TEXTAREA' || targetName === 'INPUT') { return; }
            document.getElementById('pasteProdButton').click();
        }
    }


    saveBackup() {
        try {
            let fileName = (<HTMLInputElement>document.getElementById('savels-name')).value + '.mob';
            fileName = fileName.replace(/\s/g, '_');
            SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
            this.closeDialog();
            this.dataService.notifyMessage(`Saved Flowchart as ${fileName}...`);
        } catch (ex) {
            this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
        }
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
            try {
                let fileName = this.dataService.flowchart.name.replace(/\s/g, '_');
                if (fileName.length < 4 || fileName.slice(-4) !== '.mob') {
                    fileName += '.mob';
                }
                SaveFileComponent.saveFileToLocal(fileName, this.dataService.file);
                this.dataService.notifyMessage(`Saved Flowchart as ${fileName}...`);
            } catch (ex) {
                this.dataService.notifyMessage('ERROR: Unable to save Flowchart');
            }
        }
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        this.keyboardService.update(event);
    }

    validateUrl() {
        if (this.publishUrlSettings.mainURL === '') {
            this.urlValid = false;
            return;
        }
        const request = new XMLHttpRequest();

        let url = <string> this.publishUrlSettings.mainURL;
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('?dl=0', '');
        }
        url = url.replace(/^[\"\']|[\"\']$/g, '');
        request.open('GET', url);

        request.onload = () => {
            if (request.status === 200) {
                const f = parseMobFile(request.responseText);
                if (!f) {
                    this.urlValid = false;
                } else {
                    this.urlNodes = f.flowchart.nodes;
                    this.urlValid = true;
                }
            } else {
                this.urlValid = false;
            }
        };
        request.onerror = () => {
            this.urlValid = false;
        };
        request.send();
    }

    generatePublishUrl() {
        if (this.publishUrlSettings.mainURL === '') {
            return;
        }
        const navPage = this.publishUrlSettings.navMode !== 'dashboard' ? this.publishUrlSettings.navMode : this.publishUrlSettings.navPage;
        if (this.publishUrlSettings.navMode !== 'dashboard') {
            this.publishUrlSettings.showNode = '';
            this.publishUrlSettings.showNodeIdx = '';
        } else if (this.publishUrlSettings.showNode === '') {
            this.publishUrlSettings.showNodeIdx = '';
        } else if (this.publishUrlSettings.showNodeIdx === '') {
            this.publishUrlSettings.showNode = '';
        }

        let url = <string> this.publishUrlSettings.mainURL;
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('?dl=0', '');
        }
        url = url.replace(/^[\"\']|[\"\']$/g, '');
        url = url.replace(/\//g, '%2F');

        let showViewerStr = '';
        if (this.publishUrlSettings.navMode !== 'dashboard') {
            const shownViewers = [];
            if (this.publishUrlSettings.showViewers[0]) { shownViewers.push('cad'); }
            if (this.publishUrlSettings.showViewers[1]) { shownViewers.push('geo'); }
            if (this.publishUrlSettings.showViewers[2]) { shownViewers.push('vr'); }
            if (this.publishUrlSettings.showViewers[3]) { shownViewers.push('console'); }
            if (this.publishUrlSettings.showViewers[4]) { shownViewers.push('doc'); }
            if (shownViewers.length < 5) {
                showViewerStr = '&showViewer=%5B' + shownViewers.join(',') + '%5D';
                if (shownViewers.indexOf((<string>this.publishUrlSettings.defaultViewer).split('=')[1]) === -1) {
                    this.publishUrlSettings.defaultViewer = '';
                }
            }
        }

        let helpSection = '';
        if (this.publishUrlSettings.defaultViewer === '&defaultViewer=doc' && this.publishUrlSettings.docSection !== '') {
            helpSection = '&docSection=' + this.publishUrlSettings.docSection;
        }

        let baseLink = window.location.origin;
        if (baseLink.indexOf('design-automation.github.io') !== -1) {
            baseLink += '/mobius-parametric-modeller-dev-0-7';
        }
        return `${baseLink}/${navPage}` +
            `?file=${url}${this.publishUrlSettings.showNode}${this.publishUrlSettings.showNodeIdx}` +
            `${showViewerStr}${this.publishUrlSettings.defaultViewer}${helpSection}`;

    }

    generateUrl() {
        const txtArea = document.getElementById('generatedLink');
        txtArea.innerHTML = this.generatePublishUrl();
    }

    generateEmbed() {
        const txtArea = document.getElementById('generatedLink');
        txtArea.innerHTML = `<iframe width='100%' height='600px' style='border: 1px solid black;' src="${this.generatePublishUrl()}"></iframe>`;
    }

    copyGeneratedText() {
        const txtArea = document.getElementById('generatedLink');
        if (!txtArea.innerHTML || txtArea.innerHTML === '') { return; }
        const text = txtArea.innerHTML;
        navigator.clipboard.writeText(text).then(
            () => this.dataService.notifyMessage('Copied text to clipboard.'));
        this.dataService.dialog.close();
    }

    async refresh_global_func(event: MouseEvent, func) {
        event.stopPropagation();
        const fileName = func.name + '.mob';
        const localFiles = JSON.parse(localStorage.getItem('mobius_backup_list'));
        let check = false;
        for (const f in localFiles) {
            if (localFiles[f] === fileName) {
                check = true;
            }
        }
        if (!check) {
            this.dataService.notifyMessage(`Error: ${func.name}.mob does not exists in local storage,\n` +
            `Unable to update Global Function ${func.name}`);
            return;
        }
        const result = await SaveFileComponent.loadFromFileSystem(fileName);
        if (!result) {
            return;
        }
        const file = Flatted.parse(result);
        file.flowchart.meta.selected_nodes = [file.flowchart.nodes.length - 1];
        // parse the flowchart
        const fl = file.flowchart;

        if (this.dataService.flowchart.subFunctions) {
            const subFunctions = this.dataService.flowchart.subFunctions;
            let i = 0;
            while (i < subFunctions.length) {
                const subFunc = subFunctions[i];
                if (subFunc.name.substring(0, func.name.length) === func.name) {
                    subFunctions.splice(i, 1);
                } else {
                    i++;
                }
            }
        } else {
            this.dataService.flowchart.subFunctions = [];
        }

        let funcName = fl.name.replace(/[^A-Za-z0-9_]/g, '_');
        if (funcName.match(/^[\d_]/)) {
            funcName = 'func' + funcName;
        }

        const documentation = {
            name: funcName,
            module: 'globalFunc',
            description: fl.description,
            summary: fl.description,
            parameters: [],
            returns: fl.returnDescription
        };
        func.flowchart = <IFlowchart>{
            id: fl.id ? fl.id : IdGenerator.getId(),
            name: fl.name,
            nodes: fl.nodes,
            edges: fl.edges
        };
        func.name = funcName;
        func.doc = documentation;
        func.importedFile = result;

        func.args = [];
        for (const prod of fl.nodes[0].procedure) {
            if (!prod.enabled || prod.type !== ProcedureTypes.Constant || prod.argCount === 0) { continue; }
            let v: string = prod.args[prod.argCount - 2].value || 'undefined';
            if (v[0] === '"' || v[0] === '\'') { v = v.substring(1, v.length - 1); }
            if (prod.meta.inputMode !== InputType.Constant) {
                documentation.parameters.push({
                    name: v,
                    description: prod.meta.description
                });
            }
            func.args.push(<IArgument>{
                name: v,
                value: prod.args[prod.argCount - 1].value,
                type: prod.meta.inputMode,
                isEntity: prod.selectGeom
            });
        }
        func.argCount = func.args.length;

        checkFlowchartValidity(fl);
        for (const i of fl.functions) {
            i.name = func.name + '_' + i.name;
            this.dataService.flowchart.subFunctions.push(i);
        }
        if (fl.subFunctions) {
            for (const i of fl.subFunctions) {
                i.name = func.name + '_' + i.name;
                this.dataService.flowchart.subFunctions.push(i);
            }
        }

        const end = fl.nodes[fl.nodes.length - 1];
        const returnProd = end.procedure[end.procedure.length - 1];
        if (returnProd.args[0].value) {
            func.hasReturn = true;
        } else {
            func.hasReturn = false;
        }
        for (const node of this.dataService.flowchart.nodes) {
            this.updateGlobalFuncProds(node.procedure, func);
            this.updateGlobalFuncProds(node.localFunc, func);
        }
        document.getElementById('tooltiptext').click();
        this.dataService.notifyMessage(`Updated Global Function ${func.name}`);
    }

    updateGlobalFuncProds(prodList: IProcedure[], globalFunc: IFunction) {
        for (const prod of prodList) {
            if (prod.type === ProcedureTypes.globalFuncCall && prod.meta.name === globalFunc.name) {
                if (prod.argCount === globalFunc.argCount + 1) {
                    for (let i = 0; i < globalFunc.args.length; i++) {
                        prod.args[i + 1].isEntity = globalFunc.args[i].isEntity;
                    }
                } else {
                    const oldArgs = prod.args;
                    prod.args = JSON.parse(JSON.stringify(globalFunc.args));
                    for (const newArg of prod.args) {
                        let mismatch = true;
                        newArg.name = newArg.name.toLowerCase();
                        for (const oldArg of oldArgs) {
                            if (newArg.name.toLowerCase() === oldArg.name.toLowerCase()) {
                                newArg.value = oldArg.value;
                                newArg.jsValue = oldArg.jsValue;
                                mismatch = false;
                                break;
                            }
                        }
                        if (mismatch) {
                            newArg.value = '';
                            newArg.jsValue = '';
                            newArg.invalidVar = true;
                        }
                    }
                    prod.args.unshift(oldArgs[0]);
                    prod.argCount = globalFunc.argCount + 1;
                }
            }
            if (prod.children) {
                this.updateGlobalFuncProds(prod.children, globalFunc);
            }
        }
    }

    download_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        const fname = `${fnData.name}.mob`;
        const blob = new Blob([fileString], {type: 'application/json'});
        DownloadUtils.downloadFile(fname, blob);
        this.closeDialog();
    }

    edit_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        const fileString = fnData.importedFile;
        // console.log(fnData);
        SaveFileComponent.saveToLocalStorage('___TEMP___.mob', fileString);
        // localStorage.setItem('temp_file', fileString);
        setTimeout(() => {
            let baseLink = window.location.origin;
            if (baseLink.indexOf('design-automation.github.io') !== -1) {
                baseLink += '/' + window.location.pathname.split('/')[1];
            }
            window.open(`${baseLink}/editor?file=temp`, '_blank');
        }, 200);
        this.closeDialog();
    }

    delete_global_func(event: MouseEvent, fnData) {
        event.stopPropagation();
        for (let i = 0; i < this.dataService.flowchart.functions.length; i++) {
            if (this.dataService.flowchart.functions[i] === fnData) {
                this.dataService.flowchart.functions.splice(i, 1);
                break;
            }
        }
        let j = 0;
        while (j < this.dataService.flowchart.subFunctions.length) {
            if (this.dataService.flowchart.subFunctions[j].name.substring(0, fnData.name.length) === fnData.name) {
                this.dataService.flowchart.subFunctions.splice(j, 1);
            } else {
                j++;
            }
        }
    }

    addGlobalFunc(event: MouseEvent) {
        document.getElementById('selectImportFile').click();
        this.openHeaderDialog(event, 'globalfunc');
    }

    addGlobalFuncLS(event: MouseEvent) {
        event.stopPropagation();
        this.dataService.dialog.close();
        this.dataService.openHeaderDialog('backup')
        this.dataService.setbackup_updateImported(true);
    }

    searchInlineFuncs() {
        const inputElement = <HTMLInputElement> document.getElementById('search_inline');
        let searchTerm;
        if (inputElement) {
            searchTerm = inputElement.value.trim().toLowerCase();
        } else {
            searchTerm = '';
        }

        const parameters = [];
        for (const prod of this.flowchart.nodes[0].procedure) {
            if (!prod.enabled || prod.type !== ProcedureTypes.Constant || prod.argCount === 0) { continue; }
            parameters.push(prod.args[0].value);
            let description = 'Global Parameter ' + prod.args[0].value;
            if (prod.meta.description) {
                description += ': ' + prod.meta.description;
            }
            this.inlineDocs['param_' + prod.args[0].value] = {
                description: description,
                module: '_parameters',
                name: prod.args[0].value,
                parameters: [],
                returns: undefined
            };
        }
        let allInlineFuncs = [['parameters', parameters]];
        allInlineFuncs = allInlineFuncs.concat(this.inlineFunc);

        if (searchTerm === '') {
            this.searchedInlineFunc = allInlineFuncs;
            return;
        }
        this.searchedInlineFunc = [];
        for (const fnCategory of this.inlineFunc) {
            if ((<string>fnCategory[0]).toLowerCase().indexOf(searchTerm) !== -1) {
                this.searchedInlineFunc.push(fnCategory);
                continue;
            }
            const funcs = [];
            for (const fn of fnCategory[1]) {
                if (fn.toLowerCase().indexOf(searchTerm) !== -1) {
                    funcs.push(fn);
                }
            }
            if (funcs.length > 0) {
                this.searchedInlineFunc.push([fnCategory[0], funcs]);
            }
        }
        setTimeout(() => {
            for (const cat of this.searchedInlineFunc) {
                const accordion = <HTMLInputElement> document.getElementById('inlinefunc_' + cat[0]);
                if (!accordion.classList.contains('opened')) {
                    accordion.classList.add('opened');
                }
            }
        }, 10);
    }

    openInlineMenu(event, id) {
        const inlineAcc = document.getElementById('inlineAcc_' + id);
        const inlineDiv = document.getElementById('inlinefunc_' + id);
        if (inlineDiv.classList.contains('opened')) {
            // event.target.classList.remove('opened');
            inlineDiv.classList.remove('opened');
            inlineAcc.classList.remove('opened');
        } else {
            // event.target.classList.add('opened');
            inlineDiv.classList.add('opened');
            inlineAcc.classList.add('opened');
        }
    }

    disableFocus(event) {
        event.preventDefault();
    }

    addInlineFunc(inlineFunc: string) {
        this.updateInlineHelpText(new MouseEvent(''), inlineFunc);
        let expressionElement = <HTMLTextAreaElement> document.activeElement;
        let selStart: number, selEnd: number;
        if (expressionElement && expressionElement.id === 'inlineExpression') {
            selStart = expressionElement.selectionStart;
            selEnd = expressionElement.selectionEnd;
        } else {
            expressionElement = <HTMLTextAreaElement> document.getElementById('inlineExpression');
            selStart = expressionElement.value.length;
            selEnd = expressionElement.value.length;
            expressionElement.focus();
        }
        const newSelStart = inlineFunc.indexOf('(');
        expressionElement.value =
            expressionElement.value.slice(0, selStart) +
            inlineFunc +
            expressionElement.value.slice(selEnd);
        expressionElement.dispatchEvent(inputEvent);
        if (newSelStart !== -1) {
            expressionElement.setSelectionRange(selStart + newSelStart + 1, selStart + inlineFunc.length - 1);
        } else {
            expressionElement.setSelectionRange(selStart + inlineFunc.length, selStart + inlineFunc.length);
        }
    }

    async insertInlineFunc() {
        const expressionElement = <HTMLTextAreaElement> document.getElementById('inlineExpression');
        this.dataService.focusedInput.value = expressionElement.value;
        this.dataService.focusedInput.dispatchEvent(inputEvent);
        this.dataService.focusedInput.focus();
        setTimeout(() => {
            this.dataService.dialog.close();
        }, 0);
    }

    async copyInlineFunc() {
        const expressionElement = <HTMLTextAreaElement> document.getElementById('inlineExpression');
        // expressionElement.focus();
        // expressionElement.setSelectionRange(0, expressionElement.value.length);
        // document.execCommand('copy', true);
        await navigator.clipboard.writeText(expressionElement.value);
        this.dataService.notifyMessage('Copied "' + expressionElement.value + '" to clipboard');
        setTimeout(() => {
            this.dataService.dialog.close();
        }, 0);
    }

    genInlineDoc(inlineFunc, func) {
        let fnString = ``;
        fnString += `**Description:** ${func.description}  \n  \n`;
        if (func.parameters && func.parameters.length > 0) {
            fnString += `**Parameters:**  \n`;
            for (const param of func.parameters) {
                if (!param) {continue; }
                const paramName = param.name.replace(/_/g, '\\_')
                fnString += `  * *${paramName}:* ${param.description}  \n`;
            }
        }
        if (func.returns) {
            fnString += `  \n**Returns:** ${func.returns}  \n`;
        }
        if (func.example) {
            fnString += `**Examples:**  \n`;
            for (const i in func.example) {
                if (!func.example[i]) {continue; }
                fnString += `  * ${func.example[i]}  \n`;
                if (func.example_info) {
                    fnString += `    ${func.example_info[i]}  \n`;
                }
            }
        }
        fnString = `## ${inlineFunc}  \n  \n  \n` + fnString + `  \n  \n`;
        return fnString
    }

    updateInlineHelpText(event: MouseEvent, inlineFunc: string, category?: string) {
        event.stopPropagation();
        let fnDoc;
        if (category && category === 'parameters') {
            fnDoc = this.inlineDocs['param_' + inlineFunc];
        } else {
            fnDoc = this.inlineDocs[inlineFunc.split('(')[0]];
        }
        if (!fnDoc) {
            this.inlineHelpText = `<h3>${inlineFunc}</h3><br><div></div>`;
            return;
        }
        this.inlineHelpText = this.genInlineDoc(inlineFunc, fnDoc)
    }

    getInlineHoverText(funcText: string, category: string) {
        if (typeof funcText !== 'string') {
            return funcText[1];
        }
        let fnDoc;
        if (category === 'parameters') {
            fnDoc = this.inlineDocs['param_' + funcText];
        } else {
            fnDoc = this.inlineDocs[funcText.split('(')[0]];
        }
        if (!fnDoc) {
            return '';
        }
        if (fnDoc.summary) {
            return fnDoc.summary;
        }
        if (fnDoc.description) {
            return fnDoc.description;
        }
        return '';
    }

    getRendererInfo() {
        if (this.dataService.rendererInfo.error) {
            return this.dataService.rendererInfo.error;
        } else {
            return this.dataService.rendererInfo.renderer;
        }
    }


    notifyMessage(event) {
        this.dataService.notifyMessage(event.target.value);
        event.target.value = '';
    }

    publishUpload(event) {
        document.getElementById('spinner-on').click();
        const fileStr = SaveFileComponent.fileDownloadString(this.dataService.file, true);
        console.log('~~~~~~~', fileStr.file)
        axios({
            method: 'PUT',
            url: API_ENDPOINT,
            data: {
                file: fileStr.file,
                filetype: 'mobius'
            }
        }).then(r => {
            if (!(<any>r.data).success) {
                console.log((<any>r.data).message);
                document.getElementById('spinner-off').click();
            } else {
                this.publishUrlSettings.mainURL = (<any>r.data).filename;
                this.urlValid = true;
                this.urlNodes = this.dataService.flowchart.nodes;
                console.log('successfully placed file');
                document.getElementById('spinner-off').click();
                this.openHeaderDialog(event, 'publish_url');
            }
        });
    }

    publishUrl(event) {
        this.openHeaderDialog(event, 'publish_url');
        this.publishUrlSettings.mainURL = '';
        this.urlValid = undefined;
    }


}
