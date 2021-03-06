import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IMobius } from '@models/mobius';
import { InputType } from '@models/port';
import { DataService } from '@services';
import { ProcedureTypes } from '@shared/models/procedure';
import { checkFlowchartValidity } from '@shared/parser';
import { checkMobFile } from '@shared/updateOldMobFile';
import {
    IdGenerator,
    parseMobFile,
    updateAframeViewerSettings,
    updateGeoViewerSettings,
    updateLocalViewerSettings,
} from '@utils';

import { SaveFileComponent } from './savefile.component';

const S3_BUCKET = 'https://mobius-modeller-publish-bucket.s3.amazonaws.com/';

@Component({
    selector: 'load-url',
    template:  `<button id='loadurl' class='btn' (click)="loadInputUrl()"></button>
                <input id='loadurl_input' type='text' class='url'>`,
    styles: [
              `
              button.btn{
                  visibility: hidden;
              };
              input.url {
                  visibility: hidden;
              }
              `
            ]
  })
// Component for loading a .mob file from a specific url into mobius.
export class LoadUrlComponent {

    constructor(private dataService: DataService, private router: Router) {}



    /*
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        LOAD URL PARAMETERS:

        file="<<file_url>>" -> load file on load

        node=<<node_index>> -> switch to node with index node_index

        showViewer=0 -> show all viewers
        showViewer=1 -> show GI viewer only
        showViewer=2 -> show Geo viewer only
        showViewer=3 -> show Console only
        showViewer=4 -> show Help only
        showViewer=[1,2,3] -> show combination of viewers listed above

        defaultViewer=console   -> show console on load
        defaultViewer=cad       -> show GI viewer on load
        defaultViewer=geo       -> show Geo viewer on load
        defaultViewer=vr        -> show vr viewer on load
        defaultViewer=doc       -> show help viewer on load
        <<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    */

    async loadStartUpURL(routerUrl: string): Promise<boolean> {
        const url = this.extractUrl(routerUrl);
        if (!url) { return; }
        const nogridCheck = routerUrl.indexOf('nogrid=true') !== -1
        if (routerUrl.indexOf('node=') !== -1) {
            let nodeID: any = routerUrl.split('node=')[1].split('&')[0];
            nodeID = Number(nodeID.replace(/%22|%27|'/g, ''));
            return await this.loadURL(url, nodeID, false, false, nogridCheck);
        } else {
            return await this.loadURL(url, null, false, false, nogridCheck);
        }
    }

    loadInputUrl() {
        const input: HTMLInputElement = <HTMLInputElement> document.getElementById('loadurl_input');
        const keepSettings: boolean = input.value.indexOf('keepSettings') !== -1;
        const url = this.extractUrl(input.value);
        this.loadURL(url, null, keepSettings, true);
        input.value = '';
    }

    extractUrl(rawUrl: string) {
        let url: any = rawUrl.split('file=');
        if (url.length <= 1 ) {
            return false;
        }
        if (url[1] === 'temp') {
            this.loadTempFile();
            return false;
        }
        url = url[1].split('&')[0];
        if (url[0] === '_') {
            url = atob(decodeURIComponent(url.substring(1)));
        } else {
            url = decodeURIComponent(url);
        }
        url = url.replace(/'|\s/g, '');
        if (url.indexOf('dropbox') !== -1) {
            url = url.replace('www', 'dl').replace('dl=0', 'dl=1');
        }
        return url;
    }

    async loadURL(url: string, nodeID?: number, loadURLSettings?: any, newParams?: any, nogridCheck?: boolean): Promise<boolean> {
        const p = new Promise((resolve) => {
            const request = new XMLHttpRequest();
            if (url.indexOf('/') === -1) {
                request.open('GET', S3_BUCKET + url);
                request.onload = () => {
                    if (request.status === 200) {
                        const f = parseMobFile(request.responseText);
                        if (!f) {
                            this.dataService.notifyMessage(`ERROR: Unable to read file...`);
                            throw new Error('ERROR: Unable to read file...');
                        }
                        if (!f.flowchart.id) {
                            f.flowchart.id = IdGenerator.getId();
                        }
                        const urlSplit = url.split('/');
                        const file: IMobius = {
                            __filetype__: 'mobius',
                            name: urlSplit[urlSplit.length - 1 ].split('.mob')[0],
                            author: f.author,
                            flowchart: f.flowchart,
                            version: f.version,
                            settings: f.settings || {}
                        };
                        // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

                        checkMobFile(file);
                        resolve(file);
                    } else {
                        resolve('File Retrieval Error');
                    }
                };
                request.onerror = () => {
                    resolve('File Retrieval Error');
                };
                request.send();
            } else {
                request.open('GET', url);
                request.onload = () => {
                    if (request.status === 200) {
                        const f = parseMobFile(request.responseText);
                        if (!f) {
                            this.dataService.notifyMessage(`ERROR: Unable to read file...`);
                            throw new Error('ERROR: Unable to read file...');
                        }
                        if (!f.flowchart.id) {
                            f.flowchart.id = IdGenerator.getId();
                        }
                        const urlSplit = url.split('/');
                        const file: IMobius = {
                            __filetype__: 'mobius',
                            name: urlSplit[urlSplit.length - 1 ].split('.mob')[0],
                            author: f.author,
                            flowchart: f.flowchart,
                            version: f.version,
                            settings: f.settings || {}
                        };
                        // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

                        checkMobFile(file);
                        resolve(file);
                    } else {
                        resolve('File Retrieval Error');
                    }
                };

                request.onerror = () => {
                    resolve('File Retrieval Error');
                };
                request.send();
            }
        });
        const loadeddata: any = await p;
        if (loadeddata === 'File Retrieval Error') {
            return false;
        }

        SaveFileComponent.clearModelData(this.dataService.flowchart);
        delete this.dataService.file.flowchart;
        this.dataService.file = loadeddata;
        if (nogridCheck) {
            const settings = JSON.parse(loadeddata.settings)
            settings.grid.show = false;
            settings.axes.show = false;
            loadeddata.settings = JSON.stringify(settings)
        }
        if (!loadURLSettings || !loadURLSettings.keepSettings) {
            if (updateGeoViewerSettings(loadeddata.settings)) {
                this.dataService.geoViewerSettingsUpdated = true;
            }
            if (updateAframeViewerSettings(loadeddata.settings)) {
                this.dataService.aframeViewerSettingsUpdated = true;
            }
            if (updateLocalViewerSettings(loadeddata.settings)) {
                this.dataService.giViewerSettingsUpdated = true;
            }
        }
        this.dataService.newFlowchart = true;
        if ((nodeID || nodeID === 0) && nodeID >= 0 && nodeID < loadeddata.flowchart.nodes.length) {
            loadeddata.flowchart.meta.selected_nodes = [nodeID];
            // this.router.navigate(['/editor']);
        } else if (this.dataService.node.type !== 'end') {
            loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];
        }
        checkFlowchartValidity(loadeddata.flowchart);
        if (newParams) {
            for (const prod of this.dataService.flowchart.nodes[0].procedure) {
                if (prod.type === ProcedureTypes.Constant && prod.args[0]) {
                    if (newParams[prod.args[0].value] !== undefined) {
                        prod.args[1].value = newParams[prod.args[0].value];
                    }
                    if (newParams[prod.args[0].jsValue] !== undefined) {
                        prod.args[1].value = newParams[prod.args[0].jsValue];
                    }
                    if (typeof prod.args[1].jsValue === 'object') {
                        prod.args[1].value = JSON.stringify(prod.args[1].jsValue);
                    }
                    if (prod.meta.inputMode === InputType.SimpleInput || prod.meta.inputMode === InputType.URL) {
                        prod.args[1].jsValue = prod.args[1].value;
                    }
                }
            }

        }
        setTimeout(() => {
            const zoomFlowchart = document.getElementById('zoomToFit');
            if (zoomFlowchart && (!loadURLSettings || !loadURLSettings.keepCamera)) { zoomFlowchart.click(); }
            let executeB = document.getElementById('executeButton');
            if (executeB && this.dataService.mobiusSettings.execute) { executeB.click(); }
            executeB = null;
            this.dataService.clearModifiedNode();
        }, 200);

        return true;
    }


    async loadTempFile() {
        let f = await SaveFileComponent.loadFromFileSystem('___TEMP___.mob');
        // let f: any = localStorage.getItem('temp_file');
        if (!f || f === 'error') { return; }    
        f = parseMobFile(f);
        if (!f.flowchart.id) {
            f.flowchart.id = IdGenerator.getId();
        }
        const loadeddata: IMobius = {
            __filetype__: 'mobius',
            name: f.name,
            author: f.author,
            flowchart: f.flowchart,
            version: f.version,
            settings: f.settings || {}
        };

        // file.flowchart.name = urlSplit[urlSplit.length - 1 ].split('.mob')[0];

        checkMobFile(loadeddata);
        loadeddata.flowchart.meta.selected_nodes = [loadeddata.flowchart.nodes.length - 1];

        SaveFileComponent.clearModelData(this.dataService.flowchart);
        delete this.dataService.file.flowchart;
        this.dataService.file = loadeddata;
        if (updateGeoViewerSettings(loadeddata.settings)) {
            this.dataService.geoViewerSettingsUpdated = true;
        }
        if (updateAframeViewerSettings(loadeddata.settings)) {
            this.dataService.aframeViewerSettingsUpdated = true;
        }
        if (updateLocalViewerSettings(loadeddata.settings)) {
            this.dataService.giViewerSettingsUpdated = true;
        }
        this.dataService.newFlowchart = true;
        this.router.navigate(['/editor']);
        checkFlowchartValidity(loadeddata.flowchart);
        this.dataService.clearModifiedNode();
        SaveFileComponent.deleteFile('___TEMP___.mob');

        setTimeout(() => {
            const zoomFlowchart = document.getElementById('zoomToFit');
            if (zoomFlowchart) { zoomFlowchart.click(); }
            let executeB = document.getElementById('executeButton');
            if (executeB && this.dataService.mobiusSettings.execute) { executeB.click(); }
            executeB = null;
        }, 200);

    }
}
